import { commitWithAuthor } from "helpers/commitWithAuthor"
import { Config } from "helpers/generateConfig"
import { writeAndAddFile } from "helpers/writeAndAddFile"

export const addNixShell = async (config: Config) => {
  await writeAndAddFile(config, "shell.nix", generateNixShell(config))
  await commitWithAuthor(config, "Add nix shell")
}

const generateNixShell = (config: Config) => {
  return `{ pkgs ? import <nixpkgs> { } }:
  with pkgs;
  mkShell {
    nativeBuildInputs = [
      nodejs
      ${config.packageManager === "yarn" ? "yarn" : config.packageManager === "pnpm" ? "nodePackages.pnpm" : ""}
      git
    ];
    shellHook = with pkgs; ''
      export PATH="$(pwd)/node_modules/.bin:$PATH"
    '';
  }`
}
