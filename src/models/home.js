import sql from "./db";
let getAllProduct = (req, result) =>{
    sql.query("CALL GET_ALL_PRODUCT()", (err, product) => {
        if (err) {
            console.error('Error while executing query:', err);
            result(err, null);
        } else {
            result(null, product);
        }
    });  
}

let addToCart = (cart, result) =>{
    sql.query("CALL ADD_CART(?,?, @err)", [cart.productId, cart.username], (err, mesage)=>{
        if(err){
            result(err, err);
        }
        else{
            console.log(mesage);
            result(null, 'Đã thêm sản phẩm');
        }
    })
}

let getCart = (username, result) =>{
    sql.query("CALL GET_PRODUCT_CART(?)", [username], (err, product)=>{
        if(err){
            result(err, err);
        }
        else{
            result(null, product[0]);
        }
    });
}

let getToltalCart = (username, result) =>{
    sql.query("SELECT TOTAL_CART(?) AS RESULT", [username], (err,  RESULT) =>{
        if(err){
            console.log(err);
            result(err, err);
        }
        else{
            result(null,  RESULT[0].RESULT);
        }
    });
}

let getOrder = (username, result) =>{
    sql.query("CALL GET_ORDER(?)", [username], (err, orderIf) =>{
        if(err){
            result(err, err); 
        }
        else{
            result(null, orderIf[0]);
        }
    });
}

let getUserInfor = (username, result) =>{
    sql.query("CALL GET_USER_INFOR(?)", [])
}




module.exports = {
    getAllProduct: getAllProduct,
    addToCart: addToCart,
    getCart: getCart,
    getToltalCart: getToltalCart,
    getOrder: getOrder,
}