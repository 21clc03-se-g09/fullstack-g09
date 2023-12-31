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
let removeAcount = (ussername, result)=>{
    sql.query(" CALL DELETE_USER (?)", [ussername], (err, message)=>{
        if(err){
            result(err, err);
        }
        else{
            result(null, 'Đã xoá tài khoản');
        }
    })
}
let getOrder = (req, result) =>{
    sql.query("CALL GET_ALL_ORDER()", (err, order) => {
        if (err) {
            result(err, err);
        } else {
            result(null, order[0]);
        }
    }); 
}

module.exports = {
    addProduct: addProduct,
    getAccount: getAccount,
    removeAcount: removeAcount,
    getOrder: getOrder,
}

