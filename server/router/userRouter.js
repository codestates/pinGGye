const controller = require("../controller");
const express = require("express");
const authUser = require("../middlewares/authUser");
const userRouter = express.Router();

userRouter.use('/mypage', authUser);

// 마이페이지 - 회원 정보 수정
userRouter.patch("/mypage", controller.updateUserInfo);

// 회원가입
userRouter.post('/signup', controller.signup);

// 로그인 
userRouter.post('/login', controller.login);

// 로그아웃
userRouter.post('/logout', controller.logout);

module.exports = userRouter;
