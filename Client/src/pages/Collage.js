import React, {useState} from "react";
import "../styles/Collage.css";
import harry from "../assets/harry.jpeg";
import jackSparrow from "../assets/jacksparrow.jpeg";
import katniss from "../assets/katnisss.jpeg";
import Mater from "../assets/Mater.jpeg";
import MrIncredible from "../assets/mrincredible.jpeg";
import peterQuill from "../assets/peter quill.jpeg";
import Spongebob from "../assets/Spongebob.jpeg";
import anakin from "../assets/Anakin.png";
import Gru from "../assets/Gru.jpeg";
import Joker from "../assets/Joker.jpeg";
import Indiana from "../assets/indiana.jpeg";
import Megamind from "../assets/Megamind.jpeg";
import { useNavigate } from "react-router-dom";

const Collage = () => {
    const images = [
        harry,
        jackSparrow,
        katniss,
        Mater,
        MrIncredible,
        peterQuill,
        Spongebob,
        anakin,
        Gru,
        Joker,
        Indiana,
        Megamind,
    ];
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false)
    return (
        <div className="collage-container">
            <div className="collage-scroll">
                {images.map((image, index) => (
                    <img key={index} src={image} alt={`Movie Character ${index + 1}`} className="collage-image" />
                ))}
                {images.map((image, index) => (
                    <img key={`duplicate-${index}`} src={image} alt={`Duplicate ${index + 1}`} className="collage-image" />
                ))}
            </div>

            <div className="overlay">

                {
                    !visible?
                        <div className="text-container">
                            <h1>Welcome to the MBTI Quiz</h1>
                            <p>Discover which movie character matches your personality type!</p>
                            <button className="start-quiz-btn" onClick={()=>setVisible(true)}>Start Quiz</button>
                        </div>
                        :
                        <div className={"popUp"}>
                            <h1>What type of quiz would you like to take?</h1>
                            <div className={"row"}>
                                <div className={"option"}>
                                    <h2>Short quiz</h2>
                                    <p>16 questions, less accurate results</p>
                                    <button onClick={()=>navigate("/quiz?questions=16")} style={{backgroundColor: "#010f2d", color: "white", width: '150px', height: "30px", borderRadius: '10px'}}>Start</button>
                                </div>
                                <div className={"option"}>
                                    <h2>standard quiz</h2>
                                    <p>32 questions, accurate results</p>
                                    <button onClick={()=>navigate("/quiz?questions=32")} style={{backgroundColor: "#010f2d", color: "white", width: '150px', height: "30px", borderRadius: '10px'}}>Start</button>
                                </div>
                                <div className={"option"}>
                                    <h2>Comprehensive quiz</h2>
                                    <p>60 questions, most accurate results</p>
                                    <button onClick={()=>navigate("/quiz?questions=60")} style={{backgroundColor: "#010f2d", color: "white", width: '150px', height: "30px", borderRadius: '10px'}}>Start</button>
                                </div>
                            </div>
                        </div>

                }
            </div>
        </div>
    );
};

export default Collage;
