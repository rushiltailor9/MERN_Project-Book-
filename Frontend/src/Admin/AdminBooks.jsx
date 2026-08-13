import { useEffect, useState } from "react"
import { getBooks } from "../API/bookApi";
import "../CSS/Books.css";
import { FaSearch } from "react-icons/fa";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import "../CSS/AdminBook.css"

const Books = () => {
  const [books,setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(()=>{
    const fetchBooks = async() =>{
      try{
        const response = await getBooks();
        // console.log(response.data);
        setBooks(response.data);
        setAllBooks(response.data);
      }catch(error){
        console.log(error)
      }finally{
        setLoading(false);
      }
    }

    fetchBooks();
  },[]);
  if(loading){
    <h2>Loading...</h2>
  }
  const handleSearch = (e) =>{
    const term = e.target.value.toLowerCase();
    if(term === ""){
      setBooks(allBooks);
      return;
    }
    const result = allBooks.filter((item)=>
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
            <div className="books-container">
      <div className="search-container">
        <FaSearch className="search-icon"/><input type="text" className="search-input" placeholder="Search Books..." onChange={handleSearch}/>
      </div>
      <div className="books-header">
        <h2>Books</h2>

        <span>
            Total Books: {books.length}
        </span>
      </div>
      <div className="book-grid">
      {
        books.map((book)=>(
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
            </div>
          </div>
        ))
      }
      </div>
    </div>
            
        </div>
    </div>
  )
}

export default Books