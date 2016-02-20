#!/usr/bin/env node

var argv = require("yargs")
  .usage("Usage: $0 [options]")
  .boolean("w")
  .describe("w", "Watch for changes and rebuild")
  .alias("w", "watch")
  .string("o")
  .describe("o", "Output file to write to. By default will write to stdout")
  .alias("o", "out")
  .help("h")
  .alias("h", "help")
  .argv;

var pilfer = require("../lib/main");

pilfer(argv);
