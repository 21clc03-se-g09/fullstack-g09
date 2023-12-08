import express from "express";
import * as homeController from "../controllers/homeController";
import * as auth from "../controllers/accountController";
import * as admin from "../controllers/admin/adminController";
import * as user from "../controllers/auth/userControler";
let route=express.Router();

let initWebRoutes = (app)=>{

    //mainpage
    route.get('/', homeController.getMainPage);
    route.get('/login', auth.showLogin );
    route.get('/register',auth.showRegister);
    route.get('/verifyotp', auth.showVerifyOtp);
    
    route.post('/register', auth.register);
    route.post('/verifyotp' , auth.verifyOtp);
    route.post('/login', auth.login);

    //homepage
    route.get('/home', auth.loggedin, user.showHomePage);
    
    route.post('/addtocart', user.addToCart);

    ///admin
    route.get('/adminHomePage',auth.loggedin, admin.showHomepage);
    route.get('/admin/addnewproduct', admin.showAddNewProduct);
    route.get('/admin/accountmanagement', admin.showAccountManagement);
    
    route.post('/addmin/addnewproduct', admin.addNewProduct);


    //err
    route.get('/err', (req, res) => {
        return res.render('err.ejs');
    });

    

   

    //.get('/logout', authMiddleware.loggedin, login.logout)

    //route.get('/verify', auth.verify)


    return app.use("/", route)
}

module.exports = initWebRoutes;