@echo off
setlocal EnableDelayedExpansion

set target_directory=C:\Users\Administrator\OneDrive\Desktop\BookingScript\BookingScript
cd /d %target_directory%

set counter_file=counter.txt

if not exist %counter_file% (
    echo 0 > %counter_file%
)

set /p counter=<%counter_file%
set /a counter+=1

echo %counter% > %counter_file%
echo Counter value: %counter%

git pull
git add . 2>> error.log
git commit -m "Making Changes" 2>> error.log
git push 2>> error.log

if %errorlevel% neq 0 (
    echo An error occurred. Check error.log for more details.
)