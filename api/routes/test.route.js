import express from "express"
import { shouldBeAdmin, shouldBeLoggedIn } from "../controllers/test.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

//here verify token is our middleware
//when we make a request for this end point its gonna run our middleware first 
router.get("/should-be-logged-in",verifyToken, shouldBeLoggedIn);

router.get("/should-be-admin" , shouldBeAdmin);

export default router;