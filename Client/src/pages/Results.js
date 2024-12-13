import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Results.css";
import anakin from "../assets/Anakin.png";
import axios from "axios";

const Results = () => {
    const location = useLocation();
    const responseData = location.state?.responseData;

    const [imageUrls, setImageUrls] = useState({});
    const descriptions = {"E": "More outgoing, enjoys socializing", "I": "More reserved, enjoys solitude",
        "N": "More imaginative, enjoys abstract thinking", "S": "More practical, enjoys concrete thinking",
        "F": "More empathetic, enjoys emotional connections", "T": "More logical, enjoys problem-solving",
        "J": "Prefers structure, planning, organization, and likes to have matters settled", "P": " Prefers flexibility, spontaneity, adaptability, and likes to keep options open"};

    useEffect(() => {
        if (responseData && responseData.similar_characters) {
            const fetchImages = async () => {
                const fetchPromises = responseData.similar_characters.map(async (character, index) => {
                    try {
                        const res = await axios.post("http://127.0.0.1:5000/get-image", {
                            name: character.role,
                            movie: character.movie,
                        });
                        console.log(res.data)
                        const imageUrl = res.data?.image_url;
                        // Make sure your server returns {"image_url": "http://..."} at the end of search_character_image
                        return { index, imageUrl };
                    } catch (error) {
                        console.error("Error fetching image:", error);
                        return { index, imageUrl: null };
                    }
                });

                const results = await Promise.all(fetchPromises);
                // Create a new object mapping index -> imageUrl
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
    return (
        <div className="results-container">
            <h1 className="results-title">Your Personality Results</h1>
            <div className="mbti-type-container">
                <h2 className="mbti-heading">Your personality type is {mbti}</h2>
                <div className="mbti-descriptions">
                    {mbti.split('').map((letter, index) => (
                        <div key={index} className="mbti-letter-description">
                            <span className="mbti-letter">{letter}:</span>
                            <span className="mbti-text"> {descriptions[letter]}</span>
                        </div>
                    ))}
                </div>
            </div>
            {responseData.similar_characters.map((character, index) => (
                <div key={index} className="character-card">
                    <div className="character-image">
                        <img
                            src={imageUrls[index] || anakin}
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
