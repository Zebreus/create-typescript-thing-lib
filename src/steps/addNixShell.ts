import { commitWithAuthor } from "helpers/commitWithAuthor"
import { Config } from "helpers/generateConfig"
import { withStateLogger } from "helpers/withStateLogger"
import { writeAndAddFile } from "helpers/writeAndAddFile"

export const addNixShell = withStateLogger(
  { id: "nix shell", message: "Adding nix shell", completed: "Added nix shell" },
  async (config: Config) => {
    await writeAndAddFile(config, "flake.nix", generateNixFlake(config))
    await commitWithAuthor(config, "Add nix shell")
  }
)

const generateNixFlake = (config: Config) => {
  return `{
  inputs = {
    nixpkgs.url =
      "github:nixos/nixpkgs?rev=07b207c5e9a47b640fe30861c9eedf419c38dce0";
    flake-utils.url =
      "github:numtide/flake-utils?rev=c0e246b9b83f637f4681389ecabcb2681b4f3af0";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.simpleFlake {
      inherit self nixpkgs;
      name = "Package name";
      shell = { pkgs }:
        pkgs.mkShell {
          buildInputs = with pkgs; [ nodejs ${
            config.packageManager === "yarn" ? "yarn" : config.packageManager === "pnpm" ? "nodePackages.pnpm" : ""
          } ];
          shellHook = ''
            export PATH="$(pwd)/node_modules/.bin:$PATH"
          '';
        };

    };
}`
}
