import { loadExistingFile } from "helpers/loadExistingFile"
import { createTypescriptThing } from "index"
import { runInDirectory } from "tests/runInDirectory"

describe("Some tests", () => {
  it("Creates a nix shell file", async () => {
    await runInDirectory(async dir => {
      await createTypescriptThing({ path: dir, name: "test", type: "library", monorepo: false, repo: "test.com" })
      const file = await loadExistingFile(dir, "shell.nix")
      expect(file).toBeTruthy()
    })
  }, 120000)

  it("Creates a correct package.json file", async () => {
    await runInDirectory(async dir => {
      await createTypescriptThing({ path: dir, name: "test", type: "library", monorepo: false, repo: "test.com" })
      const packageJson = await loadExistingFile(dir, "package.json")
      expect(packageJson).toBeTruthy()
      const packageObject = JSON.parse(packageJson || "")
      expect(packageObject.name).toBe("test")
    })
  }, 120000)

  it("Launches something and I can use the debugger", async () => {
    await runInDirectory(async dir => {
      await createTypescriptThing({ path: dir, name: "test", type: "library", monorepo: false, repo: "test.com" })
    })
  }, 120000)
})
