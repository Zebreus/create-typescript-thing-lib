export const addScriptToPackage = async (packageJsonContent: string, scriptName: string, script: string) => {
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

export const appendScriptToPackage = async (packageJsonContent: string, scriptName: string, script: string) => {
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
