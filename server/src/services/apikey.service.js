"use strict";

const apikeyModel = require("../models/apikey.model");
const crypto = require("node:crypto");

const findbyId = async (key) => {
  const findApiKey = await apikeyModel.find({}).lean();

  if (findApiKey.length === 0) {
    await apikeyModel.create({
      key: "72f911ffb218d524a9037afa6bfae1f734760ea1d30addfbe3ed83c18df50f75908b457a509044fadd1bda8c2cb97f89e98f7aa397f4594bc4d8d3d803e5ba61",
      permissions: ["000"],
    });
  }

  const objKey = await apikeyModel.findOne({ key, status: true }).lean();

  return objKey;
};

module.exports = {
  findbyId,
};
