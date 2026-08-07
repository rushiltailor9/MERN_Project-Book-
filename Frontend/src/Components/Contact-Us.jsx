import { useEffect, useState } from "react";
import { sendContact } from "../API/contactapi";
import "../CSS/Contact-Us.css";

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

const ContactUs = ({ loggedInUser = "" }) => {
    const [fromData, setFromData] = useState({
        name: "",
        email: "",
        phone: "",
        subject:"",
        message:""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const userDetails = getUserDetails(loggedInUser);
        setFromData((prev) => ({
            ...prev,
            name: userDetails.name || prev.name,
            email: userDetails.email || prev.email
        }));
    }, [loggedInUser]);

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

            const response = await sendContact(fromData);

            alert(response.data.message || "Message Sent Successfully");

            setFromData({
                name: "",
                email:"",
                phone:"",
                subject:"",
                message:""
            })
        }catch(error){
            alert("Something went wrong...",error);
        }finally{
            setLoading(false);
        }
    }


  return (
    <div className="contact-container">
        <div className="contact-card">
            <h1>Contact-Us</h1>
            <p>Have a question? We'd love to hear from you.</p>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    onChange={handleOnchange}
                    value={fromData.name}   
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleOnchange}
                    value={fromData.email}
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    onChange={handleOnchange}
                    value={fromData.phone}
                />
                <input
                    type="text"
                    name="subject"
                    placeholder="Sugject"
                    onChange={handleOnchange}
                    value={fromData.subject}
                />
                <textarea
                    name="message"
                    rows="5"
                    placeholder="Write Your Massage"
                    onChange={handleOnchange}
                    value={fromData.message}
                ></textarea>

                <button type="submit" disabled={loading}>{loading ? "Sending" : "Send Message"}</button>
            </form>
        </div>        
    </div>
  )
}

export default ContactUs