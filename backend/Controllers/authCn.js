import User from "../Models/userModel.js";
import catchAsync from "../Utils/catchAsync.js";
import HandleError from "../utils/handleError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = catchAsync(async (req, res, next) => {
  const { username, password, phone } = req.body;

  if ((!username && !phone) || !password) {
    return next(new HandleError("لطفاً تمام فیلدهای مورد نیاز را وارد کنید!", 400));
  }
  const user = await User.findOne({ 
    $or: [{ username: username }, { phone: phone }] 
  });
  if (!user) {
    return next(new HandleError("نام کاربری یا شماره تلفن اشتباه است!", 401));
  }
  const validatedPassword = await bcrypt.compare(password, user.password);
  if (!validatedPassword) {
    return next(new HandleError("نام کاربری، شماره تلفن یا رمز عبور اشتباه است!", 401));
  }
  const { password: hashPass, ...userOthers } = user._doc;
  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  res.cookie('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/'
  });

  return res.status(200).json({
    status: 'success',
    data: userOthers
  });
});

export const register = catchAsync(async (req, res, next) => {
  const { password, phone, ...others } = await req?.body;
  const userExist = await User.findOne({ phone });
  if (userExist) {
    throw new HandleError("user is exist !", 400);
  }
  const newPassword = await bcrypt.hashSync(password, 10);
  const newUser = await User.create({
    ...others,
    password: newPassword,
    phone,
  });
  return res.status(201).json({
    status: "success",
    message: "register successfully",
  });
});
