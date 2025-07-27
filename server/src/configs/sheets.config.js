import {key} from '../data/key-google-sheet.js'

export const SHEETS_CONFIG = {
  type: "service_account",
  project_id: key.project_id,
  private_key_id: key.private_key_id,
  private_key: key.private_key?.replace(/\\n/g, "\n"),
  client_email: key.client_email,
  client_id: key.client_id,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/googlesheetreader%40elevated-summer-444708-k1.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};
