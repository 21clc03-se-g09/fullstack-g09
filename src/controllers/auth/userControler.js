import bcrypt from "bcrypt";
import account from "../models/user";
import mailController from "./mailController";
require ('dotenv').config();

let showHomePage = (req, res) =>{
    return res.render('auth/homePage');
}

module.exports = {
    showHomePage : showHomePage,

}