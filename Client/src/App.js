import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Landing from "./pages/Landing";
import Navbar from "./pages/Navbar";
import Collage from "./pages/Collage";
import Results from "./pages/Results";

const App = () => {
  return (
      <Router>
          <Navbar />
          <Routes>
          <Route path="/" element={<Collage />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/home" element={<Home/>} />
          <Route path="/results" element={<Results/>} />
        </Routes>
      </Router>
  );
};

export default App;
