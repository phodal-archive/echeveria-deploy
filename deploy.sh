#!/bin/bash

set -o errexit -o nounset

rev=$(git rev-parse --short HEAD)

cd stage/

git init
git config user.name "Robot"
git config user.email "robot@phodal.com"

git remote add upstream "https://$GH_TOKEN@github.com/phodal-archive/echeveria-deploy-test.git"
git fetch upstream
git reset upstream/gh-pages

git clone https://github.com/designiot/designiot.github.io testdir

mv testdir/* .
rm -rf testdir

rm CNAME
echo "echeveria-deploy-test.phodal.com" > CNAME

touch .

git add -A .
git commit -m "rebuild pages at ${rev}"
git push -q upstream HEAD:gh-pages
