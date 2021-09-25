import stripAnsi from "strip-ansi";

import { WELCOME } from "./content.js";
import { lookup } from "./host.js";

/** SSH connection. */
export class Client {
  /**
   * Constructor.
   * @param {import("ssh2").Connection} conn
   */
  constructor(conn) {
    this.conn = conn;
    conn.once("error", this.stop);
    conn.on("authentication", this.handleAuth);
    conn.on("session", this.handleSession);
  }

  stop = () => {
    this.stream?.destroy();
    this.conn.end();
  }

  /**
   * Handle SSH authentication.
   * @param {import("ssh2").AuthContext} ctx
   */
  handleAuth = (ctx) => {
    if (ctx.method !== "keyboard-interactive") {
      ctx.reject(["keyboard-interactive"]);
      return;
    }

    ctx.prompt([
      { prompt: "IPv9 address: ", echo: true },
      { prompt: "Password: ", echo: false },
    ],
    ([name, password]) => {
      name = name || ctx.username;
      if (!/^\d{9}$/.test(name) || password.length !== 8) {
        ctx.reject();
        return;
      }

      this.host = lookup(name);
      ctx.accept();
    });
  }

  /**
   * Handle SSH session.
   * @param {() => import("ssh2").Session} accept
   */
  handleSession = (accept) => {
    const session = accept();
    this.conn.noMoreSessions = true;
    session.on("shell", (accept) => {
      this.stream = accept();
      this.stream.once("error", this.stop);
      this.stream.on("data", this.handleData);
      this.stream.write(WELCOME(this.host.name));
      this.writePrompt();
    });
  }

  /**
   * Handle command line.
   * @param {Buffer} data
   */
  handleData = (data) => {
    const line = stripAnsi(data.toString("utf-8")).trim();
    if (line.length > 0) {
      const argv = line.split(/\s+/);
      const output = this.host.handleCommand(this, argv);
      this.stream.write(output);
    }
    this.writePrompt();
  };

  /** Write command prompt. */
  writePrompt = () => {
    while (this.host.inbox.length > 0) {
      this.stream.write(`\nYO from ${this.host.inbox.shift()}`);
    }
    this.stream.write(`\n${this.host.name} $ `);
  };
}

/**
 * Accept SSH connection.
 * @param {import("ssh2").Connection} conn
 */
export function acceptConnection(conn) {
  new Client(conn); // eslint-disable-line no-new
}
