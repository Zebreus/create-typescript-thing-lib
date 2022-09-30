import { appendScriptToPackageContent } from "helpers/addScriptToPackage"

it("adds to a new script", async () => {
  const originalPackage = {
    scripts: {},
  }
  const modifiedPackage = JSON.parse(
    appendScriptToPackageContent(JSON.stringify(originalPackage), "testscript", "testcommand")
  )

  expect(modifiedPackage.scripts.testscript).toBe("testcommand")
})

it("adds to a new script if there is no script objects", async () => {
  const originalPackage = {}
  const modifiedPackage = JSON.parse(
    appendScriptToPackageContent(JSON.stringify(originalPackage), "testscript", "testcommand")
  )

  expect(modifiedPackage.scripts.testscript).toBe("testcommand")
})

it("does not chain empty commands", async () => {
  const originalPackage = {
    scripts: {
      testscript: "",
    },
  }
  const modifiedPackage = JSON.parse(
    appendScriptToPackageContent(JSON.stringify(originalPackage), "testscript", "testcommand")
  )

  expect(modifiedPackage.scripts.testscript).toBe("testcommand")
})

it("does chain commands for an existing script", async () => {
  const originalPackage = {
    scripts: {
      testscript: "something",
    },
  }
  const modifiedPackage = JSON.parse(
    appendScriptToPackageContent(JSON.stringify(originalPackage), "testscript", "testcommand")
  )

  expect(modifiedPackage.scripts.testscript).toBe("something && testcommand")
})

it("does not modify other scripts", async () => {
  const originalPackage = {
    scripts: {
      other: "something",
    },
  }
  const modifiedPackage = JSON.parse(
    appendScriptToPackageContent(JSON.stringify(originalPackage), "testscript", "testcommand")
  )

  expect(modifiedPackage.scripts.other).toBe("something")
  expect(modifiedPackage.scripts.testscript).toBe("testcommand")
})
