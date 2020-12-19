import fs from "graceful-fs";
import ssh2 from "ssh2";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { acceptConnection } from "./conn.js";

const args = yargs(hideBin(process.argv))
  .option("bind", {
    type: "string",
    default: "127.0.0.1",
  })
  .option("port", {
    type: "number",
    default: 7866,
  }).parse();

const server = new ssh2.Server({
  hostKeys: [fs.readFileSync("data/ssh_host_ecdsa_key")],
});
server.on("error", () => undefined);
server.on("connection", acceptConnection);
server.listen(args.port, args.bind);
