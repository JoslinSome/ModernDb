import React, {useEffect, useState} from "react";
import questionsData from "../assets/mbti_questions_50_each.json";
import "../styles/Quiz.css";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";

const Quiz = ({}) => {
    const [questions, setQuestions] = useState({})
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const questionAmount = searchParams.get("questions") || 0;
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Wmpanadas")
                const response = await axios.post("http://127.0.0.1:5000/get-question-set", {
                    num_questions: questionAmount/4,
                });
                setQuestions(response.data);
                console.log(response.data)
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, []);
    const allQuestions = Object.entries(questions).flatMap(([category, questions]) =>
        questions.map((question) => ({ question, category }))
    );
    function getXQuestions(amount) {
        const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, amount);
    }
    const responseToPoints = {
        1: 0,
        2: 2.5,
        3: 5,
        4: 7.5,
        5: 10,
    };
    const EIresponseToPoints = {
        5: 0,
        4: 2.5,
        3: 5,
        2: 7.5,
        1: 10,
    };
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const currentQuestion = allQuestions[currentQuestionIndex];
    const selectedQuestions = getXQuestions(questionAmount)

    const calculateRunningAverages = (answers) => {
        const runningSums = {};
        const questionCounts = {};
        // Iterate through user answers
        for (const key in answers) {
            const { category, value } = answers[key];
            const points = responseToPoints[value];
            if (!runningSums[category]) {
                runningSums[category] = 0;
                questionCounts[category] = 0;
            }
            if(category==="E/I"){
                runningSums[category] += EIresponseToPoints[value];
            }
            else {
                runningSums[category] += points;
            }
            questionCounts[category] += 1;
        }
        const averages = {};
        for (const category in runningSums) {
            averages[category] = runningSums[category] / questionCounts[category];
        }
        return averages;
    };
    const handleAnswer = (value) => {
        setAnswers((prev) => ({
            ...prev,
            [currentQuestionIndex]: { category: currentQuestion.category, value }
        }));
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < selectedQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    // Submit Handler
    const handleSubmit = async () => {
        const averages = calculateRunningAverages(answers);
        const response = await axios.post("http://127.0.0.1:5000/find-closest-personality", averages);
        console.log("Response:", response.data);
        console.log("User Answers:", answers);
        console.log("Averages:", averages);
        navigate("/results", { state: { responseData: response.data } });
        alert("Quiz Submitted! Check the console for answers.");
    };

    return (
        <div className="quiz-container">
            <h1>MBTI Quiz</h1>

            <div className="question-box">
                <h2>{`Question ${currentQuestionIndex + 1} of ${selectedQuestions.length}`}</h2>
                <p>{currentQuestion && currentQuestion.question}</p>
            </div>

            <div className="answer-options">
                {["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"].map((option, index) => (
                    <button
                        key={index}
                        className={`answer-btn ${
                            answers[currentQuestionIndex]?.value === index + 1 ? "selected" : ""
                        }`}
                        onClick={() => handleAnswer(index + 1)}>
                        {option}
                    </button>
                ))}
            </div>

            <div className="navigation-buttons">
                <button onClick={prevQuestion} disabled={currentQuestionIndex === 0}>
                    Previous
                </button>
                {currentQuestionIndex < selectedQuestions.length - 1 ? (
                    <button onClick={nextQuestion}>Next</button>
                ) : (
                    <button onClick={handleSubmit}>Submit</button>
                )}
            </div>
        </div>
    );
};

export default Quiz;
