import fs from "fs"
import { addPackageJsonToGit } from "helpers/addPackageJsonToGit"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { addPackageNpm } from "install-pnpm-package"
import { readCommit, resolveRef } from "isomorphic-git"
import { runInDirectory } from "tests/runInDirectory"

describe("Tests for updating repos", () => {
  test.concurrent("Updating creates an update commit", async () => {
    await runInDirectory(
      {
        type: "library",
        packageManager: "npm",
      },
      async source => {
        const dummyConfig = {
          targetDir: source,
          packageManager: "npm",
          gitCommits: true,
          gitRepo: true,
          logger: {
            logMessage: () => {},
            logState: () => {},
          },
          update: true,
        } as const
        const commitBeforeChange = await resolveRef({ fs, dir: source, ref: "HEAD" }).catch(() => undefined)
        expect(commitBeforeChange).toBeDefined()

        await addPackageNpm(["typescript@2"], {
          directory: source,
          type: "dev",
        })
        await addPackageJsonToGit(dummyConfig)
        await commitWithAuthor({ ...dummyConfig, update: false }, "Downgrade typescript")
        const commitAfterChange = await resolveRef({ fs, dir: source, ref: "HEAD" }).catch(() => undefined)
        expect(commitAfterChange).not.toBe(commitBeforeChange)

        await runInDirectory(
          {
            type: "library",
            packageManager: "npm",
            updateFrom: source,
          },
          async updatedDirectory => {
            const commitAfterUpdate = await resolveRef({ fs, dir: updatedDirectory, ref: "HEAD" }).catch(() => "")
            expect(commitAfterUpdate).toBeTruthy()
            expect(commitAfterUpdate).not.toBe(commitBeforeChange)
            expect(commitAfterUpdate).not.toBe(commitAfterChange)

            const commitOneBeforeUpdate = await (
              await readCommit({ fs, dir: updatedDirectory, oid: commitAfterUpdate })
            ).commit.parent[0]
            const commitTwoBeforeUpdate = await (
              await readCommit({ fs, dir: updatedDirectory, oid: commitOneBeforeUpdate })
            ).commit.parent[0]
            expect(commitTwoBeforeUpdate).toBe(commitBeforeChange)
          }
        )
      }
    )
  })
})
