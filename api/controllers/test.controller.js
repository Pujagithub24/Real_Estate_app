import jwt from "jsonwebtoken";

export const shouldBeLoggedIn = async (req,res) => {

    console.log(req.userId); 
    // const token = req.cookies.token;

    // if(!token)  return res.status(401).json({message: "Not Authenticated!"});

    // //we are verify our token here
    // jwt.verify(token, process.env.JWT_SECRET_KEY , async (err , payload) => {
         
    //     //if there is error means our token is not valid
    //     if(err)  return res.status(403).json({message: "Token is not valid!"});
    // });

    //if everything is okay
    res.status(200).json({message: "You are Authenticated"})

};

export const shouldBeAdmin = async (req,res) => {
  
    const token = req.cookies.token;

    if(!token)  return res.status(401).json({message: "Not Authenticated!"});

    //we are verify our token here
    jwt.verify(token, process.env.JWT_SECRET_KEY , async (err , payload) => {
         
        //if there is error means our token is not valid
        if(err)  return res.status(403).json({message: "Token is not valid!"});

        if(!payload.isAdmin){
            return res.status(403).json({message: "Not authorized!"});
        }


    });

    //if everything is okay
    res.status(200).json({message: "You are Authenticated"})

}


