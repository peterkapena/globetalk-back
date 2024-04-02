import type { JestConfigWithTsJest } from "ts-jest";
import('dotenv-flow').then(dotenv => dotenv.config());

const jestConfig: JestConfigWithTsJest = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js", "json", "node"],

  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts$",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^(\\.\\.?\\/.+)\\.jsx?$": "$1",
  },
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "\\.[jt]sx?$": [
      "ts-jest",
      {
        useESM: true,
        allowJs:false
      },
    ],
  },
};

export default jestConfig;
