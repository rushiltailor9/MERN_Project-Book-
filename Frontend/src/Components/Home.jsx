import { Link } from "react-router-dom";
import "../CSS/Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <h2 className="home-title">Welcome to the <span className="readEasy">READ-EASY</span> Platform</h2>
      <p className="home-text">Read and Upload Books</p>

      <Link to="/books" className="read-books">
        Read Books
      </Link>
    </div>
  );
};

export default Home;