#!/usr/bin/env bash
# Wrapper: la composición (video vertical + voz en off) vive en componer.mjs.
exec node "$(cd "$(dirname "$0")" && pwd)/componer.mjs" "$@"
