import { useEffect, useState } from "react";
import "../CSS/BookUpload.css";
import {
    getBooks,
    addBook,
    updateBook,
    deleteBook
} from "../api";
import { handleSuccess, handleError } from "../utils";

const BookUpload = () => {
    const [books, setBooks] = useState([]);
    const [book, setBook] = useState({
        bookName: "",
        authorName: "",
        price: "",
        bookImg: null,
        language: ""
    });
    const [editId, setEditId] = useState(null);

    const fetchBook = async () => {
        try {
            const res = await getBooks();
            if (res && Array.isArray(res.data)) {
                setBooks(res.data);
            } else if (Array.isArray(res)) {
                setBooks(res);
            } else {
                setBooks([]);
            }
        } catch (error) {
            console.log(error);
            setBooks([]);
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

    const handleEdit = (item) => {
        setEditId(item._id);
        setBook({
            bookName: item.bookName || "",
            authorName: item.authorName || "",
            price: item.price || "",
            bookImg: item.bookImg || "",
            language: item.language || ""
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

        try {
            const bookData = {
                bookName: book.bookName,
                authorName: book.authorName,
                price: Number(book.price),
                bookImg: book.bookImg || "",
                language: book.language
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
                language: ""
            });
            setEditId(null);
            fetchBook();
        } catch (error) {
            console.log(error);
            handleError("Failed to save book. Please check input values.");
        }
    };

    return (
        <div className="upload-page">
            <form className="upload-form" onSubmit={handleSubmit}>
                <h2>{editId ? "Edit Book Details" : "Upload a Book"}</h2>

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

                <button type="submit" className="submit-btn">{editId ? "Update Book" : "Upload Book"}</button>
            </form>

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
                                        <td colSpan="6" className="empty-row">No books found. Add one above!</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BookUpload;