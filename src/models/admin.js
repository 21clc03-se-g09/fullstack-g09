import sql from "./db";

let addProduct = (prd, result)=> {
    sql.query("CALL ADD_NEW_PRODUCT (?, ?, ?, ?, ?, ?, ?, ?, @err)", [prd.productId, prd.productName, prd.author, prd.category, prd.quantity, prd.publishedDate, prd.description, prd.imageUrl ], (err, message) =>{
        if(err){
            result(err, err);
        }
        else{
            result(null, message);
        }
    });
}

module.exports = {
    addProduct: addProduct,
}