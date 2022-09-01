export const addToIgnoreFile = async (file: string, topic: string, value: string) => {
  const lines = file ? file.split("\n") : []

  if (lines.find(line => line.trim() === value)) {
    return file
  }

  const topicStartIndex = lines.findIndex(line => line.trim() === `# ${topic}`)

  if (topicStartIndex === -1) {
    return lines.concat([`# ${topic}`, value]).join("\n")
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

  const newLines = lines.flatMap((line, index) => (index === newEntryPosition ? [line, value] : [line]))

  return newLines.join("\n")
}
