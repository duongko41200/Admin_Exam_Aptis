"use strict";

import baseRepo from "./base-repo/baseRepo.js";
import userModel from "../models/user.model.js";
import { BadRequestError } from "../cores/Error.response.js";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { createTokenPair } from "../auth/authUtils.js";
import { getIntoData } from "../utils/index.js";
import keyTokenService from "./keyToken.service.js";

export const findByEmail = async ({
  email,
  select = {
    email: 1,
    password: 2,
    name: 1,
    classRoomId: 1,
    phone: 1,
    createdAt: 1,
    status: 1,
    role: 1,
  },
}) => {
  const res = await userModel
    .findOne({ email })
    .select(select)
    .populate({
      path: "classRoomId",
      select: "_id nameRoom",
    })
    .lean();

  return res;
};

export const findAll = async () => {
  return await userModel.find({}).lean();
};

export const getAllWithQuery = async ({ filter, range, sort }) => {
  return await baseRepo.getAllWithQuery({ filter, range, sort }, userModel);
};

export const getOneById = async (id) => {
  try {
    const res = await userModel.findOne({ _id: id }).lean();
    console.log({ res });

    return res;
  } catch (error) {
    console.log("lỗi rồi:", error);

    return [];
  }
};

export const deleteById = async (id) => {
  return await userModel.deleteOne({ _id: id }).lean();
};

export const create = async (data) => {
  try {
    console.log("data: ", data);

    const { email, password } = data;

    const holeUser = await userModel.find({ email }).lean();
    if (holeUser.length > 0) {
      throw new BadRequestError("Error: user already registered");
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({ ...data, password: passwordHash });

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
  } catch (error) {
    console.log("error: là: ", error);
    return error;
  }
};

export const updateOneById = async (id, data) => {
  try {
    const user = await userModel.findById(id).lean();
    if (!user) {
      throw new BadRequestError("User not found");
    }
    const updatedData = { ...data };
    if (data.newPassword) {
      updatedData.password = await bcrypt.hash(data.newPassword, 10);
    }
    const updatedUser = await userModel
      .findByIdAndUpdate(id, updatedData, { new: true })
      .lean();
    return getIntoData({
      fileds: ["_id", "name", "email", "classRoomId", "status", "roles"],
      object: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    throw new BadRequestError("Error updating user");
  }
};
