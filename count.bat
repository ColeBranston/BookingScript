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

git add .
git commit -m "Making Changes"
git push
