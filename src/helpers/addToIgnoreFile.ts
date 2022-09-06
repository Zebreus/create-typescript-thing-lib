export const addToIgnoreFile = async (fileContent: string, topic: string, entry: string | string[]) => {
  const entries = typeof entry === "string" ? [entry] : entry

  const lines = fileContent ? fileContent.split("\n") : []

  const newEntries = entries.filter(entry => !lines.find(line => line.trim() === entry))

  // Entries already exists
  if (newEntries.length === 0) {
    return fileContent
  }

  const topicStartIndex = lines.findIndex(line => line.trim() === `# ${topic}`)

  // New topic
  if (topicStartIndex === -1) {
    return lines.concat([`# ${topic}`, ...newEntries]).join("\n")
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

  const newLines = lines.flatMap((line, index) => (index === newEntryPosition ? [line, ...newEntries] : [line]))

  return newLines.join("\n")
}
