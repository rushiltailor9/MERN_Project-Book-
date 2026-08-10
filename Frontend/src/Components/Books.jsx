import { useEffect, useState } from "react"
import { getBooks } from "../API/bookApi";
import "../CSS/Books.css";
import { FaSearch } from "react-icons/fa";
import { addToCart } from "../API/cartApi";
import { BsBag } from "react-icons/bs";

const Books = () => {
  const [books,setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);

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
  useEffect(()=>{
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
  const handleAddToCart = async(book) =>{
    try{
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
      alert(response.data.message);
    }catch(error){
      console.log(error);
      const message =
        error.response?.status === 401
          ? "Please login to add books to your cart."
          : error.response?.data?.message || "Failed to add book...";
      alert(message);
    }
  }
  return (
    <div className="books-container">
      <div className="search-container">
        <FaSearch className="search-icon"/><input type="text" className="search-input" placeholder="Search Books..." onChange={handleSearch}/>
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
              <div className="book-buttons">
                <button className="cart-btn" onClick={()=>handleAddToCart(book)}>Add To Cart   <BsBag/></button>
              </div>
            </div>
          </div>
        ))
      }
      </div>
    </div>
  )
}

export default Books