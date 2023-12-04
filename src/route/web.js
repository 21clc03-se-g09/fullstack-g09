import express from "express";
import * as homeController from "../controllers/homeController";
import * as auth from "../controllers/accountController";
import * as admin from "../controllers/admin/adminController";
let route=express.Router();

let initWebRoutes = (app)=>{

    //home page
    route.get('/', homeController.getMainPage);
    route.get('/login', auth.showLogin );
    route.get('/register',auth.showRegister);
    route.get('/verifyotp', auth.showVerifyOtp);
    
    route.post('/register', auth.register);
    route.post('/verifyotp' , auth.verifyOtp);
    route.post('/login', auth.login);

    ///admin
    route.get('/adminHomePage', admin.showHomepage);
    route.get('/admin/addnewproduct', admin.showAddNewProduct);
    route.get('/admin/accountmanagement', admin.showAccountManagement);
    
    route.post('/addmin/addnewproduct', admin.addNewProduct);



    route.get('/home', homeController.getMainPage);

    

   

    //.get('/logout', authMiddleware.loggedin, login.logout)

    //route.get('/verify', auth.verify)


    return app.use("/", route)
}

module.exports = initWebRoutes;