import { runInDirectory } from "tests/runInDirectory"

test.concurrent("Entrypoint for debugging", async () => {
  await runInDirectory(
    {
      type: "reactcomponent",
    },
    async dir => {
      console.log(dir)
      expect(true).toBeTruthy()
    }
  )
})
