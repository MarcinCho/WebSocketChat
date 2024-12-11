import { Context } from "@oak/oak";
import * as bcrypt from "@da/bcrypt";
import { LoginForm, RegisterForm } from "../Models/Forms.ts";
import db from "../Database/dbConnection.ts";
import { grantPaseto } from "../AuthUtils/pasetoGrant.ts";
import user from "../Models/User.ts";
import { grantJWT } from "../AuthUtils/jwtGrant.ts";

// https://jsr.io/@da/bcrypt

const userColl = db.collection<user>("users");

export const register = async (ctx: Context) => {
  const newUser = (await ctx.request.body.json()) as RegisterForm;
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(newUser.password, salt);

  if (
    !(await userColl.findOne({
      username: newUser.username,
    }))
  ) {
    console.log("Creating new user");
    const user_id = await userColl.insertOne({
      username: newUser.username,
      email: newUser.email,
      password: passwordHash,
    } as user);
    ctx.response.body = {
      "oh it works": true,
    };
    ctx.response.status = 200;
    console.log("Created new user with id:" + user_id.insertedId);
  } else {
    ctx.response.body = {
      "oh it works": false,
    };
    ctx.response.status = 400;
  }
};

export const login = async (ctx: Context) => {
  const loginUser = (await ctx.request.body.json()) as LoginForm;

  const user = (await userColl.findOne({
    username: loginUser.username,
  })) as user;

  if (!user) {
    ctx.response.body = {
      message: "User not found",
    };
    ctx.response.status = 400;
    return;
  }
  const checkPass = await bcrypt.compare(loginUser.password, user.password);

  if (checkPass) {
    const token = await grantPaseto(user);
    const jwt = await grantJWT(user);
    ctx.response.body = {
      message: "Login successful",
      token: token,
      jwt: jwt,
    };
    ctx.response.status = 200;
  } else {
    ctx.response.body = {
      message: "Login failed",
    };
    ctx.response.status = 400;
  }
};

export const check = (ctx: Context) => {
  ctx.response.body = {
    message: "The token is authenticated",
  };
  ctx.response.status = 200;
};

// export const edit = async (ctx: Context) => {};

// export const getOne = async (ctx: Context) => {};

// export const getList = async (ctx: Context) => {};

// export const deleteOne = async (ctx: Context) => {};

// export const logout = async (ctx: Context) => {};
