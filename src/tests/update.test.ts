import fs from "fs"
import { commitWithAuthor } from "helpers/commitWithAuthor"
import { augmentJsonConfig } from "helpers/modifyJsonFile"
import { resolveRef } from "isomorphic-git"
import { runInDirectory } from "tests/runInDirectory"

describe("Tests for updating repos", () => {
  test.concurrent("Updating does not change anything", async () => {
    await runInDirectory(
      {
        type: "library",
        getOriginalPath: true,
      },
      async originalDir => {
        await runInDirectory(
          {
            type: "library",
            updateFrom: originalDir,
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

  test.concurrent("Updating does update the version", async () => {
    await runInDirectory(
      {
        type: "library",
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
        } as const
        await augmentJsonConfig(dummyConfig, "package.json", { devDependencies: { eslint: "0.0.0" } })
        await commitWithAuthor(dummyConfig, "Downgrade eslint")

        await runInDirectory(
          {
            type: "library",
            updateFrom: source,
          },
          async updatedDirectory => {
            const commitBeforeUpdate = await resolveRef({ fs, dir: source, ref: "HEAD" }).catch(() => undefined)
            const commitAfterUpdate = await resolveRef({ fs, dir: updatedDirectory, ref: "HEAD" }).catch(
              () => undefined
            )
            expect(commitBeforeUpdate).toBeDefined()
            expect(commitAfterUpdate).toBeDefined()
            expect(commitBeforeUpdate).not.toBe(commitAfterUpdate)
          }
        )
      }
    )
  })
})
