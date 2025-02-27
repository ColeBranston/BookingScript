from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support import expected_conditions as EC
from datetime import datetime, timedelta
import time
import requests

from dotenv import dotenv_values

# Function to make POST request
def make_post_request(room, date, time):
    url = 'http://localhost:5000/post-entry'
    data = {
        'Room': room,
        'Date': date,
        'Time': time
    }
    response = requests.post(url, json=data)
    print(response.json())
    return response

def addParticipants():
    AddEmail = driver.find_element(By.ID, "__BVID__42")
    AddEmail.send_keys("jbranst@uwo.ca")

    # Wait until the table is present
    table = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "table"))
    )

    # Click the first entry in the table
    first_entry = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located(
            (By.XPATH, "//table/tbody/tr[1]/td[1]"))
    )
    first_entry.click()

    AddEmail.send_keys("cbranst2@uwo.ca")

    # Wait until the table is present
    table = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "table"))
    )

    # Click the first entry in the table
    first_entry = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located(
            (By.XPATH, "//table/tbody/tr[1]/td[1]"))
    )
    first_entry.click()

    AddEmail.send_keys("ajoharap@uwo.ca")

    # Wait until the table is present
    table = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "table"))
    )

    # Click the first entry in the table
    first_entry = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located(
            (By.XPATH, "//table/tbody/tr[1]/td[1]"))
    )
    first_entry.click()

    AddEmail.send_keys("hyousse8@uwo.ca")

    # Wait until the table is present
    table = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "table"))
    )

    # Click the first entry in the table
    first_entry = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located(
            (By.XPATH, "//table/tbody/tr[1]/td[1]"))
    )
    first_entry.click()

    AddEmail.send_keys("mzhan775@uwo.ca")

    # Wait until the table is present
    table = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "table"))
    )

    # Click the first entry in the table
    first_entry = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located(
            (By.XPATH, "//table/tbody/tr[1]/td[1]"))
    )
    first_entry.click()


loginCred = {
    "Monday": "Hadi",
    "Tuesday": "Michael",
    "Wednesday": "Jack",
    "Thursday": "Cole",
    "Friday": "Aaryan"
}

local_time = time.localtime()
today = time.strftime("%A", local_time)

# Load environment variables
env = dotenv_values(".env")

# Set up the WebDriver
service = Service(executable_path=f"{env['path']}")
driver = webdriver.Chrome(service=service)

# Open the webpage
driver.get("https://rooms.eng.uwo.ca/")

# Click the initial button
button = driver.find_element(By.CLASS_NAME, "btnBackColorIndigo")
button.click()

# Enter username and password
userField = driver.find_element(By.ID, "userId")
userField.send_keys(f"{env[f'{loginCred[today]}Username']}")

print(f"Using: {env[f'{loginCred[today]}Username']}")

passField = driver.find_element(By.ID, "password")
passField.send_keys(f"{env[f'{loginCred[today]}Password']}")

print(f"Using: {env[f'{loginCred[today]}Password']}")


# Submit the login form
submitButton = driver.find_element(By.CLASS_NAME, "adt-primaryAction")
submitButton.click()

link = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.CLASS_NAME, "customLinkColor"))
)

link.click()

# Getting The Rooms
Rooms = {
    "ACEB-2437": [],
    "ACEB-2439": [],
    "ACEB-2450": [],
    "ACEB-3448": [],
    "ACEB-2445": [],
    "ACEB-2448": [],
    "ACEB-3450": [],
    "ACEB-4450": []
}

RecTimes = {
    "Monday": "10:30 AM-12:30 PM",
    "Tuesday": "2:00 PM-4:00 PM",
    "Wednesday": "10:00 AM-12:00 PM",
    "Thursday": "2:00 PM-3:30 PM",
    "Friday": "1:30 PM-3:30 PM"
}

# Convert to a datetime object
current_date = datetime(
    local_time.tm_year, local_time.tm_mon, local_time.tm_mday)

# Add 7 days
new_date = current_date + timedelta(days=7)

# Click the other button
OtherButton = WebDriverWait(driver, 20).until(
    EC.presence_of_all_elements_located((By.CLASS_NAME, "btn"))
)[2]

OtherButton.click()

# Open the calendar
CalenderButton = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.ID, "__BVID__35"))
)

CalenderButton.click()

# Click the next month button if needed
if str(local_time.tm_mon + 1) in new_date.strftime('%m'):
    dummyWait = driver.find_elements(By.CLASS_NAME, "flex-fill")

    nextMonthButton = WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, "flex-fill")))[3]

    nextMonthButton.click()

    print("********\n*   Clicked    *\n********")

print(new_date.strftime('%Y-%m-%d'))

# Select the day
DayButton = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located(
        (By.ID, f"__BVID__37__cell-{new_date.strftime('%Y-%m-%d')}_"))
)

DayButton.click()

# Getting Each Card
cards = WebDriverWait(driver, 10).until(
    EC.presence_of_all_elements_located((By.CLASS_NAME, "card"))
)
print(f"Found {len(cards)} cards")

# Getting the times for each room and assigning them to the hashmap
for card in cards:
    try:
        card_body = WebDriverWait(card, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "card-body"))
        )
        header = card_body.find_element(By.CLASS_NAME, "card-title")
        date = card_body.find_element(By.CLASS_NAME, "textMedium")

        if today in date.text:
            available_times = [
                times.text for times in card_body.find_elements(By.CLASS_NAME, "greenAvailable")
            ]
            Rooms[header.text.split()[0]].extend(
                [times for times in available_times if "Available" not in times or "Available All Day" in times])

    except Exception as e:
        print("Error finding header:", e)

# Print the current times to the terminal and select a booking time
for room, times in Rooms.items():
    print(f"{room} : {times}")

    if times and times[0] == 'Available All Day':
        select_button = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "custom-select"))
        )

        select_option = Select(select_button)

        correctRoom = select_option.select_by_visible_text(
            f'{room.replace("-", " ")}')
        print("Room Selected")

        allSelectButtons = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located(
                (By.CLASS_NAME, "custom-select"))
        )
        start = allSelectButtons[1]
        end = allSelectButtons[2]

        period = RecTimes[f'{today}'].split("-")

        start = Select(start)
        start.select_by_visible_text(
            f'{period[0]}')

        print("Start Time Selected")

        end = Select(end)
        end.select_by_visible_text(
            f'{period[1]}')

        print("End Time Selected")

        Subject = driver.find_element(By.ID, "input-11")
        Subject.send_keys("Studying")

        AddAttendeesButton = driver.find_elements(
            By.CLASS_NAME, "btn-block")[0]
        AddAttendeesButton.click()

        addParticipants()

        requestRoom = driver.find_elements(By.TAG_NAME, "strong")[5]

        requestRoom.click()  # Actually Submits the book request

        time.sleep(20)

        make_post_request(room, new_date.strftime('%Y-%m-%d'), RecTimes[f'{today}'])

        break  # Ending the loop once the room and time has been selected

    elif len(times) >= 1:
        pass

driver.quit()
