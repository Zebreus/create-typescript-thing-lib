import { loadExistingFile } from "helpers/loadExistingFile"
import { writeAndAddFile } from "helpers/writeAndAddFile"

export const addScriptToPackage = async (targetDir: string, scriptName: string, script: string) => {
  const packageJsonContent = (await loadExistingFile(targetDir, "package.json")) || "{}"
  const modifiedPackageJsonContent = await addScriptToPackageContent(packageJsonContent, scriptName, script)
  await writeAndAddFile(targetDir, "package.json", modifiedPackageJsonContent)
}

export const appendScriptToPackage = async (targetDir: string, scriptName: string, script: string) => {
  const packageJsonContent = (await loadExistingFile(targetDir, "package.json")) || "{}"
  const modifiedPackageJsonContent = await appendScriptToPackageContent(packageJsonContent, scriptName, script)
  await writeAndAddFile(targetDir, "package.json", modifiedPackageJsonContent)
}

export const addScriptToPackageContent = (packageJsonContent: string, scriptName: string, script: string) => {
  const packageJson = JSON.parse(packageJsonContent)
  const newPackage = {
    ...packageJson,
    scripts: {
      ...packageJson.scripts,
      [scriptName]: script,
    },
  }
  return JSON.stringify(newPackage, null, 2)
}

export const appendScriptToPackageContent = (packageJsonContent: string, scriptName: string, script: string) => {
  const packageJson = JSON.parse(packageJsonContent)
  const newPackage = {
    ...packageJson,
    scripts: {
      ...packageJson.scripts,
      [scriptName]: packageJson.scripts.scriptName ? `${packageJson.scripts.scriptName} && ${script}` : script,
    },
  }
  return JSON.stringify(newPackage, null, 2)
}
