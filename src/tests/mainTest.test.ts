import { mkdtemp, rm } from "fs/promises"
import { loadExistingFile } from "helpers/loadExistingFile"
import { createTypescriptThing } from "index"
import { tmpdir } from "os"
import { resolve } from "path"
import { runInDirectory } from "tests/runInDirectory"

describe("Some tests", () => {
  describe("The structure of the generated directory looks ok", () => {
    let dir = ""
    beforeAll(async () => {
      dir = await mkdtemp(resolve(tmpdir(), "cttl-test-"))
      await createTypescriptThing({ path: dir, name: "test", type: "library", monorepo: false, repo: "test.com" })
    }, 120000)

    afterAll(async () => {
      await rm(dir, { recursive: true })
    })

    it("Creates a nix shell file", async () => {
      const file = await loadExistingFile(dir, "shell.nix")
      expect(file).toBeTruthy()
    })

    it("Creates a correct package.json file", async () => {
      const packageJson = await loadExistingFile(dir, "package.json")
      expect(packageJson).toBeTruthy()
      const packageObject = JSON.parse(packageJson || "")
      expect(packageObject.name).toBe("test")
    })

    it("Creates a typescript project file", async () => {
      const fileJson = await loadExistingFile(dir, "tsconfig.json")
      expect(fileJson).toBeTruthy()
      const fileObject = JSON.parse(fileJson || "")
      expect(typeof fileObject.compilerOptions).toBe("object")
    })

    it("Creates a prettier config file", async () => {
      const fileJson = await loadExistingFile(dir, ".prettierrc.json")
      expect(fileJson).toBeTruthy()
      const fileObject = JSON.parse(fileJson || "")
      expect(typeof fileObject).toBe("object")
    })

    it("Creates an eslint config file", async () => {
      const fileJson = await loadExistingFile(dir, ".eslintrc.json")
      expect(fileJson).toBeTruthy()
      const fileObject = JSON.parse(fileJson || "")
      expect(typeof fileObject).toBe("object")
    })

    it("Creates a jest config file", async () => {
      const fileJson = await loadExistingFile(dir, "jest.config.js")
      expect(fileJson).toBeTruthy()
    })

    it("Creates a lint-staged config file", async () => {
      const fileJson = await loadExistingFile(dir, ".lintstagedrc.json")
      expect(fileJson).toBeTruthy()
      const fileObject = JSON.parse(fileJson || "")
      expect(typeof fileObject).toBe("object")
    })
  })

  it("Launches something and I can use the debugger", async () => {
    await runInDirectory(async dir => {
      await createTypescriptThing({ path: dir, name: "test", type: "library", monorepo: false, repo: "test.com" })
    })
  }, 120000)
})
