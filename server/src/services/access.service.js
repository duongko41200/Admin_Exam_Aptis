"use strict";
import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import keyTokenService from "./keyToken.service.js";
import { createTokenPair, verifyJWT } from "../auth/authUtils.js";
import { getIntoData } from "../utils/index.js";
import {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} from "../cores/Error.response.js";
import { findByEmail, findAll } from "./user.service.js";
import keytokenModel from "../models/keytoken.model.js";
import { SESSION_TOKEN_SECRET } from "../const/key.js";

const RoleApp = {
  USER: "USER",
  OWNER: "OWNER",
  ADMIN: "ADMIN",
};

class AccessService {
  /**
   *
   * check this token used
   */

  static handleRefreshToken = async (refreshToken) => {
    const foundToken = await keyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    if (foundToken) {
      // decode xem là ai

      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );

      console.log({ userId, email });
      await keyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("something warm heppend !! pls relogin");
    }

    const holderToken = await keyTokenService.findByRefreshToken(refreshToken);

    console.log({ holderToken });
    if (!holderToken) throw new AuthFailureError("User not registerted");

    //verify Token
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );

    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("User not registerted");

    //create 1 cap moi
    const tokens = await createTokenPair(
      {
        userId,
        email,
      },
      holderToken.publicKey,
      holderToken.privateKey
    );

    console.log({ tokens });

    //update token

    await keytokenModel.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    return {
      user: { userId, email },
      tokens,
    };
  };

  /**
   *
   * check this token used
   */

  static handleRefreshTokenV2 = async ({ keyStore, user, refreshToken }) => {
    const { userId, email } = user;

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await keyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something wrong happend!! Pls relogin");
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError("User not registered");
    }

    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("User not registerted");

    //create 1 cap moi
    const tokens = await createTokenPair(
      {
        userId,
        email,
      },
      keyStore.publicKey,
      keyStore.privateKey
    );

    console.log({ tokens });

    //update token

    await keytokenModel.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    return {
      user,
      tokens,
    };
  };

  static logout = async ({ keyStore }) => {
    console.log({ keyStore });
    const delKey = await keyTokenService.removeKeyId(keyStore._id);
    console.log({ delKey });
    return delKey;
  };

  // 1-check email in dbs
  // 2 - match pass
  // 3 - create AT vs RT and save
  // 4 - generate tokens
  // 5- get data return login

  static login = async ({ email, password, refreshToken = null }) => {
    //1
    const foundShop = await findByEmail({ email });

    if (!foundShop) throw new BadRequestError("shop not registered");

    //2
    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Authentication failed");

    //3
    //create pivateKey, publicKey
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = SESSION_TOKEN_SECRET;

    //4
    const tokens = await createTokenPair(
      {
        userId: foundShop._id,
        email,
      },
      publicKey,
      privateKey
    );

    console.log({ tokens });

    await keyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId: foundShop._id,
    });

    const user = {
      user: getIntoData({
        fileds: ["_id", "name", "email", "classRoomId", "phone", "createdAt"],
        object: foundShop,
      }),
      tokens,
    };

    return user;
  };

  static signUp = async ({ name, email, password, idTelegram }) => {
    //step1: CHECK EMAIL EXIST?
    const holeUser = await userModel.find({ email }).lean();
    // console.log({ holeUser });
    if (holeUser.length > 0) {
      throw new BadRequestError("Error: user already registered");
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleApp.USER],
      idTelegram,
      // idTelegram:localStorage.getItem('idTelegram')
    });

    if (newUser) {
      //create pivateKey, publicKey
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      console.log({ privateKey, publicKey }); //save collection KeyStore

      //save collection KeyStore
      const KeyStore = await keyTokenService.createKeyToken({
        userId: newUser._id,
        publicKey,
        privateKey,
      });

      if (!KeyStore) {
        return {
          code: "xxx",
          message: error.message,
          status: "error",
        };
      }

      // create token pair
      const tokens = await createTokenPair(
        {
          userId: newUser._id,
          email,
        },
        publicKey,
        privateKey
      );

      return {
        user: getIntoData({
          fileds: ["_id", "name", "email"],
          object: newUser,
        }),
        tokens,
      };
    }
  };
}

export default AccessService;
