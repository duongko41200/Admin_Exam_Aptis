// utils/getOperationMobile.ts

import { UAParser } from "ua-parser-js";

export function getOperationMobile(userAgent) {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  const operation = {
    ua: userAgent,
    browser: {
      name: result.browser.name,
      version: result.browser.version,
      major: result.browser.major,
    },
    cpu: {
      architecture: result.cpu.architecture,
    },
    device: result.device || {},
    engine: {
      name: result.engine.name,
      version: result.engine.version,
    },
    os: {
      name: result.os.name,
      version: result.os.version,
    },
  };

  console.log("Operation Mobile:", operation);

  return operation;
}
