import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { getBooks } from "../API/bookApi";
import "../CSS/Books.css";
import "../CSS/Category.css";
import { FaSearch } from "react-icons/fa";
import { addToCart } from "../API/cartApi";
import { BsBag } from "react-icons/bs";
import { handleSuccess, handleError } from "../utils";
import { FaHeart } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import {
    addFavorite,
    removeFavorite,
    getFavorites
} from "../API/favoriteApi";
import { getAllDiscount } from "../API/discountApi";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeLanguage, setActiveLanguage] = useState("All");
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [discounts, setDiscounts] = useState([]);
  const navigate = useNavigate();

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

  const fetchDiscount = async () => {
    try {
      const response = await getAllDiscount();
      setDiscounts(response.discounts || []);
    } catch (error) {
      console.error("Fetch Discount Error", error);
      setDiscounts([]);
    }
  }
  useEffect(() => {
    const onLoad = () => {
      fetchDiscount();
    }
    onLoad();
  }, []);

  const getBookPricing = (book) => {
    const originalPrice = Number(book.price);
    const now = new Date();

    const isCurrentlyActive = (d) =>
      d.isActive &&
      new Date(d.startDate) <= now &&
      new Date(d.endDate) >= now;

    const specificDiscount = discounts.find((d) => {
      const discountBookId =
        d.bookId && typeof d.bookId === "object" ? d.bookId._id : d.bookId;
      return isCurrentlyActive(d) && discountBookId === book._id;
    });

    const globalDiscount = discounts.find(
      (d) => isCurrentlyActive(d) && !d.bookId
    );

    const discount = specificDiscount || globalDiscount;

    if (!discount) {
      return {
        originalPrice,
        finalPrice: originalPrice,
        discountPercentage: 0,
        hasDiscount: false
      };
    }

    const discountPercentage = Number(discount.discountPercentage);
    const finalPrice = Number(
      (originalPrice - (originalPrice * discountPercentage) / 100).toFixed(2)
    );

    return {
      originalPrice,
      finalPrice,
      discountPercentage,
      hasDiscount: discountPercentage > 0
    };
  };

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
    if(book.stock <= 0){
      handleError("This Book Is Out of Stock");
      throw new Error("Out of stock");
    }
    try {
      // const { finalPrice } = getBookPricing(book);
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
      throw error;
    }
  };

  const handleBuyNow = async (book) => {
    try {
      await handleAddToCart(book);
      setSelectedBook(null);
      navigate("/checkout");
    } catch(error) {
      // The add-to-cart handler already displays the error message.
      console.error(error);
    }
  };
  useEffect(() => {

    const fetchFavorites = async () => {

        const token =
            localStorage.getItem("token");


        // User is not logged in (admin token is not a JWT)
        if (!token || token === "admin-token") {
            setFavoriteIds([]);
            return;
        }
        try {
            const response =
                await getFavorites();
            const favorites =
                response.data.favorite || [];
            const ids =
                favorites
                    .filter((item) => item.bookId)
                    .map((item) => item.bookId._id);
            setFavoriteIds(ids);
        } catch (error) {
            if (error.response?.status === 401) {
                setFavoriteIds([]);
            } else {
                console.error(
                    "Favorite fetch error:",
                    error.response?.data ||
                    error.message
                );
            }
        }
    };
    fetchFavorites();
}, []);
const handleFavorite = async (bookId) => {
    const token =
        localStorage.getItem("token");
    // User not logged in (admin token is not a JWT)
    if (!token || token === "admin-token") {
        handleError(
            "Please login to add favorites."
        );
        return;
    }
    try {
        // ==================================
        // REMOVE
        // ==================================
        if (favoriteIds.includes(bookId)) {
            await removeFavorite(bookId)
            setFavoriteIds((prev) =>
                prev.filter(
                    (id) => id !== bookId
                )
            );

            handleSuccess(
                "Removed from favorites"
            );
            return;
        }
        // ==================================
        // ADD
        // ==================================
        await addFavorite(bookId);
        setFavoriteIds((prev) => [
            ...prev,
            bookId
        ]);
        handleSuccess(
            "Added to favorites"
        );
    } catch (error) {
        console.error(
            "Favorite Error:",
            error.response?.data ||
            error.message
        );
        if (error.response?.status === 401) {

            handleError(
                "Please login first."
            );

        } else {
            handleError(
                error.response?.data?.message ||
                "Favorite operation failed"
            );
        }
    }
};
  if (loading) return <h2>Loading...</h2>;
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
                <button
                  type="button"
                  className={`favorite-btn ${
                      favoriteIds.includes(book._id)
                          ? "favorite-active"
                          : ""
                  }`}
                  onClick={() =>
                      handleFavorite(book._id)
                  }
                  aria-label={
                      favoriteIds.includes(book._id)
                          ? "Remove from favorites"
                          : "Add to favorites"
                  }
                >
                  <FaHeart />
                </button>
                <div className="book-image-wrap">
                  <img
                    src={book.bookImg}
                    alt={book.bookName}
                    className="book-image"
                  />
                  <button
                    type="button"
                    className="quick-view-btn"
                    onClick={() => setSelectedBook(book)}
                  >
                    Quick view
                  </button>
                </div>
                <div className="book-details">
                  <h2>{book.bookName}</h2>
                  <p>
                    <strong>Author:</strong> {book.authorName}
                  </p>
                  <p>
                    <strong>Language:</strong> {book.language}
                  </p>
                  {(() => {
                    const {
                      originalPrice,
                      finalPrice,
                      discountPercentage,
                      hasDiscount
                    } = getBookPricing(book);
                    return (
                      <p className="price">
                        <strong>Price:</strong>{" "}
                        {hasDiscount ? (
                          <>
                            <span className="original-price">₹{originalPrice}</span>
                            <span className="discounted-price">₹{finalPrice}</span>
                            <span className="discount-badge">{discountPercentage}% OFF</span>
                          </>
                        ) : (
                          <span className="discounted-price">₹{originalPrice}</span>
                        )}
                      </p>
                    );
                  })()}
                  <div className="stock-status">
                    {
                      book.stock > 0 ? (
                        <span className="in-stock">
                          IN STOCK
                        </span>
                      ) : (
                        <span className="out-stock">
                          OUT OF STOCK
                        </span>
                      )
                    }
                  </div>
                  {Array.isArray(book.category) && book.category.length > 0 && (
                    <p>
                      <strong>Category:</strong> {book.category.join(", ")}
                    </p>
                  )}
                  <div className="book-buttons">
                    <button 
                      className={`cart-btn ${book.stock <= 0 ? "disabled-cart-btn" : "" }`} 
                      onClick={() => handleAddToCart(book)}
                      disabled={book.stock <= 0}
                    >
                      {
                        book.stock > 0 ? (
                          <>
                            Add To Cart <BsBag />
                          </>
                        ) : (
                          "Out Of Stock"
                        )
                      }
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedBook && (
        <div className="book-modal-backdrop" role="presentation" onMouseDown={() => setSelectedBook(null)}>
          <section
            className="book-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="book-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button type="button" className="book-modal-close" onClick={() => setSelectedBook(null)} aria-label="Close book details">
              <FaTimes />
            </button>
            <img src={selectedBook.bookImg} alt={selectedBook.bookName} className="book-modal-image" />
            <div className="book-modal-content">
              <div className="book-modal-heading">
                <div>
                  <h2 id="book-modal-title">{selectedBook.bookName}</h2>
                  <p className="book-modal-author">by {selectedBook.authorName}</p>
                </div>
                <button
                  type="button"
                  className={`favorite-btn book-modal-favorite ${favoriteIds.includes(selectedBook._id) ? "favorite-active" : ""}`}
                  onClick={() => handleFavorite(selectedBook._id)}
                  aria-label={favoriteIds.includes(selectedBook._id) ? "Remove from favorites" : "Add to favorites"}
                >
                  <FaHeart />
                </button>
              </div>
              <p className="book-modal-description">{selectedBook.description || "No description is available for this book."}</p>
              <dl className="book-modal-data">
                <div>
                  <dt>Price</dt>
                  <dd>
                    {(() => {
                      const {
                        originalPrice,
                        finalPrice,
                        discountPercentage,
                        hasDiscount
                      } = getBookPricing(selectedBook);
                      return hasDiscount ? (
                        <>
                          <span className="original-price">₹{originalPrice}</span>{" "}
                          <span className="discounted-price">₹{finalPrice}</span>{" "}
                          <span className="discount-badge">{discountPercentage}% OFF</span>
                        </>
                      ) : (
                        <span className="discounted-price">₹{originalPrice}</span>
                      );
                    })()}
                  </dd>
                </div>
                <div><dt>Language</dt><dd>{selectedBook.language}</dd></div>
                <div><dt>Category</dt><dd>{selectedBook.category?.join(", ") || "—"}</dd></div>
                <div><dt>Availability</dt><dd>{selectedBook.stock > 0 ? `${selectedBook.stock} in stock` : "Out of stock"}</dd></div>
              </dl>
              <div className="book-modal-actions">
                <button 
                  type="button" 
                  className={`cart-btn ${selectedBook.stock <= 0 ? "disabled-cart-btn" : ""}`} 
                  onClick={() => handleAddToCart(selectedBook)} 
                  disabled={selectedBook.stock <= 0}
                >
                  Add to cart <BsBag />
                </button>
                <button 
                  type="button" 
                  className="buy-btn" 
                  onClick={() => handleBuyNow(selectedBook)} 
                  disabled={selectedBook.stock <= 0}
                >
                  Buy now
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Books