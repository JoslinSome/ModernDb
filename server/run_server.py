from flask import Flask, jsonify, request
from mbti_func import *
from flask_cors import CORS
from bson import ObjectId
from character_func import get_personality_frequencies, get_characters_by_upvotes
from mbti_func import prediction_collection, store_random_mbti_questions
app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})
@app.route("/get-question-set", methods=["POST"])
def question_set():
    num_questions = request.json.get("num_questions", None)
    print("Getting questions")
    if num_questions is None:
        return {"error": "Missing 'num_questions' in request"}, 400
    store_random_mbti_questions( num_questions)

    return get_random_mbti_questions()

@app.route("/find-closest-personality", methods=["POST"])
def closest_personality():
    input_data = request.json
    introversion_score = input_data.get("E/I", 0)
    sensing_score = input_data.get("S/N", 0)
    thinking_score = input_data.get("T/F", 0)
    judging_score = input_data.get("J/P", 0)
    print( introversion_score, sensing_score , thinking_score , judging_score )
    if any(score is None for score in [introversion_score, sensing_score, thinking_score, judging_score]):
        return jsonify({"error": "Missing required fields"}), 400

    closest_personality, personalities_checked = find_closest_personality(
        prediction_collection, introversion_score, sensing_score, thinking_score, judging_score
    )

    similar_characters = [
        {**char, "_id": str(char["_id"])} for char in get_characters_by_upvotes(closest_personality, num_characters=5, collection_name="characters")
    ]
    print(closest_personality, personalities_checked, similar_characters )
    return jsonify({
        "closest_personality": closest_personality,
        "personalities_checked": personalities_checked,
        "similar_characters": similar_characters
    })
@app.route("/get-image", methods=["POST"])
def get_character_image():
    name = request.json.get("name", None)
    movie = request.json.get("movie", None)
    return jsonify({"image_url": search_character_image(name,movie)})

@app.route("/get-stats", methods = ["GET"])
def get_stats():
    stats= get_personality_frequencies()
    return jsonify({"stats": stats})

if __name__ == "__main__":
    app.run(debug=True)
