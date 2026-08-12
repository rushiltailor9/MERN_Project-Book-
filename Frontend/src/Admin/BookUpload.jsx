import { useEffect, useState } from "react";
import "../CSS/BookUpload.css";
import "../CSS/Category.css";
import {
    getBooks,
    addBook,
    updateBook,
    deleteBook
} from "../API/bookApi";
import { handleSuccess, handleError } from "../utils";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const getDisplayName = (loggedInUser = "") => {
    if (loggedInUser) return loggedInUser;

    const token = localStorage.getItem("token");
    if (!token) return "Guest";

    try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        return decoded.name || decoded.firstName || decoded.email || "Guest";
    } catch (error) {
        console.log(error);
        return "Guest";
    }
};

const CATEGORY_OPTION = [
    "Academic",
    "Bestseller",
    "Biography",
    "Comics",
    "Fiction",
    "Kids",
    "Mystery/Thriller",
    "Non-Fiction",
    "Poetry",
    "Religious/Spiritual",
    "Romance",
    "Self-Help"
];

const BookUpload = ({ loggedInUser = "" }) => {
    const [books, setBooks] = useState([]);
    const [uploadedBy] = useState(() => getDisplayName(loggedInUser));
    const [book, setBook] = useState({
        bookName: "",
        authorName: "",
        price: "",
        bookImg: null,
        language: "",
        category:[]
    });
    const [editId, setEditId] = useState(null);
    const [allBooks, setAllBooks] = useState([]);

    const fetchBook = async () => {
        try {
            const res = await getBooks();
            let booksData = [];
            if (res && Array.isArray(res.data)) {
                booksData = res.data;
            } else if (Array.isArray(res)) {
                booksData = res;
            } else {
                booksData = [];
            }
            setBooks(booksData);
            setAllBooks(booksData);
        } catch (error) {
            console.log(error);
            setBooks([]);
            setAllBooks([]);
        }
    };

    useEffect(() => {  
        fetchBook();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "bookImg" && files && files[0]) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setBook((prevBook) => ({
                    ...prevBook,
                    bookImg: reader.result
                }));
            };
            reader.readAsDataURL(file);
        } else {
            setBook({
                ...book,
                [name]: value
            });
        }
    };
    const handleCategoryToggle = (categoryName) => {
    setBook((prevBook) => {
        const currentCategories = Array.isArray(prevBook.category) ? prevBook.category : [];
        const alreadySelected = currentCategories.includes(categoryName);
        const updatedCategories = alreadySelected
            ? currentCategories.filter((c) => c !== categoryName)
            : [...currentCategories, categoryName];
        return { ...prevBook, category: updatedCategories };
    });
};

    const handleEdit = (item) => {
        setEditId(item._id);
        setBook({
            bookName: item.bookName || "",
            authorName: item.authorName || "",
            price: item.price || "",
            bookImg: item.bookImg || "",
            language: item.language || "",
            category: Array.isArray(item?.category)? item.category : []
        });
    };

    const handleDelete = async (id) => {
        try {
            await deleteBook(id);
            handleSuccess("Book Deleted Successfully...");
            fetchBook();
        } catch (error) {
            console.log(error);
            handleError("Failed to delete book.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!book.category || book.category.length === 0){
            handleError("Please select at least on category");
            return;
        }

        try {
            const bookData = {
                bookName: book.bookName,
                authorName: book.authorName,
                price: Number(book.price),
                bookImg: book.bookImg || "",
                language: book.language,
                category: book.category,
                uploadedBy: uploadedBy
            };

            if (editId) {
                await updateBook(editId, bookData);
                handleSuccess("Book Updated Successfully...");
            } else {
                await addBook(bookData);
                handleSuccess("Book Added Successfully...");
            }

            setBook({
                bookName: "",
                authorName: "",
                price: "",
                bookImg: "",
                language: "",
                category: []
            });
            setEditId(null);
            fetchBook();
        } catch (error) {
            console.log(error);
            handleError("Failed to save book. Please check input values.");
        }
    };
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        if (term === "") {
            setBooks(allBooks);
            return;
        }
        const result = allBooks.filter((item) =>
            item.bookName.toLowerCase().includes(term) ||
            item.authorName.toLowerCase().includes(term) ||
            item.language.toLowerCase().includes(term) ||
            item.price.toString().includes(term)
        );
        setBooks(result);
    }
    return (
        <div className="admin-container">
            <AdminSidebar/> 
            <div className="admin-main">
                <AdminHeader/>
                <div className="admin-content">
                    <div className="upload-page">
                    <form className="upload-form" onSubmit={handleSubmit}>
                        <h2>{editId ? "Edit Book Details" : "Upload a Book"}</h2>
                        <p className="upload-user">Uploading As: <span>{uploadedBy}</span></p>

                        <div className="input-group">
                            <label>Book Name</label>
                            <input 
                                type="text" 
                                name="bookName" 
                                value={book.bookName ?? ""}
                                placeholder="Enter Book Title" 
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Author Name</label>
                            <input 
                                type="text" 
                                name="authorName" 
                                value={book.authorName ?? ""}
                                placeholder="Enter Author Name" 
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Price (₹)</label>
                            <input 
                                type="number" 
                                name="price" 
                                value={book.price ?? ""}
                                placeholder="Enter Price" 
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Book Cover Image</label>
                            <input 
                                type="file" 
                                name="bookImg" 
                                accept="image/*"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input-group">
                            <label>Language</label>
                            <input 
                                type="text" 
                                name="language" 
                                value={book.language ?? ""}
                                placeholder="Enter Language (e.g. English)" 
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-name">
                            <label>Category</label>
                            <div className="category-checkbox-group">
                               {CATEGORY_OPTION.map((cat)=>(
                                <label key={cat} className="category-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={Array.isArray(book.category) && book.category.includes(cat)}
                                        onChange={() => handleCategoryToggle(cat)}
                                    />
                                    {cat}
                                </label>
                               ))} 
                            </div>
                        </div>

                        <button type="submit" className="submit-btn">{editId ? "Update Book" : "Upload Book"}</button>
                    </form>

                    <input type="text" placeholder="Search Here..." onChange={handleSearch} className="search-input"/>

                    <div className="table-section">
                        <h2>Uploaded Books Directory</h2>

                        <div className="table-wrapper">
                            <table className="books-table">
                                <thead>
                                    <tr>
                                        <th>Book Name</th>
                                        <th>Author Name</th>
                                        <th>Price</th>
                                        <th>Cover</th>
                                        <th>Language</th>
                                        <th>Category</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Array.isArray(books) && books.length > 0 ? (
                                            books.map((item) => (
                                                <tr key={item._id}>
                                                    <td className="book-name-cell">{item.bookName}</td>
                                                    <td>{item.authorName}</td>
                                                    <td><span className="price-badge">₹{item.price}</span></td>
                                                    <td>
                                                        {item.bookImg && (item.bookImg.startsWith("data:") || item.bookImg.startsWith("http")) ? (
                                                            <img src={item.bookImg} alt={item.bookName} className="book-thumb" />
                                                        ) : (
                                                            <span className="no-img">{item.bookImg || "No image"}</span>
                                                        )}
                                                    </td>
                                                    <td><span className="lang-badge">{item.language}</span></td>
                                                    <td>
                                                        {Array.isArray(item.category) && item.category.length > 0 ? (
                                                            item.category.map((c)=>(
                                                                <span key={c} className="lang-badge">
                                                                    {c}
                                                                </span>
                                                            ))
                                                        ):(
                                                            <span className="no-img">None</span>
                                                        )
                                                        }
                                                    </td>
                                                    <td className="action-cells">
                                                        <button className="btn-edit" onClick={() => handleEdit(item)}>
                                                            Edit
                                                        </button>

                                                        <button className="btn-delete" onClick={() => handleDelete(item._id)}>
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="empty-row">No books found. Add one above!</td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
};

export default BookUpload;