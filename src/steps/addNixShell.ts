import { commitWithAuthor } from "helpers/commitWithAuthor"
import { Config } from "helpers/generateConfig"
import { writeAndAddFile } from "helpers/writeAndAddFile"
import { PackageManager } from "install-pnpm-package/dist/detectPackageManager"

export const addNixShell = async (config: Config, packageManager: PackageManager) => {
  await writeAndAddFile(config, "shell.nix", generateNixShell(packageManager))
  await commitWithAuthor(config, "Add nix shell")
}

const generateNixShell = (packageManager: PackageManager) => {
  return `{ pkgs ? import <nixpkgs> { } }:
  with pkgs;
  mkShell {
    nativeBuildInputs = [
      nodejs
      ${packageManager === "yarn" ? "yarn" : packageManager === "pnpm" ? "nodePackages.pnpm" : ""}
      git
    ];
    shellHook = with pkgs; ''
      export PATH="$(pwd)/node_modules/.bin:$PATH"
    '';
  }`
}
