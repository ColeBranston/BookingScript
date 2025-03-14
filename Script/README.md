# BookingScript

Western ACEB Selenium Room Booker

First Download this Chrome Driver: https://storage.googleapis.com/chrome-for-testing-public/132.0.6834.159/win32/chromedriver-win32.zip

Second Download Chrome -> Version: 132

---

Also create and run the virtual environment:

python -m venv .venv <br>
./.venv/Scripts/Activate.ps1

-> To Install the dependancies run: pip install -r requirements.txt

### Env Keys

Requires at least one user's username and password to function but can use as many as 7.

Follows this format for each user:

    ColeUsername = ""
    ColePassword = ""

and then trailing the bottom is the path for the chrome driver to run the selenium bot:

    path = ""

Therefore, for a single user it may look like:

---

    <user>Username = ""
    <user>Password = ""
    driverPath = 'chromedriver.exe'
    binaryPath = ''

---

The chrome driver is pre included with the repo, but download the coresponding browser at: https://storage.googleapis.com/chrome-for-testing-public/134.0.6998.88/win32/chrome-win32.zip

-> Otherwise make reference to this spreadsheet if other driver and browser version is wanted: https://googlechromelabs.github.io/chrome-for-testing/#stable
