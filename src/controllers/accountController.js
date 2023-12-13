import bcrypt from "bcrypt";
import account from "../models/user";
import mailController from "./mailController";
import { USER } from "../config/database";
require ('dotenv').config();


let showLogin = (req, res)=>{
    return res.render('login.ejs');
}
let showRegister = (req, res)=>{
    return res.render('register.ejs');
}
let showVerifyOtp = (req, res) =>{
    return res.render('verifyOtp.ejs');
}

// middlewares kiểm tra người dùng đăng nhập hay chưa 
let loggedin = (req, res, next) => {
    if (req.session.loggedin) {
        res.locals.user = req.session.user;
        next();
    } else {
        res.redirect('/login')
    }
}





let login = (req, res) => {
    const { username, password } = req.body;
    
    if (username && password) {
        account.findUser(username, (err, user) => {
            if (!user) {
                const conflictError = 'Tài khoản hoặc mật khẩu không chính xác';
                return res.render('login.ejs', {conflictError });
            } 
            else {
                account.findPassword(user, (er, f_password) =>{
                    console.log(f_password);
                    bcrypt.compare(password, f_password, (err, result) => {
                        if (err) {
                            res.redirect('/err'); 
                        } 
                        else {
                            if(result){
                                account.getRole(username, (err, role) => {
                                    if(role=='ADMIN'){
                                        req.session.role = 'ADMIN';
                                        res.redirect('/adminHomePage');
                                    }
                                    if(role=='USER'){
                                    req.session.loggedin = true;
                                    req.session.role = 'USER';
                                    req.session.user = user;
                                        res.redirect('/home');
                                    }
                                }); 
                            }
                            else{
                                const conflictError= "Tài khoản hoặc mật khẩu không chính xác.";
                                return res.render('login.ejs', {conflictError });
                            }
                            
                        }
                    });
                    
                });
                
            }
        })
    } 
    else {
        // Người dùng không cung cấp thông tin đăng nhập
        const conflictError = 'Vui lòng cung cấp tên người dùng và mật khẩu.';
        return res.render('account.ejs', {conflictError });
    }
}

let register = (req, res) => {
    const { new_username, new_password, mail } = req.body;
    console.log(new_username, new_password, mail);
    if (new_username && new_password && mail) {
        account.findUser(new_username, (err, user) => { // kiểm tra user có tồn tại không 
            if (user) {
                const errorRegister = 'Tài khoản đã tồn tại!';
                return res.render('register.ejs', { errorRegister });
                
            } 
            if(!user) {
                const ac = { new_username, new_password, mail };
                account.createAccount(ac, (err, message) => {
                    if (err) {
                        const errorRegister = message;
                        res.render('register.ejs', { errorRegister });
                    } else {
                        mailController.sendMail(ac.mail, "Verify Email",  (err, otp) => {
                            if (err) {
                                // Xử lý lỗi gửi email
                                const errorRegister = 'Lỗi gửi email xác minh';
                                res.render('register.ejs', { errorRegister });
                            } else {
                                req.session.otp=otp;
                                req.session.user=new_username;
                                res.redirect('/verifyotp');
                            }
                        });
                    }
                });
            }
        });
    } else {
        const errorRegister = 'Vui lòng điền đầy đủ thông tin';
        return res.render('register.ejs', { errorRegister });
    }
}
let verifyOtp = (req, res) =>{
    const reqOtp = req.body.otp;
    if(reqOtp){
        const User = req.session.user;
        const Otp= req.session.otp;
        if(reqOtp == Otp){
            console.log(Otp);
            console.log(User);
            account.verify(User, (err, message) => {
                if(err){
                    const errorRegister = 'Lỗi xác thực vui lòng thử lại';
                    res.render('verifyOtp.ejs', { errorRegister });
                }
                else{
                    res.render('login.ejs');
                }
            });
            
        }
        else{
            console.log("otp không đúng ");
            const errorRegister = 'Mã OTP không đúng vui lòng thử lại';
            res.render('verifyOtp.ejs', { errorRegister });
        }

    } else{
        console.log("vui longf nhaapj otp ");
        const errorRegister = 'Mã OTP không đúng vui lòng thử lại';
        res.render('verifyOtp.ejs', { errorRegister });
    }
}

let logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/500');
           
        } else {
            return res.redirect('/');
        }
    })
    
}
module.exports = {
    loggedin: loggedin,
    showLogin: showLogin, 
    showRegister: showRegister,
    showVerifyOtp: showVerifyOtp,
    login: login,
    logout: logout,
    register: register,
    verifyOtp: verifyOtp,

}
