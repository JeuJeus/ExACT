#!/bin/bash

if ! command -v tamarin-prover &> /dev/null; then
    echo "tamarin-prover could not be found. Please install Tamarin and try again."
    exit 1
fi

npm install

if [ $? -ne 0 ]; then
  echo "Failed to install npm dependencies"
  kill $PROGRESS_PID
  exit 1
fi

rm -rf tamarin_results

python src/progress.py &
PROGRESS_PID=$!

npm run run-mvp

if [ $? -ne 0 ]; then
  echo "Failed to run run-mvp.js"
  kill $PROGRESS_PID
  exit 1
fi

npm run parse-logs

if [ $? -ne 0 ]; then
  echo "Failed to run parse-logs.js"
  kill $PROGRESS_PID
  exit 1
fi

kill $PROGRESS_PID

echo "Please run 'npm start' and open 'http://localhost:3000/' in your browser."
