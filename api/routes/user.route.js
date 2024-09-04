import express from "express"
import { deleteUser, getUser, getUsers, updateUser, savePost , profilePosts, getNotificationNumber} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/",getUsers);

//router.get("/:id",verifyToken ,getUser); //when we fetch our user profile we have to be logged in first so we use verifyToken middleware

router.put("/:id", verifyToken , updateUser);

router.delete("/:id",verifyToken , deleteUser);

router.post("/save" , verifyToken , savePost);

router.get("/profilePosts" , verifyToken , profilePosts);

router.get("/notification", verifyToken, getNotificationNumber);

export default router;