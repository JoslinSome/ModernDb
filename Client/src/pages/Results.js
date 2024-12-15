import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Results.css";
import anakin from "../assets/Anakin.png";
import axios from "axios";
import {type} from "@testing-library/user-event/dist/type";

const Results = () => {
    const location = useLocation();
    const responseData = location.state?.responseData;
    const [stats, setStats] = useState({})
    const [imageUrls, setImageUrls] = useState({});
    let statsArray;
    const descriptions = {"E": "More outgoing, enjoys socializing", "I": "More reserved, enjoys solitude",
        "N": "More imaginative, enjoys abstract thinking", "S": "More practical, enjoys concrete thinking",
        "F": "More empathetic, enjoys emotional connections", "T": "More logical, enjoys problem-solving",
        "J": "Prefers structure, planning, organization, and likes to have matters settled", "P": " Prefers flexibility, spontaneity, adaptability, and likes to keep options open"};
    const typeReactions={"ENFP": "This is the most common personality. You're kind of basic",
                         "ENTP": "You're an average person, congrats I guess",
                         "INTP": "This is pretty common. You're not special",
                         "ESFP": "Oh, you're an ESFP? That's so unique and quirky",
                         "ENFJ": "I didn't know people like you existed",
                         "INFP": "This is pretty common. You're not special",
                         "ISFP": "Woah, you don't see many ISFPs around, you must be special",
                         "ESTP": "Woah, you don't see many ESTPs around, you must be special",
                         "INFJ": "Woah, you don't see many INFJs around, you must be special",
                         "ENTJ": "Woah, you don't see many ENTJs around, you must be special",
                         "ISTP": "This is pretty rare, Not many people are like you",
                         "INTJ": "This is pretty rare, Not many people are like you",
                         "ESFJ": "You dont see that everyday, you're pretty unique",
                         "ESTJ": "You dont see that everyday, you're pretty unique",
                         "ISFJ": "Woah, That's super uncommon. Can I get your autograph?",
                         "ISTJ": "You're basically a unicorn. You're so unique and special",


    }
    useEffect(() => {
        if (responseData && responseData.similar_characters) {
            const fetchImages = async () => {
                const fetchPromises = responseData.similar_characters.map(async (character, index) => {
                    try {
                        const res = await axios.post("http://127.0.0.1:5000/get-image", {
                            name: character.role,
                            movie: character.movie,
                        });
                        const imageUrl = res.data?.image_url;
                        console.log(character.role,imageUrl)
                        const statsRes = await axios.get("http://127.0.0.1:5000/get-stats")
                        console.log(statsRes.data.stats, typeof(statsRes.data.stats))
                        setStats(statsRes.data.stats)
                        return { index, imageUrl };
                    } catch (error) {
                        console.error("Error fetching image:", error);
                        return { index, imageUrl: null };
                    }
                });

                const results = await Promise.all(fetchPromises);
                const newImages = {};
                results.forEach(({index, imageUrl}) => {
                    if (imageUrl) {
                        newImages[index] = imageUrl;
                    }
                });
                setImageUrls(newImages);
            };

            fetchImages();
        }
    }, [responseData]);

    if (!responseData) {
        return <p>No data available.</p>;
    }
    const mbti = responseData.similar_characters[0].mbti;
    let prioritizedStats;
    if(stats && mbti) {
         prioritizedStats = Object.values(stats).sort((a, b) => {
            return a._id === mbti ? -1 : b._id === mbti ? 1 : 0;
        });
    }

    return (
        <div className="results-container">
            <h1 className="results-title">Your Personality Results</h1>
            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: "20px",
                alignItems: "flex-start",
                gap: '10px'
            }}>
                <div className="mbti-type-container">
                    <h2 className="mbti-heading">Your personality type is {mbti}</h2>
                    <p className="mbti-reaction">{typeReactions[mbti]}</p>
                    <div className="mbti-descriptions">
                        {mbti.split('').map((letter, index) => (
                            <div key={index} className="mbti-letter-description">
                                <span className="mbti-letter">{letter}:</span>
                                <span className="mbti-text"> {descriptions[letter]}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mbti-stat-container">
                    <h2>Database MBTI Stats</h2>
                    <table className="mbti-table">
                        <thead>
                        <tr>
                            <th>Personality Type</th>
                            <th>Count</th>
                            <th>Percentage</th>
                        </tr>
                        </thead>
                        <tbody>
                        {prioritizedStats.map((stat, index) => (
                            <tr
                                key={index}
                                className={stat._id === mbti ? "mbti-row-highlight" : "mbti-row"}
                            >
                                <td className="mbti-cell">{stat._id}</td>
                                <td className="mbti-cell">{stat.count}</td>
                                <td className="mbti-cell">{stat.percentage.toFixed(2)}%</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>


                </div>
            </div>

            <h2>Similar characters to you</h2>
            {responseData.similar_characters.map((character, index) => (
                <div key={index} className="character-card">
                    <div className="character-image">
                        <img
                            src={imageUrls && imageUrls[index]}
                            alt={character.role}
                            className="character-img"
                        />
                    </div>
                    <div className="character-details">
                        <h2 className="character-role">{character.role}</h2>
                        <p><strong>Movie:</strong> {character.movie}</p>
                        <p><strong>MBTI:</strong> {character.mbti}</p>
                        <p><strong>Enneagram:</strong> {character.enneagram}</p>
                        <p><strong>Upvotes:</strong> {character.upvotes}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Results;
