import React from "react";
import { Link } from "react-router-dom";
import "../styles/NavBar.css";

const Navbar = () => {
    return (
        <nav className="navbar">
            <h1 className="navbar-brand">MBTI Quiz App</h1>
            <ul className="navbar-links">
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/quiz">Quiz</Link>
                </li>
                <li>
                    <Link to="/home">Home</Link>
                </li>
                <li>
                    <Link to="/results">Results</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
