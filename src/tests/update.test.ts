import fs from "fs"
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
})
