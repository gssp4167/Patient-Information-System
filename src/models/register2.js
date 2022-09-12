const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const patientSchema=new mongoose.Schema({
    name : {
        type: String,
        requied: true
    },
    sex : {
        type: String,
        requied: true
    },

    dob : {
        type: String,
        requied: true
    },
    contact:{
        type: Number,
        requied: true
    },
    maritialstatus:{
        type: String,
        requied: true
    },
    add1 : {
        type: String,
        requied: true
    },
    add2 : {
        type: String,
        requied: true
    },
    emergencycontact:{
        type: Number,
        requied: true
    },
    emergencycontactrealtion : {
        type: String,
        requied: true
    },
    email : {
        type: String,
        requied: true,
        unique: true
    }, 
    password : {
        type: String,
        requied: true
    },
    vists:{
        type: Number,
        required: true
    },
    tokens:[{
        token:{
            type:String,
            required: true
        }
    }]
    
})

patientSchema.methods.generateAuthToken= async function(){
    try{
       // console.log(this._id);
        const token=jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);   
        this.tokens=this.tokens.concat({token:token})
        await this.save();
        return token;
    }
    catch(error){
        res.send(error);
    }
}

patientSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password, 10);
    }
    next();
})
const Register2=new mongoose.model("Patientregister", patientSchema);
module.exports = Register2;