export const sortAndStringify = (obj: unknown): string => {
  if (Array.isArray(obj)) {
    return "[" + obj.map(sortAndStringify).sort().join(",") + "]"
  }
  if (obj === null) {
    return "null"
  }
  if (obj === undefined) {
    return "undefined"
  }
  if (typeof obj === "object") {
    return (
      "{" +
      Object.keys(obj)
        .sort()
        .map(key => `${key}: ${sortAndStringify((obj as Record<string, unknown>)[key])}`)
        .join(",") +
      "}"
    )
  }
  return JSON.stringify(obj) + ""
}
