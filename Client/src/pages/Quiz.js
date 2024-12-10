import React, { useState } from "react";
import questionsData from "../assets/mbti_questions_50_each.json"; // Adjust the path to your JSON file
import "../styles/Quiz.css";
import {useLocation} from "react-router-dom"; // Optional: Add custom styles

const Quiz = ({}) => {
    const allQuestions = Object.entries(questionsData).flatMap(([category, questions]) =>
        questions.map((question) => ({ question, category }))
    );
    function getXQuestions(amount) {
        const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, amount);
    }
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const currentQuestion = allQuestions[currentQuestionIndex];
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const questionAmount = searchParams.get("questions") || 0;
    const selectedQuestions = getXQuestions(questionAmount)

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
    const handleSubmit = () => {
        console.log("User Answers:", answers);
        alert("Quiz Submitted! Check the console for answers.");
    };

    return (
        <div className="quiz-container">
            <h1>MBTI Quiz</h1>

            <div className="question-box">
                <h2>{`Question ${currentQuestionIndex + 1} of ${selectedQuestions.length}`}</h2>
                <p>{currentQuestion.question}</p>
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
