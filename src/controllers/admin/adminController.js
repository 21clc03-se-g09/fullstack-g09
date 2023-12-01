import admin from "../../models/admin";

let showHomepage=(req, res) => {
    res.render('admin/homePage.ejs');
}
let showAddNewProduct = (req, res) => {
    res.render('admin/addnewproduct.ejs');
}




let addNewProduct = (req, res) => {
    console.log('test1');
    const {productId, productName, author, category, quantity, publishedDate, description, imageUrl } = req.body;
    const prd={productId, productName, author, category, quantity, publishedDate, description, imageUrl };
    console.log(prd);
    admin.addProduct(prd, (err, message)=>{
        if(err){
            console.log('lỗi: ');
            console.log(message);
        }
        else{
            console.log('thêm sản phẩm thành công!');
        }
    }) 
}

module.exports = {
    showHomepage: showHomepage,
    showAddNewProduct: showAddNewProduct,
    addNewProduct: addNewProduct,
}