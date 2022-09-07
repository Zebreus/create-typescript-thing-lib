import { commitWithAuthor } from "helpers/commitWithAuthor"
import { writeAndAddFile } from "helpers/writeAndAddFile"
import { PackageManager } from "install-pnpm-package/dist/detectPackageManager"

export const addNixShell = async (targetDir: string, packageManager: PackageManager) => {
  await writeAndAddFile(targetDir, "shell.nix", generateNixShell(packageManager))
  await commitWithAuthor(targetDir, "Add nix shell")
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
