import { exec } from "child_process"

export const sh = async (cmd: string) => {
  return new Promise<{ stdout: string; stderr: string }>(function (resolve, reject) {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        const error = new Error("Failed to execute command: " + cmd + "\nOutput: " + stdout + "\nError: " + stderr)
        err.stack = undefined
        //@ts-expect-error: we're adding a property to the error
        error.details = { ...err, stderr, stdout }
        error.stack = undefined
        reject(error)
      } else {
        resolve({ stdout, stderr })
      }
    })
  })
}
