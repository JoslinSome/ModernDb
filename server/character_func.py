from pymongo import MongoClient


def get_characters_by_upvotes(mbti, num_characters=1, db_name='personality', collection_name='character_collection',
                              mongo_host='localhost', mongo_port=27017):
    client = MongoClient(mongo_host, mongo_port)
    db = client[db_name]
    collection = db[collection_name]

    pipeline = [
        {
            "$match": {
                "mbti": mbti
            }
        },
        {
            "$addFields": {
                "upvotes": {
                    "$toInt": {
                        "$cond": {
                            "if": {
                                "$regexMatch": {
                                    "input": {
                                        "$arrayElemAt": [
                                            {
                                                "$split": [
                                                    {
                                                        "$trim": {
                                                            "input": {
                                                                "$toString": "$stat"
                                                            }
                                                        }
                                                    },
                                                    " / "
                                                ]
                                            },
                                            0
                                        ]
                                    },
                                    "regex": "^[0-9]+$"
                                }
                            },
                            "then": {
                                "$arrayElemAt": [
                                    {
                                        "$split": [
                                            {
                                                "$trim": {
                                                    "input": {
                                                        "$toString": "$stat"
                                                    }
                                                }
                                            },
                                            " / "
                                        ]
                                    },
                                    0
                                ]
                            },
                            "else": "0"
                        }
                    }
                }
            }
        },
        {
            "$sort": {
                "upvotes": -1
            }
        },
        {
            "$limit": num_characters
        }
    ]

    characters = list(collection.aggregate(pipeline))

    return characters


def get_personality_frequencies(db_name='personality', mongo_host='localhost', mongo_port=27017):
    client = MongoClient(mongo_host, mongo_port)
    db = client[db_name]
    collection = db['prediction']
    pipeline = [
        {
            "$group": {
                '_id': "$Personality",
                'count': {'$sum': 1}
            }
        },
        {
            "$lookup": {
                'from': "prediction",
                'pipeline': [{'$count': "total"}],
                'as': "results"
            }
        },
        {
            '$addFields': {
                'total': {'$arrayElemAt': ["$results.total", 0]}
            }
        },
        {
            '$project': {
                '_id': 1,
                'count': 1,
                'percentage': {
                    '$multiply': [
                        {'$divide': ["$count", "$total"]},
                        100
                    ]
                }
            }
        },
        {
            '$sort': {'count': -1}
        }
    ]
    stats = list(collection.aggregate(pipeline))
    return stats


