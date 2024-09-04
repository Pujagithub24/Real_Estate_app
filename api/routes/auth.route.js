import express from "express"
import { login, logout, register } from "../controllers/auth.controller.js";

const router = express.Router();

// router.post("/register",(req,res) => {
//     console.log("router works");
// })
// after writing controller it is updated

router.post("/register",register);

router.post("/login",login)

// router.post("/login", (req, res) => {
//     console.log("Login route hit");
//     console.log("Request body:", req.body);
//     login(req, res);
// });


router.post("/logout",logout)

export default router;