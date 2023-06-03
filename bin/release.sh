#!/bin/bash

# Check if user is logged in
if npm whoami &> /dev/null; then
    echo "NPM login verified. Continuing..."
else
    echo "You need to run 'npm login' first. Aborting the script."
    exit 1
fi

# Restoring package*.json files
find . \( -path "./node_modules" -prune \) -o \( -path "./projects/*" -name "package*.json" -type f -exec git restore -- {} + \)

rm dist/ -rf && ng build savvato-javascript-services && cd projects/savvato-javascript-services/ && npm version patch && cd - && cd dist/savvato-javascript-services/ && npm pack && cd - && date

cd ~/src/savvato-javascript-services/ && cd dist/savvato-javascript-services && npm publish
