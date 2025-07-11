import { useState } from "react";

import authProvider from "../../providers/authProvider";
// import { ChallengeNameType } from '@aws-sdk/client-cognito-identity-provider';
import LockIcon from "@mui/icons-material/Lock";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Form,
  required,
  TextInput,
  useNotify,
  useTranslate,
} from "react-admin";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const translate = useTranslate();
  const notify = useNotify();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [mfaDialog, setMfaDialog] = useState(false);
  const [newPasswordDialog, setNewPasswordDialog] = useState(false);
  const [qrCodeDialog, setQrCodeDialog] = useState(false);

  const [newPassword, setNewPassword] = useState<string>("");
  const [newConfirmPassword, setNewConfirmPassword] = useState<string>("");

  const [username, setUsername] = useState<string>("");
  const [challengeNameType, setChallengeNameType] = useState<string>("");
  const [mfaCode, setMfaCode] = useState<string>("");
  const [session, setSession] = useState<string>("");
  const [qrCodeBase64, setQrCodeBase64] = useState<string>("");



  const handleSubmit = async (auth: FormValues) => {
    setLoading(true);
    setUsername(auth.username ?? "");

    try {
      const res = await authProvider.login(auth);

      console.log("Login response:", res);

      navigate("/");
    } catch {
      notify("メールアドレスまたはパスワードが間違っている可能性があります。", {
        type: "warning",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewPasswordSubmit = async () => {
    if (newPassword !== newConfirmPassword) {
      notify("パスワードが一致しません。もう一度お試しください。", {
        type: "warning",
      });
      return;
    }

    try {
      await authProvider.changePassword({
        username,
        newPassword,
        session,
      });

      notify("パスワードが正常に変更されました", { type: "success" });
      window.location.reload();
    } catch (error) {
      notify("パスワードの変更に失敗しました。もう一度お試しください。", {
        type: "warning",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={qrCodeDialog}
        aria-labelledby="qr-code-dialog-title"
        aria-describedby="qr-code-dialog-description"
      >
        <DialogTitle id="qr-code-dialog-title">MFA認証を設定する</DialogTitle>
        <DialogContent>
          <DialogContentText id="qr-code-dialog-description">
            Google
            Authenticatorなどの認証アプリでQRコードをスキャンしてください。
          </DialogContentText>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img
              src={qrCodeBase64}
              alt="QR Code"
              style={{
                width: "50%",
                margin: "0 auto",
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => {
              setMfaDialog(true);
              // setQrCodeDialog(false);
            }}
            color="success"
          >
            私は終わった
          </Button>
          <Button
            variant="outlined"
            onClick={() => setQrCodeDialog(false)}
            color="primary"
          >
            キャンセル
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={mfaDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {" MFA authentication"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            アカウントには MFA 認証が必要です。 <br></br>{" "}
            コードを入力してください:
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="text"
            label="MFA code"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => {
              setMfaCode(e.target.value);
            }}
          />
        </DialogContent>

      </Dialog>

      <Dialog
        open={newPasswordDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          パスワードの変更が必要です
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            アカウントには新しいパスワードが必要です。 <br></br>
            新しいパスワードを入力してください:
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="password"
            label="New password"
            type="password"
            fullWidth
            variant="standard"
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
          />
          <TextField
            required
            margin="dense"
            id="confirm-password"
            name="confirm-password"
            label="Confirm new password"
            type="password"
            fullWidth
            variant="standard"
            onChange={(e) => {
              setNewConfirmPassword(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleNewPasswordSubmit}
            autoFocus
            variant="outlined"
            color="success"
          >
            送信
          </Button>
          <Button
            onClick={() => {
              setNewPasswordDialog(false);
            }}
            autoFocus
            variant="outlined"
            color="error"
          >
            キャンセル
          </Button>
        </DialogActions>
      </Dialog>

      <Form onSubmit={handleSubmit} noValidate>
        
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            alignItems: "center",
            justifyContent: "flex-start",
            background: "#345357ed",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <Card sx={{ minWidth: 300, marginTop: "6em" }}>
            <Box
              sx={{
                margin: "1em",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Avatar sx={{ bgcolor: "secondary.main" }}>
                <LockIcon />
              </Avatar>

            </Box>

            <Box
              sx={{
                marginTop: "1em",
                display: "flex",
                justifyContent: "center",
                color: (theme) => theme.palette.grey[500],
              }}
            ></Box>
            <Box sx={{ padding: "0 1em 1em 1em" }}>
              <Box sx={{ marginTop: "1em" }}>
                <TextInput
                  autoFocus
                  source="username"
                  label="email"
                  disabled={loading}
                  validate={required()}
                  fullWidth
                />
              </Box>
              <Box sx={{ marginTop: "1em" }}>
                <TextInput
                  source="password"
                  label={translate("ra.auth.password")}
                  type="password"
                  disabled={loading}
                  validate={required()}
                  fullWidth
                />
              </Box>
            </Box>
            <CardActions sx={{ padding: "0 1em 1em 1em" }}>
              <Button
                variant="contained"
                type="submit"
                color="primary"
                disabled={loading}
                fullWidth
              >
                {loading && <CircularProgress size={25} thickness={2} />}
                {translate("ra.auth.sign_in")}
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Form>
    </>
  );
};

export default Login;

interface FormValues {
  username?: string;
  password?: string;
}
