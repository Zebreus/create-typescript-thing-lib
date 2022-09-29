import { createTypescriptThing } from "index"
import { sh } from "sh"
import { runInDirectory } from "tests/runInDirectory"

it("can enter nix shell", async () => {
  await runInDirectory(async dir => {
    await createTypescriptThing({
      path: dir,
      name: "test",
      type: "application",
      gitOrigin: "git@github.com:isomorphic-git/test.empty.git",
      gitBranch: "master",
      packageManager: "pnpm",
    })
    await expect(sh(`nix develop --command true`)).resolves.toBeTruthy()
  })
}, 120000)

it("can launch the cli application", async () => {
  await runInDirectory(async dir => {
    await createTypescriptThing({
      path: dir,
      name: "test",
      type: "application",
      gitOrigin: "git@github.com:isomorphic-git/test.empty.git",
      gitBranch: "master",
      packageManager: "pnpm",
    })
    const result = await sh(`cd ${dir} ; nix develop --command pnpm start`)
    expect(result.stdout).toContain("You launched the application!")
  })
}, 120000)

it("passes the linter task", async () => {
  await runInDirectory(async dir => {
    await createTypescriptThing({
      path: dir,
      name: "test",
      type: "application",
      gitOrigin: "git@github.com:isomorphic-git/test.empty.git",
      gitBranch: "master",
      packageManager: "pnpm",
    })
    await expect(sh(`cd ${dir} ; nix develop --command pnpm lint`)).resolves.toBeTruthy()
  })
}, 120000)

it("passes the test task", async () => {
  await runInDirectory(async dir => {
    await createTypescriptThing({
      path: dir,
      name: "test",
      type: "library",
      gitOrigin: "git@github.com:isomorphic-git/test.empty.git",
      gitBranch: "master",
      packageManager: "pnpm",
    })
    await expect(sh(`cd ${dir} ; nix develop --command pnpm test`)).resolves.toBeTruthy()
  })
}, 120000)
