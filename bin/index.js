#!/usr/bin/env node

"use strict";

process.on("unhandledRejection", (err) => {
  throw err;
});

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const crossSpawn = require("cross-spawn");
const { exec } = require("child_process");

const args = hideBin(process.argv);
const formatArgs = require("minimist")(args);
const commandList = formatArgs._;

if (commandList.includes("analyze")) {
  const result = crossSpawn.sync(
    process.execPath,
    [require.resolve("../scripts/analyze"), `--path=${formatArgs.path}`],
    { stdio: "inherit" }
  );
  if (result.signal) {
    process.exit(1);
  }
  console.log(`${result.status} success`);
  process.exit(result.status);
  /*
    // 原生node 运行新的文件
    exec(`node scripts/analyze --path=${formatArgs.path}`, (error, stdout) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });
  */
} else {
  console.log(`Unkonw script: '${script}'.`);
}
