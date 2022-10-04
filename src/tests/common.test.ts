import fs from "fs"
import { stat } from "fs/promises"
import { Config } from "helpers/generateConfig"
import { loadExistingFile } from "helpers/loadExistingFile"
import { findRoot, readCommit, resolveRef } from "isomorphic-git"
import { resolve } from "path"
import { sh } from "sh"
import { runInDirectory } from "tests/runInDirectory"

const types = ["library", "application", "reactcomponent", "nextjs"] as const

const packageManager = "npm"

describe.each(types)(
  "common tests for %s",
  type => {
    const config: (dir: string) => Config = (dir: string) => ({
      targetDir: dir,
      gitCommits: true,
      gitRepo: true,
      packageManager: packageManager,
      logger: {
        logMessage: () => {},
        logState: () => {},
      },
      update: false,
    })

    const options = {
      type: type,
      packageManager: packageManager,
      install: true,
    } as const

    test.concurrent("Creates a nix shell file", async () =>
      runInDirectory(options, async dir => {
        const file = await loadExistingFile(config(dir), "flake.nix")
        expect(file).toBeTruthy()
        const lockFile = await loadExistingFile(config(dir), "flake.lock")
        expect(lockFile).toBeTruthy()
      })
    )

    test.concurrent("Creates a correct package.json file", async () =>
      runInDirectory(options, async dir => {
        const packageJson = await loadExistingFile(config(dir), "package.json")
        expect(packageJson).toBeTruthy()
        const packageObject = JSON.parse(packageJson || "")
        expect(packageObject.name).toBe("testpackage")
      })
    )

    test.concurrent("Creates a typescript project file", async () =>
      runInDirectory(options, async dir => {
        const fileJson = await loadExistingFile(config(dir), "tsconfig.json")
        expect(fileJson).toBeTruthy()
        const fileObject = JSON.parse(fileJson || "")
        expect(typeof fileObject.compilerOptions).toBe("object")
      })
    )

    test.concurrent("Creates a prettier config file", async () =>
      runInDirectory(options, async dir => {
        const fileJson = await loadExistingFile(config(dir), ".prettierrc.json")
        expect(fileJson).toBeTruthy()
        const fileObject = JSON.parse(fileJson || "")
        expect(typeof fileObject).toBe("object")
      })
    )

    test.concurrent("Creates an eslint config file", async () =>
      runInDirectory(options, async dir => {
        const fileJson = await loadExistingFile(config(dir), ".eslintrc.json")
        expect(fileJson).toBeTruthy()
        const fileObject = JSON.parse(fileJson || "")
        expect(typeof fileObject).toBe("object")
      })
    )

    test.concurrent("Creates a jest config file", async () =>
      runInDirectory(options, async dir => {
        const fileJson = await loadExistingFile(config(dir), "jest.config.json")
        expect(fileJson).toBeTruthy()
      })
    )

    test.concurrent("Creates a lint-staged config file", async () =>
      runInDirectory(options, async dir => {
        const fileJson = await loadExistingFile(config(dir), ".lintstagedrc.json")
        expect(fileJson).toBeTruthy()
        const fileObject = JSON.parse(fileJson || "")
        expect(typeof fileObject).toBe("object")
      })
    )

    test.concurrent("Creates an executable precommit hook", async () =>
      runInDirectory(options, async dir => {
        const file = await loadExistingFile(config(dir), ".husky/pre-commit")
        expect(file).toBeTruthy()
        const statResult = await stat(resolve(dir, ".husky/pre-commit"))
        expect(statResult.mode & 0o111).toBe(0o111)
      })
    )

    test.concurrent("Creates vscode config files", async () =>
      runInDirectory(options, async dir => {
        const fileJson1 = await loadExistingFile(config(dir), ".vscode/settings.json")
        const fileJson2 = await loadExistingFile(config(dir), ".vscode/extensions.json")
        expect(fileJson1).toBeTruthy()
        expect(fileJson2).toBeTruthy()
        expect(typeof JSON.parse(fileJson1 || "")).toBe("object")
        expect(typeof JSON.parse(fileJson2 || "")).toBe("object")
      })
    )

    test.concurrent("Should not fail on nix develop", async () =>
      runInDirectory(options, async dir => {
        await expect(sh(`cd ${dir} ; nix develop --command true`)).resolves.toBeTruthy()
      })
    )

    test.concurrent("Should not fail on install", async () =>
      runInDirectory(options, async dir => {
        await expect(sh(`cd ${dir} ; nix develop --command ${packageManager} install`)).resolves.toBeTruthy()
      })
    )

    test.concurrent("Should not fail on test script", async () =>
      runInDirectory(options, async dir => {
        await expect(sh(`cd ${dir} ; nix develop --command ${packageManager} run test | tee`)).resolves.toBeTruthy()
      })
    )

    test.concurrent("Should not fail on lint script", async () =>
      runInDirectory({ ...options, install: true }, async dir => {
        await expect(sh(`cd ${dir} ; nix develop --command ${packageManager} run lint`)).resolves.toBeTruthy()
      })
    )

    test.concurrent("Should not fail on build script", async () =>
      runInDirectory(options, async dir => {
        await expect(sh(`cd ${dir} ; nix develop --command ${packageManager} run build`)).resolves.toBeTruthy()
      })
    )

    test.concurrent("Creates a git repo", async () =>
      runInDirectory(options, async dir => {
        const gitRoot = await findRoot({ fs, filepath: dir })
        expect(gitRoot).toBe(dir)
        const currentCommit = await resolveRef({ fs, dir, ref: "HEAD" })
        const commitInfo = await readCommit({ fs, dir, oid: currentCommit })
        expect(commitInfo.commit.author.name).toBe("Zebreus")
      })
    )

    test.concurrent("Updating does not change anything", async () => {
      await runInDirectory(
        {
          ...options,
          getOriginalPath: true,
          install: false,
        },
        async originalDir => {
          await runInDirectory(
            {
              ...options,
              updateFrom: originalDir,
              update: true,
              install: false,
            },
            async updatedDirectory => {
              const commitBeforeUpdate = await resolveRef({ fs, dir: originalDir, ref: "HEAD" }).catch(() => undefined)
              const commitAfterUpdate = await resolveRef({ fs, dir: updatedDirectory, ref: "HEAD" }).catch(
                () => undefined
              )
              expect(commitBeforeUpdate).toBeDefined()
              expect(commitAfterUpdate).toBeDefined()
              expect(commitBeforeUpdate).toBe(commitAfterUpdate)
            }
          )
        }
      )
    })

    if (type === "application") {
      test.concurrent("can launch the cli application", async () =>
        runInDirectory(options, async dir => {
          const result = await sh(`cd ${dir} ; nix develop --command ${packageManager} run start`)
          expect(result.stdout).toContain("You launched the application!")
        })
      )
    }
  },
  12000
)
