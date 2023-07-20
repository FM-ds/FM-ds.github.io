from selenium import webdriver
import os
import json
import boto3

chrome_options = webdriver.ChromeOptions()
chrome_options.add_argument('--headless')
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-gpu')
chrome_options.add_argument('--window-size=1280x1696')
chrome_options.add_argument('--user-data-dir=/tmp/user-data')
chrome_options.add_argument('--hide-scrollbars')
chrome_options.add_argument('--enable-logging')
chrome_options.add_argument('--log-level=0')
chrome_options.add_argument('--v=99')
chrome_options.add_argument('--single-process')
chrome_options.add_argument('--data-path=/tmp/data-path')
chrome_options.add_argument('--ignore-certificate-errors')
chrome_options.add_argument('--homedir=/tmp')
chrome_options.add_argument('--disk-cache-dir=/tmp/cache-dir')
chrome_options.add_argument('user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36')
chrome_options.binary_location = os.getcwd() + "/bin/headless-chromium"

driver = webdriver.Chrome(chrome_options=chrome_options)

driver.get("https://www.example.com")

def lambda_handler(event, context):
    
    bucket = "eco-prices-scrapes"
    transactionToUpload = {
        "name": "testScrape",
        "pageSource": driver.page_source
    }

    uploadByteStream = bytes(json.dumps(transactionToUpload).encode( 'UTF-8' ))
    
    client = boto3.client("s3")
    client.put_object(Bucket=bucket, Key="testScrape", Body=uploadByteStream)

    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
