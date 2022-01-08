import config from "../config/index.js";
import User from "../resources/user/user.model.js";
import jwt from "jsonwebtoken";

export const newToken = (user) => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp,
  });
};

export const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });

export const signup = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: "Email and Password are required" });
  }

  try {
    const user = await User.create(req.body);
    const token = newToken(user);
    return res
      .status(201)
      .send({ email: user._doc.email, access_token: token });
  } catch (e) {
    console.log(e);
    return res.status(500).end();
  }
};

export const signin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: "Email and Password are required" });
  }

  const invalid = { message: "Sorry invalid credentials" };

  try {
    const user = await User.findOne({ email: req.body.email })
      .select("email password")
      .exec();

    if (!user) {
      return res.status(401).send(invalid);
    }

    const match = await user.checkPassword(req.body.password);

    if (!match) {
      return res.status(401).send(invalid);
    }

    const token = newToken(user);
    return res.status(201).send({ token });
  } catch (e) {
    res.status(500).end();
  }
};
