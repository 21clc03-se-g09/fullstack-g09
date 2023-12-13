import sql from "./db";

let addProduct = (prd, result)=> {
    sql.query("CALL ADD_NEW_PRODUCT (?, ?, ?, ?, ?, ?, ?, ?, ?, @err)", [prd.productId, prd.productName,prd.price, prd.author, prd.category, prd.quantity, prd.publishedDate, prd.description, prd.imageUrl ], (err, message) =>{
        if(err){
            result(err, err);
        }
        else{
            result(null, message);
        }
    });
}

let getAccount = (req, result) =>{
    sql.query("CALL GET_ALL_ACCOUNT()", (err, accounts) => {
        if (err) {
            result(err, err);
        } else {
            result(null, accounts[0]);
        }
    });
    
}

module.exports = {
    addProduct: addProduct,
    getAccount: getAccount,
}

