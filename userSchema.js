import mongoose from "mongoose";
import bcrypt from 'bcrypt' 
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        default: "18",
    },
    gender: {
        type: String,
        default: "Male",
    },
    dob: {
        type: Date,
        default: Date.now,
    },
    mobile: {
        type: String,
        default: "123456789"
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }]
});


//hash password before saving
UserSchema.pre("save", async function (next) {
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

//generate auth token for user
UserSchema.methods.generateAuthToken = async function () {
    try{
        const generatedToken = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: generatedToken });
        await this.save();
        return generatedToken;
    }catch(err){
        console.log(err);
    }
}

const User = mongoose.model("User", UserSchema);

export default User;