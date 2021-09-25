const fs = require("node:fs");
const execa = require("execa");

if (!fs.existsSync("data")) {
  fs.mkdirSync("data");
}

if (!fs.existsSync("data/ssh_host_ecdsa_key")) {
  execa.commandSync("ssh-keygen -q -N '' -t ecdsa -f data/ssh_host_ecdsa_key");
}
