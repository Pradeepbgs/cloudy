import { client } from "../db/postgresDB.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const generateAccessToken = async (user) => {
  try {
    const accessToken = jwt.sign(
      { id: user?.id, email: user?.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    if (!accessToken) {
      res
        .status(400)
        .json({ msg: "problem while generating access token secret" });
    }

    return accessToken;
  } catch (err) {
    console.error("Failed to generate access token:", err);
    res.status(400).json({ msg: "Failed to generate access token" });
  }
};

async function registerUser(req, res) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    console.log("Username, email, and password are required");
    return res
      .status(400)
      .json({ error: "Username, email, and password are required" });
  }

  const existingUser = await client.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (existingUser.rows.length > 0) {
    console.log("User already exists, try another email");
    return res
      .status(400)
      .json({ error: "User already exists, try another email" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const query =
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at";

    const values = [username, email, hashedPassword];

    const result = await client.query(query, values);

    return res
      .status(201)
      .json({ msg: "user created successfully", user: result.rows[0] });
  } catch (err) {
    console.error("Failed to register user:", err);
    return res.status(500).json({ error: "Failed to register user" });
  }
}

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.log("email or password is required");
    return res.status(400).json({ msg: "email or password is required" });
  }

  try {
    const result = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const user = result.rows[0];

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ msg: "invalid password" });
    }

    const accessToken = await generateAccessToken(user);

    const options = {
      httpOnly: true,
      secure: true,
    };

    const fullUser = {
      id: user.id,
      username: user.email,
      email: user.email,
    };
    return res
      .cookie("accessToken", accessToken, options)
      .status(200)
      .json({ msg: "login sucessfull", user: fullUser });
  } catch (error) {
    return res.status(400).json({ msg: "Failed to login user" });
  }
};

const logout = async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
  };

  try {
    return res
      .clearCookie("accessToken", options)
      .status(200)
      .json({ msg: "SuccessFully logged out" });
  } catch (error) {
    return res.status(400).json({ msg: "problem while logging out user" });
  }
};

const getFileOfUser = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(400).json({ msg: "user not found or Unauthorized" });
  }

  const file = await client.query("SELECT * FROM file WHERE user_id = $1", [
    user.id,
  ]);

  if (!file || file.length < 0) {
    return res.status(400).json({ msg: "No file found" });
  }

  return res.status(200).json({ msg: "File found", files: file.rows });
};

export { registerUser, loginUser, logout, getFileOfUser };
