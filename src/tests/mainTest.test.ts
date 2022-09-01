import { createTypescriptThing } from "index"
import { runInDirectory } from "tests/runInDirectory"

describe("Some tests", () => {
  it("Launches something and I can use the debugger", async () => {
    await runInDirectory(async dir => {
      await createTypescriptThing({ path: dir, name: "test", type: "library", monorepo: false, repo: "test.com" })
    })
  }, 120000)
})
