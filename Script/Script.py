from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from datetime import datetime, timedelta
import time
import requests
from dotenv import dotenv_values

# ─── Helpers ──────────────────────────────────────────────────────────────────

def make_post_request(room, date, time_slot):
    url = 'http://localhost:5000/post-entry'
    data = {'Room': room, 'Date': date, 'Time': time_slot}
    resp = requests.post(url, json=data)
    print(resp.json())
    return resp

def addParticipants():
    # this function assumes a global `driver`
    AddEmail = driver.find_element(By.ID, "__BVID__42")
    emails = [
        "jbranst@uwo.ca",
        "cbranst2@uwo.ca",
        "ajoharap@uwo.ca",
        "hyousse8@uwo.ca",
        "mzhan775@uwo.ca",
    ]
    for email in emails:
        AddEmail.send_keys(email)
        # wait for and click the first row in the dropdown table
        first = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//table/tbody/tr[1]/td[1]"))
        )
        first.click()

# ─── Configuration ───────────────────────────────────────────────────────────

loginCred = {
    "Monday":    "Hadi",
    "Tuesday":   "Michael",
    "Wednesday": "Jack",
    "Thursday":  "Cole",
    "Friday":    "Aaryan",
}

# Load .env
env = dotenv_values(".env")
driver_path = env.get("driverPath")
binary_path = env.get("binaryPath")
if not driver_path or not binary_path:
    raise RuntimeError("driverPath and binaryPath must be set in .env")

# Selenium setup
service = Service(executable_path=driver_path)
options = Options()
options.binary_location = binary_path
driver = webdriver.Chrome(service=service, options=options)

# ─── Main Script ─────────────────────────────────────────────────────────────

local_time = time.localtime()
today = time.strftime("%A", local_time)

# pick today's user credentials
user_key = f"{loginCred[today]}Username"
pass_key = f"{loginCred[today]}Password"
username = env.get(user_key)
password = env.get(pass_key)
if not username or not password:
    raise RuntimeError(f"{user_key} and/or {pass_key} missing in .env")

# 1) Open site and click the “Continue” button
driver.get("https://rooms.eng.uwo.ca/")
WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.CLASS_NAME, "btnBackColorIndigo"))
).click()

# 2) Log in
driver.find_element(By.ID, "userId").send_keys(username)
print("Using username:", username)
driver.find_element(By.ID, "password").send_keys(password)
print("Using password:", password)
driver.find_element(By.CLASS_NAME, "adt-primaryAction").click()

# 3) Navigate to the booking page
WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.CLASS_NAME, "customLinkColor"))
).click()

# 4) Prepare to pick a date
Rooms = {r: [] for r in ["ACEB-2437","ACEB-2439","ACEB-2450","ACEB-3448","ACEB-2445","ACEB-2448","ACEB-3450","ACEB-4450"]}
RecTimes = {
    "Monday":    "10:30 AM-12:30 PM",
    "Tuesday":   "2:00 PM-4:00 PM",
    "Wednesday": "10:00 AM-12:00 PM",
    "Thursday":  "2:00 PM-3:30 PM",
    "Friday":    "1:30 PM-3:30 PM",
}

today_dt = datetime(local_time.tm_year, local_time.tm_mon, local_time.tm_mday)
target_dt = today_dt + timedelta(days=7)

# Click the “Other” button (index 2)
WebDriverWait(driver, 20).until(
    EC.presence_of_all_elements_located((By.CLASS_NAME, "btn"))
)[2].click()

# Open the calendar dropdown
WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.ID, "__BVID__35"))
).click()

# If month rolled over, click “next month”
if (target_dt.month != local_time.tm_mon):
    WebDriverWait(driver, 10).until(
        EC.presence_of_all_elements_located((By.CLASS_NAME, "flex-fill"))
    )[3].click()

# Select the exact day cell
day_id = f"__BVID__37__cell-{target_dt.strftime('%Y-%m-%d')}_"
WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.ID, day_id))
).click()

# 5) Scrape available cards for today-of-week
cards = WebDriverWait(driver, 10).until(
    EC.presence_of_all_elements_located((By.CLASS_NAME, "card"))
)
print(f"Found {len(cards)} cards")
for card in cards:
    try:
        body   = card.find_element(By.CLASS_NAME, "card-body")
        title  = body.find_element(By.CLASS_NAME, "card-title").text.split()[0]
        dateEL = body.find_element(By.CLASS_NAME, "textMedium").text
        if today in dateEL:
            times = [el.text for el in body.find_elements(By.CLASS_NAME, "greenAvailable")]
            # filter out filler labels
            Rooms[title].extend([t for t in times if "Available" not in t or "Available All Day" in t])
    except Exception as e:
        print("Error parsing card:", e)

# 6) Pick first room that’s “Available All Day”
for room, times in Rooms.items():
    print(f"{room}: {times}")
    if times and times[0] == "Available All Day":
        # select room
        sel = Select(WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CLASS_NAME, "custom-select"))
        ))
        sel.select_by_visible_text(room.replace("-", " "))
        print("Room selected:", room)

        # select times
        all_sel = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.CLASS_NAME, "custom-select"))
        )
        start_sel = Select(all_sel[1])
        end_sel   = Select(all_sel[2])
        start_txt, end_txt = RecTimes[today].split(" - ") if " - " in RecTimes[today] else RecTimes[today].split("-")
        start_sel.select_by_visible_text(start_txt.strip())
        end_sel.select_by_visible_text(end_txt.strip())
        print("Times selected:", start_txt, end_txt)

        # subject & attendees
        driver.find_element(By.ID, "input-11").send_keys("Studying")
        driver.find_elements(By.CLASS_NAME, "btn-block")[0].click()
        addParticipants()

        # submit
        driver.find_elements(By.TAG_NAME, "strong")[5].click()
        time.sleep(2)
        make_post_request(room.replace("-", " "), target_dt.strftime("%Y-%m-%d"), RecTimes[today])
        break

driver.quit()
