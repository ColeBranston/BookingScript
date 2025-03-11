@echo off

cd /d "C:\Users\Administrator\OneDrive\Desktop\BookingScript\BookingScript\Script"

:: Create and activate the virtual environment
python -m venv .venv
call .\.venv\Scripts\activate

pip install requirements.txt

:: Run the Flask server in a new command window and capture the window title
start "FlaskServer" /B cmd /c "python Backend\script_server.py"
:: Pause to ensure the Flask server is up and running
timeout /t 5

:: Get the process ID of the Flask server
for /f "tokens=2" %%a in ('tasklist ^| findstr /i "python.exe"') do set flask_pid=%%a

:: Run the Selenium script
python Script.py

:: Terminate the Flask server process using its process ID
taskkill /PID %flask_pid% /F

:: Deactivate the virtual environment after execution
call .\.venv\Scripts\deactivate
