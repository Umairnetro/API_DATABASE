const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const joi = require("joi");

const userValidationSchema = joi.object({
  username: joi.string().min(3).max(30).required(),
  password: joi.string().min(6).required(),
});

// Register
const register = async (req, res) => {
  const { username, password } = req.body;

  const { error } = userValiedationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = new User({
      id: uuidv4(),
      username,
      password,
    });

    newUser.save();

    res.staus(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(400).send(error);
  }
};

// Login
const login = async () => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) return res.status(400).json({ error: "Invalid Credentials." });

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { register, login };
