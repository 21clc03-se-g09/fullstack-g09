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
                    res.render('auth/cart.ejs', {username: username, products: products, totalCart: totalCart});
                }
            }) 
        }
    });
}

let addToCart = (req, res) => {
    const {productId, username} = req.body;
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

module.exports = {
    showHomePage : showHomePage,
    showCart: showCart,
    addToCart: addToCart,
}