import { commitWithAuthor } from "helpers/commitWithAuthor"
import { Config } from "helpers/generateConfig"
import { createJsonConfig } from "helpers/modifyJsonFile"
import { withStateLogger } from "helpers/withStateLogger"
import { writeAndAddFile } from "helpers/writeAndAddFile"

export const addNixShell = withStateLogger(
  { id: "nix shell", message: "Adding nix shell", completed: "Added nix shell" },
  async (config: Config, name: string) => {
    await writeAndAddFile(config, "flake.nix", generateNixFlake(config, name))
    await createJsonConfig(config, "flake.lock", generateFlakeLock())
    await commitWithAuthor(config, "Add nix shell")
  }
)

const generateNixFlake = (config: Config, name: string) => {
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
      name = "${name}";
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

const generateFlakeLock = () => {
  return {
    nodes: {
      "flake-utils": {
        locked: {
          lastModified: 1659877975,
          narHash: "sha256-zllb8aq3YO3h8B/U0/J1WBgAL8EX5yWf5pMj3G0NAmc=",
          owner: "numtide",
          repo: "flake-utils",
          rev: "c0e246b9b83f637f4681389ecabcb2681b4f3af0",
          type: "github",
        },
        original: {
          owner: "numtide",
          repo: "flake-utils",
          rev: "c0e246b9b83f637f4681389ecabcb2681b4f3af0",
          type: "github",
        },
      },
      "nixpkgs": {
        locked: {
          lastModified: 1664383307,
          narHash: "sha256-yvw3b8VOfcZtzoP5OKh0mVvoHglbEQhes6RSERtlxrE=",
          owner: "nixos",
          repo: "nixpkgs",
          rev: "07b207c5e9a47b640fe30861c9eedf419c38dce0",
          type: "github",
        },
        original: {
          owner: "nixos",
          repo: "nixpkgs",
          rev: "07b207c5e9a47b640fe30861c9eedf419c38dce0",
          type: "github",
        },
      },
      "root": {
        inputs: {
          "flake-utils": "flake-utils",
          "nixpkgs": "nixpkgs",
        },
      },
    },
    root: "root",
    version: 7,
  }
}
