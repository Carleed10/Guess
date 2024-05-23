const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Usermodel = require("../Models/Usermodel")


const genRandom = () => {

    let otp = ""

    for (let index = 0; index < 6; index++) {
        const randomNumber = Math.floor(Math.random() *10)
        otp = otp + randomNumber        
    }
    return otp
    // console.log(randomNumber);

    
}

const signUp = async(req, res)=>{
    const {userName, email, password} = req.body
    if (!userName || !email || !password){
        res.status(400).send({message : 'All fields are mandatory'})
    }else{
        try {
            const verifyUserName = await Usermodel.findOne({
                userName
            })
            const verifyEmail = await Usermodel.findOne({
                email
            })


            if(verifyUserName && verifyEmail){
                res.status(403).send({message : 'User already exist'})
            }
            else if (verifyUserName) {
                res.status(400).send({message : 'Username is already in use'})
            }
            if (verifyEmail) {
                res.status(400).send({message : 'Email is already in use'})
            }else{
                const hashedPassword = await bcryptjs.hash(password, 5)
                const createUser = await Usermodel.create({
                    userName,
                    email,
                    password : hashedPassword
                })

                if (!createUser) {
                    res.status(400).send({message : 'Unable to create user', status : false})
                }else{
                    res.status(200).send({message : `Welcome ${userName}`, status : 'success'})
                    console.log( 'createdUser:' , createUser);

                }
            }
        } catch (error) {
            res.status(500).send({message : 'Internal server error' , status : false})
            console.log( 'Signup error:' , error);

        }
    }
  
}


const login = async(req, res) => {
    const {email, password} = req.body
    if (!email || !password){
        res.status(400).send({message : 'All fields are mandatory'})
    }else{
            const findUser = await Usermodel.findOne({email})

            if (!findUser) {
                res.status(400).send({message : 'Go signup u fool'})
            }
            else{
                const comparePassword = await bcryptjs.compare(password, findUser.password)
                const secretKey = process.env.SECRET_KEY

            if (!comparePassword) {
                 res.status(400).send({message : 'You inputed an incorrect password dumbass, try again hunn'})
            } 
            else {
                    const genToken = jwt.sign({
                        user : { username:findUser.userName , email, password}
                    },
                    secretKey,{
                        expiresIn : '1d'
                    }
                )
                res.status(200).send({message : 'Login successful nigga', genToken, status : 'success'})

                }
            }
    }
}



const deleteAccount = async(req, res) => {
    const user = req.user
    if (!user) {
        res.status(400).send({message : 'Authorisation not provided'})
    }else{
        const {username, email} = user
        try {
            const findUser = await Usermodel.findOneAndDelete({email})

            if (findUser) {
                res.status(200).send({message : 'User deleted succesfully'})
                console.log('Deleted user: ', findUser);
            } else{
                res.status(400).send({message : 'Unable to delete user'})
                
            }                                                                                
        } catch (error) {
        res.status(500).send({message : 'Internal server error'})
            
        }
    }

}


const editPassword = async (req, res) => {
    const user = req.user
    if (!user) {
        res.status(400).send({message : 'Authorization not provided'})        
    }else{
        const {password} = req.body
        const {email} = user
       try {
        const findUser = await Usermodel.findOne({email})
        if (!findUser) {
            res.status(400).send({message : 'Unable to edit password'})
        } else {


        const hashedPassword = await bcryptjs.hash(password, 5)

        const newPassword = await Usermodel.findOneAndUpdate({email}, {
                password : hashedPassword
            }, {new : true})
     

            if (!newPassword) {
                res.status(400).send({message : 'Unable to change password', status : false})
            }else{
                res.status(200).send({message : 'Password changed successfully'})
                console.log( 'createdUser:' , newPassword);

            }
        }

       } catch (error) {
            res.status(500).send({message : 'Internal server error'})
       }
    }
}

const forgotPassword = async(req, res) =>{
    const {email} = req.body
    
    if(!email){
        res.status(400).send({message : "Email is mandatory"})
    }else{
        try {
            const validateEmail = await Usermodel.findOne({email}) 

            if (!validateEmail) {
                res.status(400).send({message : "User doesn't exist, sign up you fool"})
            } else {
                let userOtp = genRandom()
                res.status(200).send({message : "OTP sent successfully", userOtp})                
            }
        } catch (error) {
            res.status(500).send({message:"internal server error"})  
            console.log(error);
        }
    }
}



const profile = async (req, res) => {
    const {firstname, lastname, jobType, jobCategory, education, about, city, country, fullAddress} = req.body
    
    if (!firstname, !lastname, !jobType, !jobCategory, !education, !about, !city, !country, !fullAddress) {
        res.status(400).send({message : 'All fields are mandatory'})
    }else{
        try {
            const profileForm = await userModel.findOneAndUpdate(
                {email},
                { $set: {firstName: firstname, lastName : lastname , jobType : jobType , jobCategory : jobCategory, education : education, about : about, city : city, country : country, fullAddress : Fulladdress}
            }, {new : true})
            if (!profileForm) {
                res.status(400).send({message : "Unable to update profile"})
            }else{
                res.status(200).send({message : "Profile updated successfully"})

            }
        } catch (error) {
            res.status(500).send({message : 'Internal server error'})
        }
    }
}


const social = async (req, res) => {
    const {x, instagram, facebook, linkedIn} = req.body

    if (!x, !instagram, !facebook, !linkedIn) {
        res.status(400).send({message : 'All fields are mandatory'})
        
    } else {
        try {
            const socialForm = await Usermodel.findOneAndUpdate({email},
                {$set : {x : x, facebook : facebook, linkedIn : linkedIn, instagram : instagram}},
                {new : true})

                if (!socialForm) {
                    res.status(400).send({message : "Unable to update"})
                }else{
                res.status(200).send({message : "Profile updated successfully"})
                }
        } catch (error) {
            res.status(500).send({message : 'Internal server error'})
            console.log("Internal server error");
        }
    }
}


module.exports = {signUp, login, deleteAccount, editPassword, profile, forgotPassword, social}