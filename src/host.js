import Debug from "debug";

import { HELP, YABS } from "./content.js";

export class Host {
  /**
   * @param {string} name
   */
  constructor(name) {
    this.name = name;
    this.debug = Debug(`host:${name}`);
    this.lastActivity = 0;
    this.inbox = [];
  }

  /**
   * @param {import("./conn.js").Client} client
   * @param {string[]} argv
   * @returns {string}
   */
  handleCommand(client, argv) {
    this.debug("command %s", argv);
    switch (argv.shift()) {
      case "help":
        return HELP;
      case "echo":
        return `${argv.join(" ")}\n`;
      case "yabs":
      case "yabs.sh":
        return YABS();
      case "who": {
        const list = Array.from(hosts.keys());
        list.sort((a, b) => a.localeCompare(b));
        return `${list.join("\n")}\n`;
      }
      case "yo": {
        const dest = argv[0];
        if (!/^\d{9}$/.test(dest)) {
          return "Inbox does not exist.\n";
        }
        const inbox = lookup(dest).inbox;
        inbox.push(this.name);
        while (inbox.length > 16) {
          inbox.shift();
        }
        return `Message sent to ${dest}.\n`;
      }
      case "exit":
        client.stop();
        return "\n";
      default:
        return "Bad command or filename\n";
    }
  }
}

/** @type {Map<string, Host>} */
const hosts = new Map();

/**
 * @param {string} name
 */
export function lookup(name) {
  let host = hosts.get(name);
  if (!host) {
    host = new Host(name);
    hosts.set(name, host);
    host.debug("create");
  }
  host.lastActivity = Date.now();
  return host;
}

setInterval(() => {
  const deleteBefore = Date.now() - 3600000;
  for (const [name, host] of hosts.entries()) {
    if (host.lastActivity < deleteBefore) {
      hosts.delete(name);
      host.debug("inactive-delete");
    }
  }
}, 60000);
