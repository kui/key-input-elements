#!/bin/sh
set -eux

git tag "$(node -p 'require("./package.json").version')"
