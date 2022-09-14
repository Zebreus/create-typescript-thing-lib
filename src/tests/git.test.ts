import fs from "fs"
import { createTypescriptThing } from "index"
import { findRoot, readCommit, resolveRef } from "isomorphic-git"
import { runInDirectory } from "tests/runInDirectory"

it("creates a git repo", async () => {
  await runInDirectory(async dir => {
    await createTypescriptThing({
      path: dir,
      name: "test",
      type: "library",
      packageManager: "pnpm",
      gitOrigin: "test.com",
      disableGitCommits: false,
      disableGitRepo: false,
    })
    const gitRoot = await findRoot({ fs, filepath: dir })
    expect(gitRoot).toBe(dir)
    const currentCommit = await resolveRef({ fs, dir, ref: "HEAD" })
    const commitInfo = await readCommit({ fs, dir, oid: currentCommit })
    expect(commitInfo.commit.author.name).toBe("Zebreus")
  })
}, 120000)

it("creates no git commits if it is disabled", async () => {
  await runInDirectory(async dir => {
    await createTypescriptThing({
      path: dir,
      name: "test",
      type: "library",
      packageManager: "pnpm",
      gitOrigin: "test.com",
      disableGitCommits: true,
      disableGitRepo: false,
    })
    const gitRoot = await findRoot({ fs, filepath: dir })
    expect(gitRoot).toBe(dir)
    const currentCommit = await resolveRef({ fs, dir, ref: "HEAD" }).catch(() => undefined)
    expect(currentCommit).toBeUndefined()
  })
}, 120000)

it("fails if git commits are enabled but there is no repo", async () => {
  await runInDirectory(async dir => {
    await expect(
      createTypescriptThing({
        path: dir,
        name: "test",
        type: "library",
        packageManager: "pnpm",
        gitOrigin: "test.com",
        disableGitCommits: false,
        disableGitRepo: true,
      })
    ).rejects.toThrow()
  })
}, 120000)

it("creates no git repo or commits if both are disabled", async () => {
  await runInDirectory(async dir => {
    await createTypescriptThing({
      path: dir,
      name: "test",
      type: "library",
      packageManager: "pnpm",
      gitOrigin: "test.com",
      disableGitCommits: true,
      disableGitRepo: true,
    })
    const gitRoot = await findRoot({ fs, filepath: dir }).catch(() => undefined)
    expect(gitRoot).toBeUndefined()
    const currentCommit = await resolveRef({ fs, dir, ref: "HEAD" }).catch(() => undefined)
    expect(currentCommit).toBeUndefined()
  })
}, 120000)
