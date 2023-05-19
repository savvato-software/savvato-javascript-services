#!/bin/bash

    cd projects/savvato-javascript-services/ && npm version patch && cd - && rm dist/ -rf && ng build savvato-javascript-services && cd dist/savvato-javascript-services/ && npm pack && cd - && date
