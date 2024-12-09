from math import sqrt
import pandas as pd
from pymongo import MongoClient

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