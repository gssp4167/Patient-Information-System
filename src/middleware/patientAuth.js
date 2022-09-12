const jwt=require("jsonwebtoken");
const Register2=require("../models/register2");

const patientAuth=async(req, res, next) =>{
    try{
        const token= req.cookies.jwt;
        const verifyUser=jwt.verify(token, process.env.SECRET_KEY);
    //    console.log("user:", verifyUser);
        const user= await Register2.findOne({_id: verifyUser._id});
        console.log(user, "uuuuuuuuuu");
        req.token=token;
        req.user=user;
        req.email = user.email;
        next();
    }
    catch(error){
        res.status(401).send(error);
    }
}
module.exports=patientAuth;