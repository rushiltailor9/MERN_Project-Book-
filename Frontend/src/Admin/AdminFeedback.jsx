import { useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { getFeedback } from "../API/feedbackApi";
import "../CSS/AdminFeedback.css";
import { FaSearch } from "react-icons/fa";

const AdminFeedback = () => {

    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [allFeedbacks, setAllFeedbacks] = useState([]);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await getFeedback();
                console.log("Feedback Data:", response);
                setFeedbacks(response.contacts);
                setAllFeedbacks(response.contacts);
            } catch (error) {
                console.log("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeedbacks();
    }, []);

    if (loading) {
        return (
            <div className="admin-container">
                <AdminSidebar />
                <div className="admin-main">
                    <AdminHeader />
                    <div className="feedback-loading">
                        <div className="loader"></div>
                        <p>Loading feedback...</p>
                    </div>
                </div>
            </div>
        );
    }

    const handleSearch = (e) => {
        const term = e.target.value.trim().toLowerCase();

        if (term === "") {
            setFeedbacks(allFeedbacks);
            return;
        }

        const result = allFeedbacks.filter((item) => {
            const name = (item.name || "").toLowerCase();
            const email = (item.email || "").toLowerCase();
            const feedback = (item.feedback || "").toLowerCase();
            const rating = String(item.rating || "").toLowerCase();

            return (
                name.includes(term) ||
                email.includes(term) ||
                feedback.includes(term) ||
                rating.includes(term)
            );
        });

        setFeedbacks(result);
    };


    return (
        <div className="admin-container">
            <AdminSidebar />
            <div className="admin-main">
                <AdminHeader />
                <div className="feedback-page">
                    <div className="search-container">
                        <FaSearch className="search-icon"/>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search feedback..."
                            onChange={handleSearch}
                        />
                    </div>
                    {/* Page Header */}
                    <div className="feedback-title">
                        <div>
                            <h1>Customer Feedback</h1>
                            <p>
                                See what your customers are saying
                            </p>
                        </div>

                        <div className="feedback-count">
                            <span className="count-icon">
                                💬
                            </span>
                            <div>
                                <small>Total Feedback</small>
                                <strong>
                                    {feedbacks.length}
                                </strong>
                            </div>
                        </div>
                    </div>

                    {/* No Feedback */}
                    {feedbacks.length === 0 ? (
                        <div className="no-feedback">
                            <div className="no-feedback-icon">
                                💬
                            </div>
                            <h2>No Feedback Found</h2>
                            <p>
                                There is no customer feedback yet.
                            </p>
                        </div>

                    ) : (

                        <div className="feedback-grid">
                            {feedbacks.map((item) => (
                                <div
                                    className="feedback-card"
                                    key={item._id}
                                >
                                    {/* Card Header */}
                                    <div className="feedback-card-header">
                                        <div className="user-info">
                                            <div className="user-avatar">
                                                {item.name
                                                    ? item.name.charAt(0).toUpperCase()
                                                    : "U"}
                                            </div>
                                            <div>
                                                <h3>
                                                    {item.name}
                                                </h3>
                                                <p>
                                                    {item.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="rating">

                                            {"★".repeat(Number(item.rating))}
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="feedback-divider"></div>

                                    {/* Feedback */}
                                    <div className="feedback-message">
                                        <span className="quote">
                                            “
                                        </span>
                                        <p>
                                            {item.feedback}
                                        </p>
                                    </div>

                                    {/* Footer */}
                                    <div className="feedback-footer">
                                        <span>
                                            Customer Review
                                        </span>
                                        <span className="rating-number">
                                            {item.rating}/5
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminFeedback;