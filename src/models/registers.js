const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const employeeSchema=new mongoose.Schema({
    hospital : {
        type: String,
        requied: true
    },
    doctor : {
        type: String,
        requied: true
    },

    qualification : {
        type: String,
        requied: true
    },
    experience : {
        type: Number,
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
    tokens:[{
        token:{
            type:String,
            required: true
        }
    }]
    
})

employeeSchema.methods.generateAuthToken= async function( req, res){
    try{
        console.log(this._id);
        const token=jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);   
        this.tokens=this.tokens.concat({token:token})
        await this.save();
        return token;
    }
    catch(error){
        res.send(error);
    }
}

employeeSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password, 10);
    }
    next();
})
const Register=new mongoose.model("Register", employeeSchema);
module.exports = Register;

