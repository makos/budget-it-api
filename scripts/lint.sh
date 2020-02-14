#!/usr/bin/bash

DIRS="migrations/ models/ routes/ routes/api seeders/ test/ utils/"
OPT=""

if [ "$1" == "--fix" ]; then
    OPT="--fix"
fi

npx eslint $DIRS $OPT
