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
module.exports = {
    getAllProduct: getAllProduct,
    addToCart: addToCart,
}