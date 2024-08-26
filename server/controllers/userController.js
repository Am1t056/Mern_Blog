//===========Register A New USER========================
//POST : api/users/register

const HttpError = require("../models/errorModel");
const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

//UNPROTECTED
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, password2 } = req.body;
    if (!name || !email || !password) {
      return next(new HttpError("Please fill in all fields", 422));
    }

    const newEmail = email.toLowerCase();

    const emailExists = await userModel.findOne({ email: newEmail });

    if (emailExists) {
      return next(new HttpError("Email already exists", 422));
    }

    if (password.trim().length < 6) {
      return next(
        new HttpError("Password must be at least 6 characters long", 422)
      );
    }

    if (password != password2) {
      return next(new HttpError("Passwords do not match", 422));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      name,
      email: newEmail,
      password: hashedPassword,
    });

    res.status(201).json(`New user ${newUser.email} registered.`);
  } catch (error) {
    return next(new HttpError("User Registration Failed", 422));
  }
};

//===========login A Registered USER========================
//POST : api/users/login
//UNPROTECTED
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new HttpError("Please fill in all fields", 422));
    }

    const newEmail = email.toLowerCase();

    const user = await userModel.findOne({ email: newEmail });

    if (!user) {
      return next(new HttpError("User not found", 401));
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return next(new HttpError("Invalid credentials", 401));
    }

    const { _id: id, name } = user;
    const token = jwt.sign({ id, name }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    res.status(200).json({ token, id, name, email: newEmail });
  } catch (error) {
    return next(
      new HttpError("Login failed. Please check your credentials", 422)
    );
  }
};

//=========== USER PROFILE========================
//POST : api/users/:id
//PROTECTED
const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id).select("-password");
    if (!user) {
      return next(new HttpError("User not found", 404));
    }
    res.status(200).json(user);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//===========Change USER PROFILE========================
//POST : api/users/change-avatar
//PROTECTED
const changeAvatar = async (req, res, next) => {
  try {
    if (!req.files.avatar) {
      return next(new HttpError("Please upload an image", 422));
    }

    //find user from database
    const user = await userModel.findById(req.user.id);

    //delete old avatar if exists
    if (user.avatar) {
      fs.unlink(
        path.join(__dirname, "..", "uploads", user.avatar),
        (err) => {
          if (err) {
            return next(new HttpError("Failed to delete old avatar", 500));
          }
        }
      );
    }

    const { avatar } = req.files;

    //check file size
    if (avatar.size > 500000) {
      return next(new HttpError("Avatar size should be less than 500KB", 422));
    }

    let fileName;
    fileName = avatar.name;
    let splittedFilename = fileName.split(".");
    let newFilename =
      splittedFilename[0] +
      uuid() +
      "." +
      splittedFilename[splittedFilename.length - 1];
    avatar.mv(
      path.join(__dirname, "..", "uploads", newFilename),
      async (err) => {
        if (err) {
          return next(new HttpError(err));
        }

        const updatedAvatar = await userModel.findByIdAndUpdate(
          req.user.id,
          { avatar: newFilename },
          { new: true }
        );

        if (!updatedAvatar) {
          return next(new HttpError("Failed to update avatar", 422));
        }

        res.status(200).json(updatedAvatar);
      }
    );
  } catch (error) {
    return next(new HttpError(error));
  }
};

//===========Edit USER Details (from profile)========================
//POST : api/users/edit-user
//PROTECTED
const editUser = async (req, res, next) => {
  try {
    const { name, email, currentPassword, newPassword, confirmNewPassword } =
      req.body;
    if (
      !name ||
      !email ||
      !currentPassword ||
      !newPassword ||
      !confirmNewPassword
    ) {
      return next(new HttpError("Please fill all fields", 422));
    }

    //get users from database
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return next(new HttpError("User not found", 404));
    }

    //make sure new email doesn't exists already
    const emailExist = await userModel.findOne({ email });
    if (emailExist && emailExist._id !== req.user.id) {
      return next(new HttpError("Email already exists", 422));
    }

    //compare current password to db password
    const validateUserPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!validateUserPassword) {
      return next(new HttpError("Invalid current password", 401));
    }

    //compare new passwords
    if (newPassword !== confirmNewPassword) {
      return next(
        new HttpError("New password and confirm new password should match", 422)
      );
    }

    //hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    //update user info in database
    const newInfo = await userModel.findByIdAndUpdate(
      req.user.id,
      { name, email, password: hashedPassword },
      { new: true }
    );

    res.status(200).json(newInfo);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//=========== GET AUTHORS=======================
//POST : api/users/:id
//UNPROTECTED
const getAuthors = async (req, res, next) => {
  try {
    const authors = await userModel.find().select("-password");
    res.json(authors);
  } catch (error) {
    return next(new HttpError(error));
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  changeAvatar,
  editUser,
  getAuthors,
};
