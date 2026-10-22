#!/bin/bash
# keep Directus running locally (dev)
cd "$(dirname "$0")"; export PATH=/opt/node22/bin:$PATH
while true; do npx directus start; sleep 2; done
