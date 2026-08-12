import { useEffect, useState } from "react"
import { getBooks } from "../API/bookApi";
import "../CSS/Books.css";
import "../CSS/Category.css";
import { FaSearch } from "react-icons/fa";
import { addToCart } from "../API/cartApi";
import { BsBag } from "react-icons/bs";
import { handleSuccess, handleError } from "../utils";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeLanguage, setActiveLanguage] = useState("All");

  useEffect(() => {
    const fetchBooks = async () => {
    try {
      const response = await getBooks();
      setBooks(response.data);
      setAllBooks(response.data);
    } catch (error) {
      console.log(error);
      setAllBooks([]);
    } finally {
      setLoading(false);
    }
  };
    fetchBooks();
  }, []);

  if (loading) {
    <h2>Loading...</h2>
  }

  const allCategories = [
    "All",
    ...Array.from(
      new Set(
        allBooks.flatMap((item) =>
          Array.isArray(item.category)
            ? item.category
            : typeof item.category === "string" && item.category.trim()
            ? [item.category]
            : []
        )
      )
    ).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
  ];

  const allLanguage = [
    "All",
    ...Array.from(
      new Set(
        allBooks.map((item) => item.language).filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
  ];

  const applyFilters = (term, category, language) => {
    let result = allBooks;

    if (category !== "All") {
      result = result.filter((item) => {
        if (Array.isArray(item.category)) {
          return item.category.includes(category);
        }
        if (typeof item.category === "string") {
          return item.category === category;
        }
        return false;
      });
    }

    if (language !== "All") {
      result = result.filter(
        (item) => item.language && item.language.toLowerCase() === language.toLowerCase()
      );
    }

    if (term && term.trim() !== "") {
      const lowerTerm = term.trim().toLowerCase();
      result = result.filter((item) => {
        const nameMatch = item.bookName?.toLowerCase().includes(lowerTerm);
        const authorMatch = item.authorName?.toLowerCase().includes(lowerTerm);
        const langMatch = item.language?.toLowerCase().includes(lowerTerm);
        const priceMatch = item.price?.toString().includes(lowerTerm);
        const catMatch = Array.isArray(item.category)
          ? item.category.some((c) => c.toLowerCase().includes(lowerTerm))
          : item.category?.toLowerCase().includes(lowerTerm);
        return nameMatch || authorMatch || langMatch || priceMatch || catMatch;
      });
    }

    setBooks(result);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    applyFilters(term, activeCategory, activeLanguage);
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    applyFilters(searchTerm, category, activeLanguage);
  };

  const handleLanguageClick = (language) => {
    setActiveLanguage(language);
    applyFilters(searchTerm, activeCategory, language);
  };

  const handleAddToCart = async (book) => {
    try {
      const response = await addToCart({
        bookId: book._id,
        bookName: book.bookName,
        authorName: book.authorName,
        price: book.price,
        bookImg: book.bookImg,
        language: book.language,
        quantity: 1
      });
      console.log(response.data);
      handleSuccess(response.data.message || "Book added to cart!");
    } catch (error) {
      console.log(error);
      const message =
        error.response?.status === 401
          ? "Please login to add books to your cart."
          : error.response?.data?.message || "Failed to add book...";
      handleError(message);
    }
  };

  return (
    <div className="books-page-layout">
      <aside className="filter-sidebar">
        <div className="sidebar-header">
          <h3>Filters</h3>
          {(activeCategory !== "All" || activeLanguage !== "All" || searchTerm !== "") && (
            <button
              className="reset-btn"
              onClick={() => {
                setActiveCategory("All");
                setActiveLanguage("All");
                setSearchTerm("");
                applyFilters("", "All", "All");
              }}
            >
              Reset
            </button>
          )}
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-section-title">Categories</h4>
          <div className="sidebar-list">
            {allCategories.map((cat) => (
              <button
                key={cat}
                className={`sidebar-item ${activeCategory === cat ? "sidebar-item-active" : ""}`}
                onClick={() => handleCategoryClick(cat)}
              >
                <span className="item-name">{cat}</span>
                {activeCategory === cat && <span className="active-dot">•</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-section-title">Languages</h4>
          <div className="sidebar-list">
            {allLanguage.map((lang) => (
              <button
                key={lang}
                className={`sidebar-item ${activeLanguage === lang ? "sidebar-item-active" : ""}`}
                onClick={() => handleLanguageClick(lang)}
              >
                <span className="item-name">{lang}</span>
                {activeLanguage === lang && <span className="active-dot">•</span>}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="books-main-area">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search Books..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="books-results-header">
          Showing {books.length} {books.length === 1 ? "Book" : "Books"}
        </div>

        {books.length === 0 ? (
          <div className="no-books-message">
            <h3>No books found</h3>
            <p>Try adjusting your search terms or filter selections.</p>
          </div>
        ) : (
          <div className="book-grid">
            {books.map((book) => (
              <div className="book-card" key={book._id}>
                <img
                  src={book.bookImg}
                  alt={book.bookName}
                  className="book-image"
                />
                <div className="book-details">
                  <h2>{book.bookName}</h2>

                  <p>
                    <strong>Author:</strong> {book.authorName}
                  </p>
                  <p>
                    <strong>Language:</strong> {book.language}
                  </p>
                  <p>
                    <strong>Price:</strong> ₹{book.price}
                  </p>
                  {Array.isArray(book.category) && book.category.length > 0 && (
                    <p>
                      <strong>Category:</strong> {book.category.join(", ")}
                    </p>
                  )}
                  <div className="book-buttons">
                    <button className="cart-btn" onClick={() => handleAddToCart(book)}>
                      Add To Cart <BsBag />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Books