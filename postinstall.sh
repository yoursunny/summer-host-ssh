#!/bin/bash
set -eo pipefail
mkdir -p data
if ! [[ -f data/ssh_host_ecdsa_key ]]; then
  ssh-keygen -q -C '' -N '' -t ecdsa -f data/ssh_host_ecdsa_key
fi
