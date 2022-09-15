import { createTypescriptThing } from "index"
import { runInDirectory } from "tests/runInDirectory"

it("logging functions get called a few times", async () => {
  await runInDirectory(async dir => {
    let logMessages = 0
    let logStates = 0
    await createTypescriptThing({
      path: dir,
      name: "test",
      type: "library",
      packageManager: "pnpm",
      gitOrigin: "git@github.com:isomorphic-git/test.empty.git",
      gitBranch: "master",
      logger: {
        logMessage: () => {
          logMessages += 1
        },
        logState: () => {
          logStates += 1
        },
      },
    })
    expect(logMessages).toBeGreaterThan(0)
    expect(logStates).toBeGreaterThan(0)
  })
}, 120000)

it("log state has all states finished", async () => {
  await runInDirectory(async dir => {
    const logStates: Record<string, "pending" | "active" | "completed" | "failed"> = {}
    await createTypescriptThing({
      path: dir,
      name: "test",
      type: "library",
      packageManager: "pnpm",
      gitOrigin: "git@github.com:isomorphic-git/test.empty.git",
      gitBranch: "master",
      logger: {
        logState: (id, options) => {
          if (options.state) {
            logStates[id] = options.state
          }
        },
      },
    })
    expect(Object.entries(logStates).filter(([, state]) => state !== "completed" && state !== "failed").length).toBe(0)
  })
}, 120000)
