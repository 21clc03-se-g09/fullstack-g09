import admin from "../../models/admin";

let showHomepage=(req, res) => {
    admin.getOrder(req, (err, order) =>{
        if(err){
            res.redirect('/err');
        }
        else{
            res.render('admin/homePage.ejs', { order: order });
        }
    }); 

}
let showAddNewProduct = (req, res) => {
    res.render('admin/addnewproduct.ejs');
}
let showAccountManagement = (req, res) =>{
    admin.getAccount(req, (err, account) =>{
        if(err){
            console.log(account);
        }
        else{
            res.render('admin/accountManagement.ejs', { accounts: account });
        }
    }); 
}
let isAdmin = (req, res, next) =>{
    if(req.session.loggedin){
        if(req.session.role == 'ADMIN'){
            next();
        }
        else{
            res.redirect('/err');
        }
    }
    else{
        res.redirect('/login')
    }
}

let removeAcount = (req, res) =>{
    const {username} = req.body;
    if(username){
        admin.removeAcount(username, (err, message)=>{
            if(err){
                console.log(err);
                res.redirect('/admin/accountmanagement');
            }
            else{
                res.redirect('/admin/accountmanagement');
            }

        });
    }
    else{
        res.render('admin/accountManagement.ejs', {message: 'lỗi xoá tài khoản'});
    }
}




let addNewProduct = (req, res) => {
    const {productId, productName, price, author, category, quantity, publishedDate, description, imageUrl } = req.body;
    const prd={productId, productName, price, author, category, quantity, publishedDate, description, imageUrl };
    admin.addProduct(prd, (err, message)=>{
        if(err){
            res.render('admin/addNewProduct.ejs', {message: message});
        }
        else{
            console.error()
            const status = "Product added successfully!";
            res.render('admin/addNewProduct.ejs', {message: status});
        }
    }) 
}



module.exports = {
    showHomepage: showHomepage,
    showAddNewProduct: showAddNewProduct,
    showAccountManagement: showAccountManagement,
    addNewProduct: addNewProduct,
    isAdmin: isAdmin,
    removeAcount: removeAcount,
}