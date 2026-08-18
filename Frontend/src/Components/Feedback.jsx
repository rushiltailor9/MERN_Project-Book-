import "../CSS/Feedback.css";
import { sendFeedback } from "../API/feedbackApi"
import { useState } from "react";
import { handleSuccess, handleError } from "../utils";

const getUserDetails = (loggedInUser = "") => {
    if (loggedInUser) {
        return {
            name: loggedInUser,
            email: localStorage.getItem("email") || ""
        };
    }

    const token = localStorage.getItem("token");
    if (!token) {
        return { name: "", email: "" };
    }

    try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        return {
            name: decoded.name || decoded.firstName || decoded.email || "",
            email: decoded.email || localStorage.getItem("email") || decoded.username || ""
        };
    } catch (error) {
        return { name: "", email: "", error };
    }
};

const Feedback = ({ loggedInUser = "" }) => {
    const userDetails = getUserDetails(loggedInUser);
    const [fromData, setFromData] = useState(() => ({
            name: userDetails.name,
            email: userDetails.email,
            rating: "",
            feedback: ""
        }));
        const [loading, setLoading] = useState(false);
    
        const handleOnchange = (e) =>{
            setFromData({
                ... fromData,
                [e.target.name]: e.target.value
            })
            console.log(e.target.value);
        }
    
        const handleSubmit = async(e) =>{
            e.preventDefault();
    
            try{
                setLoading(true);
    
                const response = await sendFeedback(fromData);
    
                handleSuccess(response.data.message || "Feedback Sent Successfully");
    
                setFromData({
                name: userDetails.name,
                email: userDetails.email,
                rating: "",
                feedback: ""
                })
            }catch(error){
                handleError(error.response?.data?.message || "Something went wrong...");
            }finally{
                setLoading(false);
            }
        }
    
    



  return (
    <div className="feedback-container">
        
        <form className="feedback-form" onSubmit={handleSubmit}>
            <h2>Feedback</h2>
            <input
                type="text"
                name="name"
                placeholder="Enter Name"
                onChange={handleOnchange}
                value={fromData.name}
                required
            />
            <input
                type="email"
                name="email"
                placeholder="Enter Email"
                onChange={handleOnchange}
                value={fromData.email}
                required
            />
            <select
                name="rating"
                onChange={handleOnchange}
                value={fromData.rating}
                required
            >
                <option value="">Select Rating</option>
                <option value="1">1 ★</option>
                <option value="2">2 ★★</option>
                <option value="3">3 ★★★</option>
                <option value="4">4 ★★★★</option>
                <option value="5">5 ★★★★★</option>
            </select>
            <textarea
                name="feedback"
                placeholder="Enter Feedback"
                rows="5"
                onChange={handleOnchange}
                value={fromData.feedback}
                required
            >
            </textarea>
            <button type="submit">{loading ? "Sending" : "Send Feedback"}</button>
        </form>

    </div>
  )
}

export default Feedback
