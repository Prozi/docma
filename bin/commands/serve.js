"use strict";

// -------------------------
// Docma CLI `serve` command
// -------------------------

const path = require("path");
const { execSync } = require("child_process");

module.exports = function serve(dirname, config) {
    if (!config.quiet) {
        console.log(`Runs at port ${config.port}`);
    }

    let server = "node_modules/chef-express/index.js";
    let args =
        process.argv.slice(3, process.argv.length).join(" ") ||
        `docs --port ${config.port}`;

    let command = `node ${server} ${args}`;

    console.log(command);

    return execSync(command, { encoding: "utf8" });
};
