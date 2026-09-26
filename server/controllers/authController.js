const User = require("../models/user");
const passport = require("passport");
const mongoose = require("mongoose");

// ==================== REGISTER ====================

const registerUser = async (req, res) => {
  try {
    console.log("REGISTER REQUEST:", req.body.email);

    const existingUser = await User.findOne({
      email: req.body.email
    });

    if (existingUser) {
      return res.status(403).json({
        success: false,
        message: "User already exists"
      });
    }

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      dob: req.body.dob || null,
      phone: req.body.phone || "",
      isAdmin: req.body.isAdmin || false,
      photoUrl:
        req.body.photoUrl ||
        "https://via.placeholder.com/150"
    });

    newUser.setPassword(req.body.password);

    const savedUser = await newUser.save();

    console.log("USER CREATED:", savedUser.email);

    return res.status(201).json({
      success: true,
      user: savedUser
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==================== LOGIN ====================

const loginUser = async (req, res, next) => {
  try {

    console.log("\n================ LOGIN ================");
    console.log("LOGIN EMAIL:", req.body.email);

    // MongoDB connection information
    console.log(
      "MONGO DB NAME:",
      mongoose.connection.name
    );

    console.log(
      "MONGO HOST:",
      mongoose.connection.host
    );

    console.log(
      "MONGO READY STATE:",
      mongoose.connection.readyState
    );

    // Check collection
    console.log(
      "USER COLLECTION:",
      User.collection.name
    );

    // Show all users visible to Node
    const allUsers = await User.find({}).lean();

    console.log(
      "ALL USERS SEEN BY NODE:",
      allUsers.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }))
    );

    // Find requested user
    const user = await User.findOne({
      email: req.body.email
    });

    console.log("LOGIN USER:", user);

    // User not found
    if (!user) {

      console.log(
        "USER NOT FOUND:",
        req.body.email
      );

      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check password
    let validPassword = false;

    try {

      validPassword = user.isValidPassword(
        req.body.password
      );

    } catch (error) {

      console.error(
        "PASSWORD VALIDATION ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Password validation failed"
      });
    }

    // Wrong password
    if (!validPassword) {

      console.log("PASSWORD INCORRECT");

      return res.status(401).json({
        success: false,
        message: "Password incorrect"
      });
    }

    console.log("PASSWORD CORRECT");


    // Passport authentication
    passport.authenticate(
      "local",
      (err, authenticatedUser, info) => {

        if (err) {

          console.error(
            "PASSPORT ERROR:",
            err
          );

          return res.status(500).json({
            success: false,
            message:
              err.message ||
              "Passport authentication error"
          });
        }


        if (!authenticatedUser) {

          console.error(
            "PASSPORT USER ERROR:",
            info
          );

          return res.status(401).json({
            success: false,
            message:
              info?.message ||
              "Passport authentication failed"
          });
        }


        // Create login session
        req.logIn(
          authenticatedUser,
          (err) => {

            if (err) {

              console.error(
                "SESSION LOGIN ERROR:",
                err
              );

              return res.status(500).json({
                success: false,
                message: err.message
              });
            }


            console.log(
              "LOGIN SUCCESS:",
              authenticatedUser.email
            );

            console.log(
              "IS ADMIN:",
              authenticatedUser.isAdmin
            );


            return res.status(200).json({
              success: true,
              user: authenticatedUser
            });

          }
        );

      }
    )(req, res, next);

  } catch (error) {

    console.error(
      "LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// ==================== LOGOUT ====================

const logoutUser = async (req, res, next) => {

  req.logout((err) => {

    if (err) {

      console.error(
        "LOGOUT ERROR:",
        err
      );

      return next(err);
    }


    return res.status(200).json({
      success: true,
      message: "User logged out"
    });

  });
};


// ==================== EXPORT ====================

module.exports = {
  registerUser,
  loginUser,
  logoutUser
};