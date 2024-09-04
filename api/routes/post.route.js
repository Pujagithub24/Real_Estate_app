import express from "express"

const router = express.Router();
import {verifyToken} from "../middleware/verifyToken.js";
import { addPost, deletePost, getPost, getPosts, updatePost } from "../controllers/post.controller.js";

// app.use("/api/test", (req,res) => {
//     res.send("it works");
// })
//now we have separate route for each instead of having all the routes in the same app.js file 

// router.get("/test",(req,res) => {
//     console.log("router works");
// })

router.get("/",getPosts);
router.get("/:id",getPost);
router.post("/", verifyToken, addPost); //when we create a post we have to be authenticated so we use a middleware 
router.put("/:id", verifyToken,updatePost);
router.delete("/:id", verifyToken,deletePost);


export default router;