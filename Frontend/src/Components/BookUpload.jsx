import "../CSS/BookUpload.css";

const BookUpload = () => {
    return (
        <div className="upload-container">
            <form className="upload-form">
                <h2>Upload a Book</h2>

                <input type="text" name="title" placeholder="Book Title" />

                <input type="text" name="author" placeholder="Author" />

                <input type="number" name="price" placeholder="Price" />

                <button type="submit">Upload Book</button>
            </form>
        </div>
    );
};

export default BookUpload;