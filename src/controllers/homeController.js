import home from "../models/home.js";

let getHomePage =(req, res) =>{
    return res.render('homePage.ejs');
}

let getMainPage =(req, res) =>{
    home.getAllProduct(req, (err, products) =>{
        if(err){
            console.log(account);
        }
        else{
            console.log(products);
            res.render('mainPage.ejs', { products: products[0] });
        }
    });
}

module.exports = {
    getHomePage: getHomePage,
    getMainPage: getMainPage,
}