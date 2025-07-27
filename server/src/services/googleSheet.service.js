
import { SHEETS_CONFIG } from "../configs/sheets.config.js";
import * as jose from "jose";


async function getAccessToken() {
  try {
    const key = SHEETS_CONFIG.private_key;
    const email = SHEETS_CONFIG.client_email;

    if (!key || !email) {
      throw new Error("Missing required Google Sheets credentials");
    }

    const privateKey = await jose.importPKCS8(key, "RS256");

    const jwt = await new jose.SignJWT({
      scope: "https://www.googleapis.com/auth/spreadsheets",
    })
      .setProtectedHeader({ alg: "RS256", typ: "JWT" })
      .setIssuedAt()
      .setIssuer(email)
      .setAudience("https://oauth2.googleapis.com/token")
      .setExpirationTime("1h")
      .sign(privateKey);

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Failed to get access token: ${error.error_description || response.statusText}`
      );
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw new Error(`Failed to get access token: ${error}`);
  }
}


class GoogleSheetFactory {
  static createProcessLearn = async (data) => {
    try {
      const spreadsheetId = "1IP77gradUpCRIEC1jKDdFFyMWiM9xk9oKetB3A2Ah5U";
    if (!spreadsheetId) {
      throw new Error("Google Sheet ID is not configured");
    }

    // const range = "Sheet1!B2:M";
    const accessToken = await getAccessToken();

    console.log({ accessToken });
    const MAX_CHAR_LIMIT = 50000;

    const values = data.map((item) => [
      item.title,
      item.questionTitle,
      item.content,
      item.file,
      item.suggestion,
      item.answerList_1,
      item.answerList_2,
      item.answerList_3,
      item.results,
    ]);

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values,
        }),
      }
    );

    const datas = await response.json();

    console.log({ datas });

    if (!response.ok) {
      throw new Error(
        data.error?.message ||
          `Failed to append data to sheet: ${response.statusText}`
      );
    }

    return {
      message: "Data successfully added to Google Sheet",
      data: data,
    };
    } catch (error) {
      console.log("error: là: ", error);
      return error;
    }
  };

}

export default GoogleSheetFactory;