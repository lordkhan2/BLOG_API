const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//REGISTER
const createUser = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

//STORE refreshtokens
let refreshTokens = [];

//REFRESH TOKEN
const refreshToken = (req, res) => {
  //take the refresh token from the user
  const refreshToken = req.body.token;

  //send error if there is no token or it's invalid
  if (!refreshToken) return res.status(401).json("You are not authenticated!");
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("Refresh token is not valid!");
  }
  jwt.verify(refreshToken, "myRefreshSecretKey", (err, user) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    refreshTokens.push(newRefreshToken);

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });
};

//GEN ACCESS TOKEN
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, "mySecretKey", {
    expiresIn: "10000s",
  });
};

//GEN REFRESH TOKEN
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, "myRefreshSecretKey");
};

//LOGIN
const userLogin = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(400).json("Wrong credentials!");

    const validated = await bcrypt.compare(req.body.password, user.password);
    !validated && res.status(400).json("Wrong credentials!");

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    refreshTokens.push(refreshToken);

    res.status(200).json({
      username: user.username,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { createUser, userLogin, refreshToken };
