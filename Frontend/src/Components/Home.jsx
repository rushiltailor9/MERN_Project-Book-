import { Link } from "react-router-dom";
import "../CSS/Home.css";
import heroBanner from "../assets/banner-home.jpg";

const Home = () => {
  return (
    <div className="home-hero">
      <div className="hero-bg-wrapper">
        <img src={heroBanner} alt="Read Easy banner" className="hero-bg" />
        <div className="hero-overlay" />
      </div>
      <div className="hero-content">
        <p className="hero-label">READ-EASY</p>
        <h1 className="hero-title"><span className="readEasy">READ-EASY</span> – Quality Books, Effortless Shopping.</h1>
        <p className="hero-description">
          Discover curated book selections and share your own favorites with a community of readers.
        </p>
        <div className="hero-actions">
          <Link to="/books" className="hero-btn hero-btn-secondary">
            Explore Books
          </Link>
        </div>
      </div>
      <section className="hero-features">
        <div className="feature-card">
          <h3>Curated Picks</h3>
          <p>Enjoy book recommendations chosen for your taste.</p>
        </div>
        <div className="feature-card">
          <h3>Best Books</h3>
          <p>Buy Your favorite Books From READ-EASY</p>
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