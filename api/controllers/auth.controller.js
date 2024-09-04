import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma.js';

export const register = async (req,res) => {
  
    const {username,email,password} = req.body;
   //  console.log(req.body);

    try{
     //HASH THE PASSWORD
     const hashedPassword = await bcrypt.hash(password,10);
     console.log(hashedPassword);   //now our password is not a plain text anymore (it gets encrypted)
     
     //CREATE A NEW USER AND SAVE TO DB
     const newUser = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
        },
     });
     console.log(newUser);

     res.status(201).json({message: "User created Successfully"})

    }

    catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to create user!"});
    }
  };
  
export const login = async (req,res) => {
      //db operations 
      const {username , password} = req.body;

      try{

      //CHECK IF THE USER EXISTS
      //this user comes from the database
      const user = await prisma.user.findUnique({
        where:{username},
      });

      if(!user)
        return res.status(400).json({message:"Invalid Credentials!"})

      //CHECK IF THE PASSWORD IS CORRECT
      //here we are comparing user password with the password in the database
      const isPasswordValid = await bcrypt.compare(password,user.password);

      if(!isPasswordValid)
        return res.status(400).json({message:"Invalid Credentials!"})

      //GENERATE COOKIE TOKEN AND SEND TO THE USER

      //res.setHeader("Set-Cookie" , "test=" + "myValue").json("success")

      const age = 1000 * 60 * 60 * 24 * 7; //for a week 7days here 1000 is 1mili sec
      

      //when we are logged in we are creating a token using secret key
      const token = jwt.sign({
        id:user.id,  //here we are fetching user id from the database and stored it inside the token and then to hash it we use a secret key
        isAdmin: false,
      },
    process.env.JWT_SECRET_KEY,
    {expiresIn: age}
  );


  const {password: userPassword, ...userInfo} = user; 
       
        //so after using cookie parser
       //res.cookie("test2","myValue2")
        res.cookie("token" , token , {
          httpOnly:true,
          //secure:true
          maxAge: age, //our cookie expires whenever we close our session so to prevent this we give a maxAge , now aur cookie will expire after a week

        }).status(200).json(userInfo);
      }

      catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to login!"})
      }

  };
  
export const logout = (req,res) => {
  //db operations
  res.clearCookie("token").status(200).json({message: "Logout Successful"});
};