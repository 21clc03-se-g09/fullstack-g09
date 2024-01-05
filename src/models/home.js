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
            result(null, 'Đã thêm sản phẩm');
        }
    })
}

let getCart = (username, result) =>{
    sql.query("CALL GET_PRODUCT_CART(?)", [username], (err, product)=>{
        if(err){
            result(err, null);
        }
        else{
            console.log(product[0]);
            result(null, product);
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
    sql.query("CALL GET_USER_INFOR(?)", [username], (err, userIfor)=>{
        if(err){
            result(err, err);
        }
        else{
            result(null, userIfor[0]);
        }
    });
}

let updateInfor = (user, result) =>{
    sql.query("CALL UPDATE_INFOR (?, ?, ?, ?, ?, @mes)", [user.username, user.fullName, user.birthday, user.phone, user.address], (err, mesage)=>{
        if(err){
            result(err, err);
        }
        else{
            result(null, mesage);
        }
    });
} 

let Order = (user, result) =>{
    console.log(user);
    sql.query("CALL ORDERT (?, ?, ?, ?)", [user.username, user.fullName, user.phone, user.address], (err, mesage)=>{
        if(err){
            console.log(user);
            result(err, err);
        }
        else{
            result(null, 'Đặt hàng thành công');
        }
    });
}

let searchProduct= (productName, result) =>{
    console.log('test' + productName);
    sql.query("CALL SEARCH_PRODUCT(?)", [productName], (err, product) => {
        if (err) {
            result(err, null);
        } else {
            result(null, product);
        }
    });  
}



module.exports = {
    getAllProduct: getAllProduct,
    addToCart: addToCart,
    getCart: getCart,
    getToltalCart: getToltalCart,
    getOrder: getOrder,
    getUserInfor: getUserInfor,
    updateInfor: updateInfor,
    Order: Order,
    searchProduct: searchProduct,
}