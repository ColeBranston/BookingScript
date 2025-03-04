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

Therefore, for a single user it may looklike:

---

    <user>Username = ""
    <user>Password = ""
    path = ""

---
