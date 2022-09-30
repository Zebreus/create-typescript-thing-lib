import fs from "fs"
import { findRoot, readCommit, resolveRef } from "isomorphic-git"
import { getPreparedPath, runInDirectory } from "tests/runInDirectory"

test.concurrent("creates a git repo", async () =>
  runInDirectory(
    {
      disableGitCommits: false,
      disableGitRepo: false,
    },
    async dir => {
      const gitRoot = await findRoot({ fs, filepath: dir })
      expect(gitRoot).toBe(dir)
      const currentCommit = await resolveRef({ fs, dir, ref: "HEAD" })
      const commitInfo = await readCommit({ fs, dir, oid: currentCommit })
      expect(commitInfo.commit.author.name).toBe("Zebreus")
    }
  )
)

test.concurrent("creates no git commits if it is disabled", async () =>
  runInDirectory(
    {
      disableGitCommits: true,
      disableGitRepo: false,
    },
    async dir => {
      const gitRoot = await findRoot({ fs, filepath: dir })
      expect(gitRoot).toBe(dir)
      const currentCommit = await resolveRef({ fs, dir, ref: "HEAD" }).catch(() => undefined)
      expect(currentCommit).toBe("c03e131196f43a78888415924bcdcbf3090f3316")
    }
  )
)

test.concurrent("fails if git commits are enabled but there is no repo", async () => {
  await expect(
    getPreparedPath({
      disableGitCommits: false,
      disableGitRepo: true,
    })
  ).rejects.toThrow()
})

test.concurrent("creates no git repo or commits if both are disabled", async () =>
  runInDirectory(
    {
      disableGitCommits: true,
      disableGitRepo: true,
    },
    async dir => {
      const gitRoot = await findRoot({ fs, filepath: dir }).catch(() => undefined)
      expect(gitRoot).toBeUndefined()
      const currentCommit = await resolveRef({ fs, dir, ref: "HEAD" }).catch(() => undefined)
      expect(currentCommit).toBeUndefined()
    }
  )
)
