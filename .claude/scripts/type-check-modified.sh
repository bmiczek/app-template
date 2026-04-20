#!/bin/sh
root=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
cd "$root"

git status --porcelain 2>/dev/null \
  | awk '{print $NF}' \
  | grep -E '\.tsx?$' \
  | awk -F/ 'NF>=2{print $1"/"$2}' \
  | sort -u \
  | while read -r pkg; do
      [ -f "$pkg/package.json" ] && (cd "$pkg" && pnpm type-check 2>&1)
    done
