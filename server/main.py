import pandas as pd
from pymongo import MongoClient
from mbti_func import *
from character_func import *

# Connect to MongoDB
client = MongoClient("localhost", 27017)
db = client.personality

load_data("server/mbti.csv", collection_name="prediction")
load_data("server/movie_char.csv", collection_name="characters")
store_random_mbti_questions('server/mbti_questions.json', 5)
print(get_random_mbti_questions()['J/P'])

prediction_collection = db.prediction
character_collection = db.characters


introversion_score = 5.678
sensing_score = 2.890
thinking_score = 7.678
judging_score = 8.469

closest_personality, personalities_checked = find_closest_personality(prediction_collection, introversion_score, sensing_score, thinking_score, judging_score)
print(f"The closest personality type is: {closest_personality}")
print(f"Number of personalites checked against in database: {personalities_checked}")

similar_characters = get_characters_by_upvotes(closest_personality, num_characters=1, collection_name="characters")
print(f"Your similar character is {similar_characters[0]['role']} from {similar_characters[0]['movie'].strip()}")