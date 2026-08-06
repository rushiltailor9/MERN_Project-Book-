import { Link } from "react-router-dom";
import "../CSS/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <h2 className="footer-logo">E-Book Platform</h2>

        <p className="footer-description">
          Read, upload, and discover thousands of books online.
        </p>

        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/books">Books</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} E-Book Platform. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;