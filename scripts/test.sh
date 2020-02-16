#!/usr/bin/bash
# Test script to be run with `npm test`.
# It has several command-line options:
# - cov: enables code coverage via Istanbul (nyc)
# - db: only does database tests (those take more time)
# - all: does all tests in the test/ directory. Don't mix with 'db'!
# - loud: enables stdout for pretest.sh and posttest.sh

DIR="./test"
FILES="$DIR/api_middleware.test.js $DIR/auth_middleware.test.js"
DBFLAG=false
BELOUD=""

for opt in "$@"
do
    case $opt in
        cov)
            SWITCH="nyc"
            ;;
        db)
            FILES="$DIR/db_middleware.test.js $DIR/db_middleware_fails.test.js"
            DBFLAG=true
            ;;
        all)
            FILES="$FILES $DIR/db_middleware.test.js $DIR/db_middleware_fails.test.js"
            DBFLAG=true
            ;;
        loud)
            BELOUD="loud"
            ;;
    esac
done

if [ "$DBFLAG" = true ]
then
    echo "Performing database migrations and seeding..."
    ./scripts/pretest.sh $BELOUD
fi

echo "Usage: npm test -- [OPTIONS]
Custom test script, possible command-line options:
- cov: enable code coverage output
- db: do database tests only (don't mix with 'all')
- all: do all tests (including DB)
- loud: print out databse preparation messages"
NODE_ENV=test $SWITCH npx mocha $FILES --timeout 20000

if [ "$DBFLAG" = true ]
then
    echo "Reverting database changes..."
    ./scripts/posttest.sh $BELOUD
fi
