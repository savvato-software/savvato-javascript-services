#!/bin/bash

 rm dist/ -rf && ng build savvato-javascript-services && cd projects/savvato-javascript-services/ && npm version patch && cd - && cd dist/savvato-javascript-services/ && npm pack && cd - && date
