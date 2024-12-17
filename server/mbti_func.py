from math import sqrt
import pandas as pd
from pymongo import MongoClient
import re
import os
from dotenv import load_dotenv
import requests
import redis
import json
import random

load_dotenv()
API_KEY = os.getenv("API_KEY")
SEARCH_ENGINE_ID =  os.getenv("SEARCH_ENGINE_ID")

redis_client = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)

client = MongoClient('localhost', 27017)
db = client['personality']

def upload_data(num_mbti_questions=16):
    load_csv_data("Data/mbti.csv", collection_name="prediction")
    load_csv_data("Data/movie_char.csv", collection_name="characters")
    load_question_data("Data/mbti_questions.json")
    store_random_mbti_questions(int(num_mbti_questions/4))

def load_question_data(json_file_path, collection_name='questions', batch_size=1000):
    if collection_name in db.list_collection_names():
        print(f"The collection '{collection_name}' already exists. Exiting without inserting data.")
        return

    collection = db[collection_name]
    
    df = pd.read_json(json_file_path)
    
    data = df.to_dict(orient='records')
    
    total_records = len(data)
    for i in range(0, total_records, batch_size):
        batch = data[i:i+batch_size]
        try:
            collection.insert_many(batch)
        except Exception as e:
            print(f"Error inserting batch starting at index {i}: {e}")
    
    print(f"Successfully inserted data into {collection_name} collection.")

def store_random_mbti_questions(num_questions_from_each_category, collection_name='questions'):
    redis_client.flushdb()

    collection = db[collection_name]

    pipeline = [{"$sample": {"size": num_questions_from_each_category}}]
    selected_questions = list(collection.aggregate(pipeline))
    
    for question in selected_questions:
        for category, text in question.items():
            if category != '_id':
                redis_client.lpush(category, text)

def get_random_mbti_questions():
    random_questions = {}

    categories = redis_client.keys('*')

    for category in categories:
        stored_questions = redis_client.lrange(category, 0, -1)
        random_questions[category] = stored_questions
    print("E/I",len(random_questions["E/I"]),"Hello")
    return random_questions

def load_csv_data(csv_file_path, collection_name='prediction', batch_size=1000):
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


import requests


def search_character_image(character_name, movie):
    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "q": f"{character_name} {movie}",
        "cx": SEARCH_ENGINE_ID,
        "key": API_KEY,
        "searchType": "image",
        "num": 2,
    }

    try:
        response = requests.get(url, params=params, verify=False)

        if response.status_code == 200:
            data = response.json()
            if "items" in data:
                filtered_images = [
                    item["link"] for item in data["items"]
                    if "static.wikia.nocookie.net" not in item["link"]
                ]
                if filtered_images:
                    image_url = filtered_images[0]
                    print(f"Filtered Image URL for {character_name}: {image_url}")
                    return image_url
                else:
                    print("No valid images found after filtering.")
                    return None
            else:
                print("No images found.")
                return None
        else:
            print(f"Error: {response.status_code} - {response.text}")
            return None

    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return None
