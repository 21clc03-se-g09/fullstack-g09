import sql from "./db";
import bcrypt from "bcrypt"
let findUser = (USERNAME, result) => {
    console.log(USERNAME);
    sql.query("SELECT FIND_USER (?) AS RESULT", [USERNAME], (err, RESULT) => {
        if (err) {
            result(err, null);
        }
        else{
            result(null, RESULT[0].RESULT);
        }
    });
}

let findPassword = (user, result) =>{
    sql.query("SELECT FIND_PASSWORD (?) AS RESULT", [user], (err, RESULT) =>{
        if (err) {
            result(err, null);
        }
        else{
            result(null, RESULT[0].RESULT);
        }
    });
}
let getRole = (user, result) =>{
    sql.query(" SELECT FIND_ROLE (?) AS res", [user], (err, res)=>{
        if (err) {
            result(err, null);
        }
        else{
            result(null, res[0].res);
        }
    });
}

let createAccount =(ac, result) =>{
    bcrypt.hash(ac.new_password, 10, (err, pass)=> {
        if(err){
            result(err, err);
        }
        else{
            sql.query("CALL CREATE_USER (?, ?, ?, @err)", [ac.new_username, pass, ac.mail], (err, message) =>{
                if(err){
                    result(err, err);
                }
                else{
                    result(null, "Đã thêm vào csdl");
                }
            });
        }
        return;
    });
} 

let verify = (user, result) =>{
    sql.query("CALL VERIFY_USER (?, @err)", [user], (err, message) =>{
        if(err){
            result(err, message);
        }
        else{
            result(null, message);
        }
    });
    return;
}

module.exports = {
    findUser: findUser,
    createAccount: createAccount,
    verify: verify,
    getRole: getRole,
    findPassword: findPassword,
}
