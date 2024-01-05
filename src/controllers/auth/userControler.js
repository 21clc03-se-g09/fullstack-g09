import { render } from "express/lib/response";
import home from "../../models/home";
require ('dotenv').config();

let showHomePage = (req, res) =>{
    home.getAllProduct(req, (err, products)=>{
        if(err){
            return res.redirect('/err');
        }
        else{
            const user =req.session.user;
            return res.render('auth/homePage.ejs', {products: products[0], user: user});

        }
    });
}

let showCart = (req, res) => {
    const username = req.session.user;
    home.getCart(username, (err, products) => {
        if(err){
            res.redirect('/err');
        }
        else{
            home.getToltalCart(username, (err, totalCart)=>{
                if(err){
                    res.redirect('/err');
                }
                else{
                    res.render('auth/cart.ejs', {username: username, products: products[0], totalCart: totalCart});
                }
            }) 
        }
    });
}

let addToCart = (req, res) => { 
    const {productId, username} =req.body;
    const cart = {productId, username};
    
    home.addToCart(cart, (err, message)=>{
        console.log(message);
        if(err){
            return res.redirect('/err');
        }
        else{
            return res.redirect('/home');
        }
    });
} 

let showOrder = (req, res) =>{
    const username = req.session.user;
    home.getOrder(username, (err, orderIf)=>{
        if(err){
            res.redirect('/err');
        }
        else{
            res.render('auth/order.ejs', {username: username, orderIf: orderIf[0]});
        }
    });
}

let showUpdateInfor = (req, res) =>{
    const username = req.session.user;
    home.getUserInfor(username, (err, userIf)=>{
        if(err){
            res.redirect('/err');
        }
        else{
            res.render('auth/updateinfor.ejs', {userIf: userIf[0]});
        }
    })
}

let updateInfor = (req, res) =>{
    const username = req.session.user;
    const {fullName, phone, birthday, mail, address} = req.body;
    const user = {username, fullName, phone, birthday, mail, address}
    home.updateInfor(user, (err, message)=>{
        if(err){
            console.log(err);
            res.redirect('/err');
        }
        else{
            console.log(message);
            res.redirect('/home/updateinfor');
        }
    });
}

let Order = (req, res) =>{
    const {fullName, phone, address} =req.body;
    const username = req.session.user;
    const order = {username, fullName, phone, address}
    home.Order(order, (err, message)=>{
        if(err){
            res.redirect('/err');
        }
        else{
            home.getOrder(username, (err, orderIf)=>{
                if(err){
                    res.redirect('/err');
                }
                else{
                    res.render('auth/order.ejs', {username: username, orderIf: orderIf[0], orderstatus: message});
                }
            });
        
        }
    });
}

let searchProduct =  (req, res) =>{
    console.log(req);
    const {productName} = req.body;
    console.log(productName);
    home.searchProduct(req, (productName, products)=>{
        if(err){
            return res.redirect('/err');
        }
        else{
            return res.render('auth/homePage.ejs', {products: products[0]});
        }
    });
}

module.exports = {
    showHomePage : showHomePage,
    showCart: showCart,
    addToCart: addToCart,
    showOrder: showOrder,
    showUpdateInfor: showUpdateInfor,
    updateInfor: updateInfor,
    Order: Order,
    searchProduct:searchProduct,
}