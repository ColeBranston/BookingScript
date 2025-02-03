from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
import time

from dotenv import dotenv_values

env = dotenv_values(".env")

service = Service(executable_path=f"{env['path']}")
driver = webdriver.Chrome(service=service)

driver.get("https://rooms.eng.uwo.ca/")

time.sleep(0.5)

button = driver.find_element("class name", "btnBackColorIndigo")
button.click()

time.sleep(0.5)

userField = driver.find_element(By.ID, "userId")
userField.send_keys(f"{env['username']}")

passField = driver.find_element(By.ID, "password")
passField.send_keys(f"{env['password']}")

time.sleep(0.5)

submitButton = driver.find_element(By.CLASS_NAME, "adt-primaryAction")
submitButton.click()

time.sleep(0.5)

link = driver.find_element(By.CLASS_NAME, "customLinkColor")
link.click()

time.sleep(20)

# Quitting the web app
# driver.quit()
