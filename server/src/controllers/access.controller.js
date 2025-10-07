"use strict";

import AccessService from "../services/access.service.js";
import { OK, CREATED, SuccessResponse } from "../cores/success.response.js";
import { getOperationMobile } from "../lib/getOperationMobile.js";

class AccessController {
  handleRefreshToken = async (req, res, next) => {
    // V1
    // new SuccessResponse({
    // 	message: 'Get token successfully!',
    // 	metadata: await AccessService.handleRefreshToken(req.body.refreshToken),
    // }).send(res);

    // V2 fixed, no need accessToken
    new SuccessResponse({
      message: "Get token successfully!",
      metadata: await AccessService.handleRefreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };

  logout = async (req, res, next) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV != "dev",
    });
    // new SuccessResponse({
    //   message: "logout success",
    //   metadata: await AccessService.logout({ keyStore: req.keyStore }),
    // }).send(res);
    return res.status(200).json({
      code: 200,
      message: "Logout successful",
      // metadata: await AccessService.logoutV2({
      // userId: req.user.userId,
      // keyStore: req.keyStore,
      // })
    });
  };

  login = async (req, res, next) => {
    const operation = req.headers["user-agent"];

    const operationRes = getOperationMobile(operation);

    const data = await AccessService.login({
      ...req.body,
      operationAgent: operationRes,
    });

    console.log("data login:", data);

    res.cookie("accessToken", data.tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV != "dev",
      sameSite: process.env.NODE_ENV != "dev" ? "none" : "strict",
      domain:
        process.env.NODE_ENV != "dev" ? ".aptisacademy.com.vn" : "localhost",
      maxAge: 7 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      code: 200,
      message: "Login successful",
      metadata: data,
    });
  };

  signUp = async (req, res, next) => {
    console.log(`Accessing`, req.body);
    // return res.status(200).json(await AccessService.signUp(req.body));

    new CREATED({
      message: "success",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
}

export default new AccessController();
