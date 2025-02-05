from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from dotenv import dotenv_values

env = dotenv_values(".env")

service = Service(executable_path=f"{env['path']}")
driver = webdriver.Chrome(service=service)

driver.get("https://rooms.eng.uwo.ca/")

button = driver.find_element(By.CLASS_NAME, "btnBackColorIndigo")
button.click()

userField = driver.find_element(By.ID, "userId")
userField.send_keys(f"{env['username']}")

passField = driver.find_element(By.ID, "password")
passField.send_keys(f"{env['password']}")

submitButton = driver.find_element(By.CLASS_NAME, "adt-primaryAction")
submitButton.click()

time.sleep(0.5)

link = driver.find_element(By.CLASS_NAME, "customLinkColor")
link.click()

time.sleep(7)

Rooms = {
    "ACEB-2437": [],
    "ACEB-2439": [],
    "ACEB-2445": [],
    "ACEB-2448": [],
    "ACEB-2450": [],
    "ACEB-3448": [],
    "ACEB-3450": [],
    "ACEB-4450": []
}

today = time.strftime("%A", time.localtime())

cards = WebDriverWait(driver, 10).until(
    EC.presence_of_all_elements_located((By.CLASS_NAME, "card"))
)

print(f"Found {len(cards)} cards")

for card in cards:
    try:
        card_body = WebDriverWait(card, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "card-body"))
        )
        header = card_body.find_element(By.CLASS_NAME, "card-title")
        date = card_body.find_element(By.CLASS_NAME, "textMedium")

        print(
            f"Processing card with header: {header.text} and date: {date.text}")

        if today in date.text:
            available_times = [
                times.text for times in card_body.find_elements(By.CLASS_NAME, "greenAvailable")
            ]

            print(
                f"Found available times: {available_times} for room: {header.text.split()[0]}")
            Rooms[header.text.split()[0]].extend(
                [times for times in available_times if "Available" not in times])

    except Exception as e:
        print("Error finding header:", e)

for room, times in Rooms.items():
    print(f"{room} : {times}")

input('Please click ENTER button to close application')
driver.quit()
