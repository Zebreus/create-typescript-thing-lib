import { addToIgnoreFile } from "helpers/addToIgnoreFile"

describe("Test add to ignore files", () => {
  it("should add to empty ignore file", async () => {
    const ignoreFileContent = await addToIgnoreFile("", "testtopic", "testfile1")
    expect(ignoreFileContent).toBe(`# testtopic
testfile1`)
  })

  it("should not modify existing entries in the ignore file", async () => {
    const ignoreFileContent = await addToIgnoreFile(
      `# testtopic2
testfile2

`,
      "testtopic",
      "testfile1"
    )
    expect(ignoreFileContent).toBe(`# testtopic2
testfile2


# testtopic
testfile1`)
  })

  it("should not add an already added entry to the ignore file", async () => {
    const ignoreFileContent = await addToIgnoreFile(
      `# testtopic
testfile1

`,
      "testtopic",
      "testfile1"
    )
    expect(ignoreFileContent).toBe(`# testtopic
testfile1

`)
  })

  it("should not add an already added entry to the ignore file even if its under a different topic", async () => {
    const ignoreFileContent = await addToIgnoreFile(
      `# testtopic2
testfile1

`,
      "testtopic",
      "testfile1"
    )
    expect(ignoreFileContent).toBe(`# testtopic2
testfile1

`)
  })

  it("should add the entry to the end of an existing topic, if it exists", async () => {
    const ignoreFileContent = await addToIgnoreFile(
      `# testtopic2
testfile1
# testtopic1
testfile3`,
      "testtopic2",
      "testfile2"
    )
    expect(ignoreFileContent).toBe(
      `# testtopic2
testfile1
testfile2
# testtopic1
testfile3`
    )
  })

  it("should add the entry to the end of an existing topic, but not behind closing newlines", async () => {
    const ignoreFileContent = await addToIgnoreFile(
      `# testtopic2
testfile0

testfile1



# testtopic1
testfile3`,
      "testtopic2",
      "testfile2"
    )
    expect(ignoreFileContent).toBe(
      `# testtopic2
testfile0

testfile1
testfile2



# testtopic1
testfile3`
    )
  })

  //   it("can add to empty topic at", async () => {
  //     const ignoreFileContent = await addToIgnoreFile(
  //       `# testtopic2
  // testfile1

  // `,
  //       "testtopic2",
  //       "testfile2"
  //     )
  //     expect(ignoreFileContent).toBe(`# testtopic2
  // testfile1
  // testfile2

  // `)
  //   })

  it("can add to topic at end of file", async () => {
    const ignoreFileContent = await addToIgnoreFile(
      `# testtopic2
testfile1

`,
      "testtopic2",
      "testfile2"
    )
    expect(ignoreFileContent).toBe(`# testtopic2
testfile1
testfile2

`)
  })
})
