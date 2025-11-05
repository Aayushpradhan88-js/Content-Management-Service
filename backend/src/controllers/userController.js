import mongoose from "mongoose";

import { User } from "../models/userModels.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//TEMPORARY IMPORT PACKAGES
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//---------- Registering User ----------//
export const registerUser = async (req, res) => {
  const { username, firstname, lastname, email, password } = req.body;

  if (
    [username, firstname, email, password].some((field) => field?.trim() === "")
  ) {
    throw new error(401, "All fields are required");
  };

  const existedUser = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (existedUser) {
    throw new ApiError(401, "Already taken try another");
  };
  // console.log(req.files)

  const userHash = await bcrypt.hash(password, 10);

  if (!userHash) {
    throw new ApiError(500, "Password is not hashed");
  };

  const newUser = await User.create({
    username,
    firstname,
    lastname,
    email,
    password: userHash
  })

  const token = jwt.sign(
    {
      _id: newUser._id,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '1d' }

  );
  // console.log(process.env.JWT_SECRET_KEY)

  const createdUser = await User.findById(newUser._id).select("-password");

  return res
    .status(201)
    .cookie("token", token, {
      httpOnly: true,
      secure: false // Set to true when using HTTPS in production
    })
    .json(
      new ApiResponse(
        201,
        { user: createdUser, token },
        "User registered successfully",
        token
      )
    );

};

//---------- login user ----------//
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email)
  console.log(password)

  if (!email) {
    throw new ApiError(400, "Email is required");
  };

  const user = await User.findOne({ email });
  if (!user) throw new ApiError("Invalid email");

  const isPasswordValid = await user.validatePassword(password)
  if (!isPasswordValid) throw new ApiError("Invalid email or password");

  const token = jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: '7D'
    }
  )

  const loggedInUser = await User.findById(user._id).select("-password");

  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      secure: false // Set to true when using HTTPS in production
    })
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          token: token
        },
        "Successfully logged in"
      )
    );

}

//----------logout user ----------//
export const logoutUser = async (req, res) => {
  try {
    // Clear the HTTP-only cookie
    const options = {
      httpOnly: true,
      secure: false, // Set to true when using HTTPS in production
      sameSite: 'strict',
    };
    
    return res
      .status(200)
      .clearCookie("token", options)
      .json(
        new ApiResponse(
          200,
          options,
          "Successfully logged out"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error during logout");
  }
};



// update user
export const updateUser = async (req, res) => {
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    if (!updateUser) {
      return res.status(403).json("Id doesn't match")
    }

    return res
      .status(205)
      .json(
        new ApiResponse(
          205,
          `You're details are updated ${updateUser.username}`,
          updateUser,
        )
      )
  } catch (error) {
    return res.status(400).json({ message: "cannot update user" })
  }
};

//Follow Status
export const toogleFollow = async (req, res) => {
  const { channelId } = req.params;

  //TODO: POPULATE USER VERYFY JWT
  const currentUserId = req.user?._id;

  if (!currentUserId) throw new ApiError(401, "Unauthorized: User not logged In");

  if (!mongoose.Types.ObjectId.isValid(channelId)) throw new ApiError(400, "Invalid Channel ID");

  // if (!mongoose.Types.ObjectId.isValid(currentUserId)) throw new ApiError(400, "Invalid User ID");
  if (!mongoose.Types.ObjectId.isValid(currentUserId)) throw new ApiError(400, "Invalid User ID");


  if (currentUserId.toString() === channelId.toString()) throw new ApiError(400, "You Cannot follow youtself");


  try {
    const userToFollow = await User.findById(channelId);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow) throw new ApiError(403, "CHANNEL NOT FOUND");
    if (!currentUser) throw new ApiError(403, "CURRENT USER ID NOT FOUND");

    const isFollowing = currentUser.following.includes(userToFollow._id);

    if (isFollowing) {
      //----------UNFOLLOW----------//
      currentUser.following.pull(userToFollow._id);
      userToFollow.followers.pull(currentUser._id);

      await currentUser.save();
      await userToFollow.save();

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            {
              isFollowing: false,
              followerCount: userToFollow.followers.length,
              message: `SUCCESSFULLY UNFOLLOWED ${userToFollow.username}`
            },
            "UNFOLLOWED SUCCESSFULLY"
          )
        )
    }

    else {
      //----------FOLLOW----------//
      currentUser.following.push(userToFollow._id);
      userToFollow.followers.push(currentUser._id);

      await currentUser.save();
      await userToFollow.save();

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            {
              isFollowing: true,
              followerCount: userToFollow.followers.length,
              message: `SUCCESSFULLY FOLLOWED ${userToFollow.username}`
            },
            "FOLLOWED SUCCESSFULLY"
          )
        )
    }
  }


  catch (error) {
    // throw new ApiError(500, error.message, "INTERNAL SERVER ERROR");
    next(new ApiError(500, error.message || "Internal server error during follow/unfollow"));

  }
}

//USER PROFILE API
export const getUserProfile = async (req, res) => {

}