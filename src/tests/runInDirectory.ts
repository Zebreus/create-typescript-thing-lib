import { mkdtemp, rm } from "fs/promises"
import { tmpdir } from "os"
import { join } from "path"

export const runInDirectory = async <T>(testFunction: (dir: string) => T) => {
  const dir = await mkdtemp(join(tmpdir(), "cttl-test-"))
  try {
    await testFunction(dir)
  } finally {
    await rm(dir, { recursive: true })
  }
}
