import jwt from "jsonwebtoken";

export const verifyToken = (req,res,next) => {

    const token = req.cookies.token;

    if(!token)  return res.status(401).json({message: "Not Authenticated!"});

    //we are verify our token here
    jwt.verify(token, process.env.JWT_SECRET_KEY , async (err , payload) => {
         
        //if there is error means our token is not valid
        if(err)  return res.status(403).json({message: "Token is not valid!"});
        req.userId = payload.id;

        //if this verification is completed we run the next process
        next(); //means shouldBeLoggedIn now runs
    });
     
}