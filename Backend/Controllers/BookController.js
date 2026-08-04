const BookModel = require('../Modules/Book');

//create POST
const createBooks = async(req, res) =>{
    const data = req.body;
    try{
        const model = new BookModel(req.body);
        await model.save();
        res.status(201)
            .json({
                message:"Book Is Created",
                success:true
            });
    }catch(error){
        res.status(500)
            .json({
                message:"Book Is Not Created",
                success:false
            });
    }
}

//Fetch GET
const fetchBooks = async(req, res) =>{
    try{

        const data = await BookModel.find({});
        res.status(201)
            .json({
                message:"Book Is Fetch",
                success:true,
                data
            });
    }catch(error){
        res.status(500)
            .json({
                message:"Book Is Not Fetch",
                success:false
            });
    }
}

//Update PUT
const updateBookById = async(req, res) =>{
    try{
        const id = req.params.id;
        const body = req.body;
        const obj = {$set: {... body}};
        await BookModel.findByIdAndUpdate( id, obj );
        res.status(201)
            .json({
                message:"Book Is Updated",
                success:true
            });
    }catch(error){
        res.status(500)
            .json({
                message:"Book Is Not Updated",
                success:false
            });
    }
}

//Delete DELETE
const deleteBookById = async(req, res) =>{
    try{
        const id = req.params.id;
        await BookModel.findByIdAndDelete(id);
        res.status(201)
            .json({
                message:"Book Is Deleted",
                success:true
            });
    }catch(error){
        res.status(500)
            .json({
                message:"Book Is Not Deleted",
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