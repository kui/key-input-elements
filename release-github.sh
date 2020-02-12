#!/bin/bash

set -eux

GH_USER="kui"
REPO="key-input-elements"

get_version() {
  python -c 'import json; print json.load(open("package.json"))["version"]'
}
TAG="v$(get_version)"
TAR_GZ="${REPO}-${TAG}.tar.gz"

rm -fr dist

npm run check
npm run debug-dist
npm run prod-dist

( cd dist && tar zcf "$TAR_GZ" *.js )

# Require https://github.com/aktau/github-release

GH_REL_OPTS="--user $GH_USER --repo $REPO --tag $TAG"

github-release release $GH_REL_OPTS \
               --draft

github-release upload $GH_REL_OPTS \
               --file "dist/$TAR_GZ" \
               --name "$TAR_GZ"

echo "See https://github.com/$GH_USER/$REPO/releases"
