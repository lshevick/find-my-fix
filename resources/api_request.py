import requests
import os

url = "https://car-data.p.rapidapi.com/cars/types"

headers = {
	"X-RapidAPI-Key": os.environ['CAR_API_KEY'],
	"X-RapidAPI-Host": "car-data.p.rapidapi.com"
}

response = requests.request("GET", url, headers=headers)

print(response.text)