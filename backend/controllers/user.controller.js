import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req,res)=>{
    try{
        const {fullname,email,phoneNumber,password,role} = await req.body;
        if(!fullname || !email || !phoneNumber || !password || !role){
            return res.status(401).json({
                message : "something is missing",
                success : false,

            });
        };
        const file = req.file;

        const user = await User.findOne({email});
        if(user){
            return res.status(401).json({
                message : "user already exists",
                success : false,

            });
        }
        const hashedPassword = await bcrypt.hash(password,10);
        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
        });
        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });    
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false,
        });
        
    }
}
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        // Check if the role matches
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with the current role.",
                success: false
            });
        }

        const tokenData = { userId: user._id };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000, 
            httpOnly: true, 
            sameSite: 'strict'
        }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false,
        });
    }
};

export const logout = async (req,res)=>{
    try{
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message: "logged out successfully.",
            success : true,
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false,
        });
        
    }
}
export const updateProfile = async (req,res)=>{
    try{
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;

        // cloudinary part pending


        let skillsArray = skills ? skills.split(",") : [];
        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }
        // updating the data
        if(fullname){
            user.fullname = fullname
        }
        if(email){
            user.email = email
        }
        if(phoneNumber){
            user.phoneNumber = phoneNumber
        } 
        if(bio){
            user.profile.bio = bio  
        } 
        if(skills){
            user.profile.skills = skillsArray
        }
        
        // resume part


        await user.save();
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }
        return res.status(200).json({
            message:"Profile updated successfully.",
            user,
            success:true
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false,
        }); 
    }
}