import { Link } from "react-router-dom";
import "../CSS/Home.css";
import banner from "../assets/banner.avif";

const Home = () => {
  return (
    <div className="home-hero">
      <div className="hero-bg-wrapper">
        <img src={banner} alt="Read Easy banner" className="hero-bg" />
        <div className="hero-overlay" />
      </div>
      <div className="hero-content">
        <p className="hero-label">READ-EASY</p>
        <h1 className="hero-title"><span className="readEasy">READ-EASY</span> – Quality Books, Effortless Shopping.</h1>
        <p className="hero-description">
          Discover curated book selections and share your own favorites with a community of readers.
        </p>
        <div className="hero-actions">
          <Link to="/books" className="hero-btn hero-btn-primary">
            Explore Books
          </Link>
          <Link to="/books-upload" className="hero-btn hero-btn-secondary">
            Upload Your Book
          </Link>
        </div>
      </div>
      <section className="hero-features">
        <div className="feature-card">
          <h3>Curated Picks</h3>
          <p>Enjoy book recommendations chosen for your taste.</p>
        </div>
        <div className="feature-card">
          <h3>Fast Upload</h3>
          <p>Share your favorite titles in seconds.</p>
        </div>
        <div className="feature-card">
          <h3>Community Favorites</h3>
          <p>See what other readers are loving right now.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;