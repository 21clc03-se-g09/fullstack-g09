import sql from "./db";
let getAllProduct = (req, result) =>{
    sql.query("CALL GET_PRODUCT()", (err, product) => {
        if (err) {
            console.error('Error while executing query:', err);
            result(err, null);
        } else {
            result(null, product);
        }
    });  
}

module.exports = {
    getAllProduct: getAllProduct,
}