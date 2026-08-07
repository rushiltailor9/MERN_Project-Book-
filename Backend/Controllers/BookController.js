const BookModel = require('../Modules/Book');

//create POST
const createBooks = async(req, res) =>{
    try{
        const model = new BookModel(req.body);
        await model.save();
        res.status(201)
            .json({
                message:"Book Is Created",
                success:true
            });
    }catch(error){
        console.error("Error creating book:", error);
        res.status(500)
            .json({
                message:"Book Is Not Created",
                error: error.message,
                success:false
            });
    }
}

//Fetch GET
const fetchBooks = async(req, res) =>{
    try{
        const data = await BookModel.find({});
        res.status(200)
            .json({
                message:"Book Is Fetch",
                success:true,
                data
            });
    }catch(error){
        console.error("Error fetching books:", error);
        res.status(500)
            .json({
                message:"Book Is Not Fetch",
                error: error.message,
                success:false
            });
    }
}

//Update PUT
const updateBookById = async(req, res) =>{
    try{
        const id = req.params.id;
        const body = req.body;
        const existingBook = await BookModel.findById(id);
        const updateData = { ...body };

        if (!updateData.uploadedBy && existingBook?.uploadedBy) {
            updateData.uploadedBy = existingBook.uploadedBy;
        }

        const obj = {$set: updateData};
        await BookModel.findByIdAndUpdate( id, obj );
        res.status(200)
            .json({
                message:"Book Is Updated",
                success:true
            });
    }catch(error){
        console.error("Error updating book:", error);
        res.status(500)
            .json({
                message:"Book Is Not Updated",
                error: error.message,
                success:false
            });
    }
}

//Delete DELETE
const deleteBookById = async(req, res) =>{
    try{
        const id = req.params.id;
        await BookModel.findByIdAndDelete(id);
        res.status(200)
            .json({
                message:"Book Is Deleted",
                success:true
            });
    }catch(error){
        console.error("Error deleting book:", error);
        res.status(500)
            .json({
                message:"Book Is Not Deleted",
                error: error.message,
                success:false
            });
    }
}
module.exports = {
    createBooks,
    fetchBooks,
    deleteBookById,
    updateBookById
}