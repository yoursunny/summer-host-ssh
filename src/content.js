import dateFns from "date-fns-tz";

const { utcToZonedTime, format } = dateFns;

export function WELCOME(name) {
  return `
Connected to IPv9 server ${name}.
Type 'help' to see available commands.
`;
}

export const HELP = `
Available commands

  help
    display this message
  echo [TEXT]
    display a line of text
  yabs
  yabs.sh
    execute Yet Another Benchmark Script
  who
    see who is online
  yo [IPv9 address]
    send a message to another server
  exit
    idle this server
`;

function rnd(base, range) {
  return Math.floor(base + range * Math.random());
}

export function YABS() {
  const date = utcToZonedTime(Date.now(), "Antarctica/McMurdo");
  return `
# ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## #
#              Yet-Another-Bench-Script              #
#                     v${format(date, "yyyy-MM-dd")}                    #
# https://github.com/masonr/yet-another-bench-script #
# ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## ## #

${format(date, "eee MMM dd HH:mm:ss % yyyy").replace("%", "NZT")}

Basic System Information:
---------------------------------
Processor  : ARMv5 Processor @ 1.00GHz
CPU cores  : 1 @ 999.${rnd(990, 9)} MHz
AES-NI     : ✔ Enabled
VM-x/AMD-V : ❌ Disabled
RAM        : 1.0 GiB
Swap       : 1.0 GiB
Disk       : 8.0 GiB

fio Disk Speed Tests (Mixed R/W 50/50):
---------------------------------
ERROR: No space left on device.

iperf3 Network Speed Tests (IPv9):
---------------------------------
Provider        | Location (Link)           | Send Speed      | Recv Speed
                |                           |                 |
Santa Claus     | North Pole (512K)         | busy            | busy
NASA            | Intl Space Station (192K) | ${rnd(100, 7)} Kbits/sec   | ${rnd(50, 40)} Kbits/sec
Matt Damon      | Mars (1G)                 | ${rnd(65, 24)} Kbits/sec    | ${rnd(100, 9)} Kbits/sec

Geekbench 5 Benchmark Test:
---------------------------------
Test            | Value
                |
Single Core     | ${rnd(120, 8)}
Multi Core      | ${rnd(120, 8)}
`;
}
