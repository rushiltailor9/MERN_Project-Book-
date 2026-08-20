import axios from "axios";
import { useEffect, useState } from "react"
import { addDiscount, deleteDiscount, getAllDiscount } from "../API/discountApi";
import "../CSS/AdminDiscount.css";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const AdminDiscount = () => {
    const[books, setBooks] = useState([]);
    const[discounts,setDiscounts] = useState([]);
    const[bookId, setBookId] = useState("");
    const[discountPercentage, setDiscountPercentage] = useState("");
    const[startDate, setStartDate] = useState("");
    const[endDate, setEndDate] = useState("");

    const fetchBooks = async() =>{
        try{
            const response = await axios.get("http://localhost:5000/book");

            if(response.data.success){
                setBooks(response.data.books || []);
            }
        }catch(error){
            console.error("Book Fetch error",error);
        }
    }

    const fetchDiscount = async() =>{
        try{
            const data = await getAllDiscount();

            if(data.success){
                setDiscounts(data.discounts);
            }
        }catch(error){
            console.error("Discount fetch error",error);
        }
    }

    useEffect(()=>{
        const onLoad = () =>{
            fetchBooks(),
            fetchDiscount()
        }
        onLoad();
    },[]);

    const handleSubmit = async(e) =>{
        e.preventDefault();

        try{
            const data = await addDiscount({
                bookId: bookId || null,
                discountPercentage: Number(discountPercentage),
                startDate,
                endDate,
            });
            if(data.success){
                alert("Discount added successfully");
            }

            setBooks("");
            setDiscountPercentage("");
            setStartDate("");
            setEndDate("");

            fetchDiscount();
        }catch(error){
            alert(error.response?.data?.message || "Failed to add discount");
        }
    }

    const handleDelete = async(id) =>{
        try{
            const data =
                await deleteDiscount(id);

                if (data.success) {
                    fetchDiscount();
                }
        }catch(error){
            console.error(error);
        }
    }
  return (
    <div className="admin-container">
        <AdminSidebar />
        <div className="admin-main">
            <AdminHeader />
            <div className="discount-management">
                <div className="discount-content">
                    <h1>
                        Discount Management
                    </h1>

                    <div className="discount-form-card">
                        <form
                            onSubmit={handleSubmit}
                            className="discount-form"
                        >
                            <h2>
                                Add Discount
                            </h2>

                            <div className="discount-form-group">
                                <label>
                                    Select Book
                                </label>
                                <select
                                    value={bookId}
                                    onChange={(e) =>
                                        setBookId(e.target.value)
                                    }
                                >

                                    <option value="">
                                        All Books
                                    </option>

                                    {books.map(book => (
                                        <option
                                            key={book._id}
                                            value={book._id}
                                        >
                                            {book.bookName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="discount-form-group">
                                <label>
                                    Discount Percentage
                                </label>
                                <div className="discount-percentage-wrapper">
                                    <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={discountPercentage}
                                        onChange={(e) =>
                                            setDiscountPercentage(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Example: 20"
                                        required
                                    />
                                    <span className="discount-percentage-symbol">
                                        %
                                    </span>
                                </div>
                            </div>

                            <div className="discount-form-group">
                                <label>
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>

                            <div className="discount-form-group">
                                <label>
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) =>
                                        setEndDate(
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>

                            <div className="discount-form-actions">
                                <button
                                    className="add-discount-btn"
                                    type="submit"
                                >
                                    Add Discount
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="discount-list-card">
                        <div className="discount-list-header">
                            <h2>
                                Existing Discounts
                            </h2>
                            <span className="discount-count">
                                {discounts.length}
                            </span>
                        </div>

                        {discounts.length === 0 ? (
                            <div className="discount-empty">
                                <div className="discount-empty-icon">
                                    %
                                </div>
                                <h3>
                                    No Discounts Found
                                </h3>
                                <p>
                                    No discount has been added yet.
                                </p>
                            </div>
                        ) : (
                            <div className="discount-table-wrapper">
                                <table className="discount-table">
                                    <thead>
                                        <tr>
                                            <th>
                                                Book
                                            </th>
                                            <th>
                                                Discount
                                            </th>

                                            <th>
                                                Start Date
                                            </th>

                                            <th>
                                                End Date
                                            </th>

                                            <th>
                                                Status
                                            </th>

                                            <th>
                                                Action
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {discounts.map(
                                            discount => (

                                                <tr
                                                    key={
                                                        discount._id
                                                    }
                                                >

                                                    {/* Book */}

                                                    <td>

                                                        <div className="discount-book-name">

                                                            <strong>
                                                                {
                                                                    discount.bookId
                                                                        ? discount.bookId.bookName
                                                                        : "All Books"
                                                                }
                                                            </strong>

                                                            {!discount.bookId && (
                                                                <span>
                                                                    Discount applies to all books
                                                                </span>
                                                            )}

                                                        </div>

                                                    </td>


                                                    {/* Discount */}

                                                    <td>

                                                        <span className="discount-badge">

                                                            {
                                                                discount.discountPercentage
                                                            }%

                                                        </span>

                                                    </td>


                                                    {/* Start */}

                                                    <td>

                                                        <span className="discount-date">

                                                            {
                                                                new Date(
                                                                    discount.startDate
                                                                ).toLocaleDateString()
                                                            }

                                                        </span>

                                                    </td>


                                                    {/* End */}

                                                    <td>

                                                        <span className="discount-date">

                                                            {
                                                                new Date(
                                                                    discount.endDate
                                                                ).toLocaleDateString()
                                                            }

                                                        </span>

                                                    </td>


                                                    {/* Status */}

                                                    <td>

                                                        <span className="discount-status active">

                                                            <span className="discount-status-dot"></span>

                                                            Active

                                                        </span>

                                                    </td>


                                                    {/* Action */}

                                                    <td>

                                                        <div className="discount-actions">

                                                            <button
                                                                className="discount-delete-btn"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        discount._id
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>

    </div>
)
}

export default AdminDiscount

