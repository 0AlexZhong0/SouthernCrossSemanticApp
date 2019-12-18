from os import environ, getenv
from os.path import join, dirname
from dotenv import load_dotenv

# load and read the .env file
dotenv_path = join(dirname(__file__), ".env")
load_dotenv(dotenv_path)

MOBILE_DEV_MODE = True if getenv("MOBILE_DEV_MODE") == "true" else False
MY_IP_ADDRESS = getenv("MY_IP_ADDRESS")
IS_PROD = getenv("IS_PROD")
DEBUG_MODE = False if IS_PROD == "true" else True
