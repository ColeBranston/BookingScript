#!/bin/sh

# Change to the script directory
cd "$(dirname "$0")"

# Create and activate the virtual environment
python -m venv .venv
. .venv/bin/activate

# Install dependencies from requirements.txt
pip install -r requirements.txt

# Run the Flask server in the background
python Backend/script_server.py &
FLASK_PID=$!

# Pause to ensure the Flask server is up and running
sleep 5

# Verify Flask server is running
if ! ps -p $FLASK_PID > /dev/null; then
    echo "Flask server failed to start. Exiting."
    deactivate
    exit 1
fi

# Run the Selenium script
python Script.py

# Terminate the Flask server process using its process ID
kill $FLASK_PID

# Deactivate the virtual environment after execution
deactivate
