export const addToIgnoreFile = async (fileContent: string, topic: string, entry: string) => {
  const lines = fileContent ? fileContent.split("\n") : []

  // Entry already exists
  if (lines.find(line => line.trim() === entry)) {
    return fileContent
  }

  const topicStartIndex = lines.findIndex(line => line.trim() === `# ${topic}`)

  // New topic
  if (topicStartIndex === -1) {
    return lines.concat([`# ${topic}`, entry]).join("\n")
  }

  const topicLength = lines.slice(topicStartIndex + 1).findIndex(line => line.trim().startsWith(`# `))

  const topicLines = lines.slice(
    topicStartIndex + 1,
    topicLength === -1 ? undefined : topicLength + topicStartIndex + 1
  )
  const emptyLinesAfterLastEntry = topicLines.reduceRight(
    (acc, line) =>
      acc.foundEntry
        ? acc
        : line.trim() === "" || line.startsWith("#")
        ? { ...acc, emptyLines: acc.emptyLines + 1 }
        : { ...acc, foundEntry: true },
    { emptyLines: 0, foundEntry: false }
  )

  const newEntryPosition = topicStartIndex + topicLines.length - emptyLinesAfterLastEntry.emptyLines

  const newLines = lines.flatMap((line, index) => (index === newEntryPosition ? [line, entry] : [line]))

  return newLines.join("\n")
}
