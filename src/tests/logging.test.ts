import { runInDirectory } from "tests/runInDirectory"

test.concurrent(
  "logging functions get called a few times",
  async () => {
    const logMessages = jest.fn()
    const logStates = jest.fn()
    const loggedStates: Record<string, "pending" | "active" | "completed" | "failed"> = {}

    await runInDirectory(
      {
        name: "test-cachebuster46345",
        logger: {
          logMessage: () => {
            logMessages()
          },
          logState: (id, options) => {
            logStates()
            if (options.state) {
              loggedStates[id] = options.state
            }
          },
        },
      },
      async () => {
        expect(logMessages).toHaveBeenCalled()
        expect(logStates).toHaveBeenCalled()
        expect(
          Object.entries(loggedStates).filter(([, state]) => state !== "completed" && state !== "failed").length
        ).toBe(0)
      }
    )
  },
  120000
)
