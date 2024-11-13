import User from "../Models/userModel.js";
import jwt from "jsonwebtoken";
import catchAsync from "../Utils/catchAsync.js";
import HandleError from "../utils/handleError.js";

export const nobitexLogin = catchAsync(async (req, res, next) => {
  try {
    const { username, password, captcha, otp, token } = req.body;
    const { id } = req?.user;

    if (!token) {
      const response = await fetch("https://api.nobitex.ir/auth/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, captcha, otp }),
      });

      const data = await response.json();
      if (data?.status === "success") {
        const user = await User.findByIdAndUpdate(
          id,
          { $set: { "tokens.nobitex": data.token } },
          { new: true }
        );

        if (!user) {
          throw new HandleError("User not found!", 404);
        }

        return res.status(200).json({ message: "Nobitex token added successfully", user });
      } else {
        throw new HandleError("Nobitex login failed!", 400);
      }
    } else {
      const profileResponse = await fetch('https://api.nobitex.ir/users/profile', {
        headers: {
          "Authorization": `Token ${token}`
        },
        method: "GET"
      });
      const data = await profileResponse.json();
      if(data?.status==='ok'){
        const user = await User.findByIdAndUpdate(
          id,
          { $set: { "tokens.nobitex": token } },
          { new: true }
        );
  
        if (!user) {
          throw new HandleError("User not found!", 404);
        }
        return res.status(200).json({ status: "success", message: "Nobitex token added successfully",data });
      }else{
        throw new HandleError('token is not valid!',400)
      }
    }
  } catch (error) {
    next(error);
  }
});

export const getAllOrders = catchAsync(async (req, res, next) => {
  console.log("hioiii");
  const { id } = req?.user;
  const user = await User.findById(id);
  console.log(user);
  // const res = await fetch('https://api.nobitex.ir/market/orders/list',{

  // })
});