from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import translators.server as ts
import sys


def do_the_job(text_request):
    if (text_request):
        options = Options()
        options.add_argument("--window-size=1920,1080")
        options.add_argument("--headless")
        driver = webdriver.Chrome(ChromeDriverManager().install(),
                                  options=options)
        try:
            id_to_en = ts.google(text_request,
                                 from_language='id',
                                 to_language='en')
            driver.get('https://www.paraphraser.io/')

            textinput = driver.find_element(By.XPATH,
                                            '//*[@id="input-content"]')
            textinput.send_keys(id_to_en)
            paraphrase_button = driver.find_element(
                By.XPATH, '//*[@id="paraphrase_now"]')
            paraphrase_button.click()

            WebDriverWait(driver, timeout=20).until(
                EC.text_to_be_present_in_element(
                    (By.XPATH, '//*[@id="percent-suggested"]'), '100%'))

            outputcontent = driver.find_element(
                By.XPATH, '//*[@id="output-content"]').text

            en_to_id = ts.google(outputcontent,
                                 from_language='en',
                                 to_language='id')
            return en_to_id
        finally:
            driver.close()
    else:
        return ''


text = sys.argv[1]

print(do_the_job(text))
