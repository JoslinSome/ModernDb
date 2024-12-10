from math import sqrt
import pandas as pd
from pymongo import MongoClient
import re
import os
from dotenv import load_dotenv
import requests

load_dotenv()
API_KEY = os.getenv("API_KEY")
SEARCH_ENGINE_ID =  os.getenv("SEARCH_ENGINE_ID")

def load_data(csv_file_path, db_name='personality', collection_name='prediction', batch_size=1000, mongo_host='localhost', mongo_port=27017):
    client = MongoClient(mongo_host, mongo_port)
    db = client[db_name]

    if collection_name in db.list_collection_names():
        print(f"The collection '{collection_name}' already exists. Exiting without inserting data.")
        return

    collection = db[collection_name]
    
    df = pd.read_csv(csv_file_path)
    
    data = df.to_dict(orient='records')
    
    total_records = len(data)
    for i in range(0, total_records, batch_size):
        batch = data[i:i+batch_size]
        try:
            collection.insert_many(batch)
        except Exception as e:
            print(f"Error inserting batch starting at index {i}: {e}")
    
    print(f"Successfully inserted data into {collection_name} collection.")

def calculate_distance(scores1, scores2):
    return sqrt(sum((s1 - s2) ** 2 for s1, s2 in zip(scores1, scores2)))

def find_closest_personality(prediction_collection, introversion_score, sensing_score, thinking_score, judging_score):

    input_scores = [introversion_score, sensing_score, thinking_score, judging_score]
    
    closest_personality = None
    personalities_checked = 0
    min_distance = float('inf')

    for person in prediction_collection.find():
        db_scores = [
            person.get("Introversion Score", 0),
            person.get("Sensing Score", 0),
            person.get("Thinking Score", 0),
            person.get("Judging Score", 0)
        ]

        personalities_checked += 1
        
        distance = calculate_distance(input_scores, db_scores)
        
        if distance < min_distance:
            min_distance = distance
            closest_personality = person["Personality"]
    
    return closest_personality, personalities_checked

def transform_url(url):
    match = re.search(r'/profile_images/(\d+)\.png', url)
    if match:
        profile_id = match.group(1)
        new_url = f"https://www.personality-database.com/profile/{profile_id}"
        return new_url
    else:
        raise ValueError("The provided URL does not match the expected format.")

def search_character_image(character_name):
    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "q": character_name,
        "cx": SEARCH_ENGINE_ID,
        "key": API_KEY,
        "searchType": "image",
        "num": 1,
    }

    response = requests.get(url, params=params, verify=False)
    if response.status_code == 200:
        data = response.json()
        if "items" in data:
            image_url = data["items"][0]["link"]
            print(f"Image URL for {character_name}: {image_url}")
            return image_url
        else:
            print("No images found.")
            return None
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return None
