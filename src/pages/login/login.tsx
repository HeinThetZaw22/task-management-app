import { useEffect, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Lottie from "lottie-react";
import GoogleIcon from "@/assets/icons/google.svg";
import loginAnimation from "@/assets/animations/login.json";
import {
  Button,
  Typography,
  useTheme,
  Box,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    const accessToken = localStorage.getItem("googleAccessToken");
    if (accessToken) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const login = useGoogleLogin({
    flow: "implicit",
    scope:
      "https://www.googleapis.com/auth/tasks https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
    prompt: "select_account",
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      const accessToken = tokenResponse.access_token;
      localStorage.setItem("googleAccessToken", accessToken);

      try {
        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        localStorage.setItem("userInfo", JSON.stringify(res.data));
        navigate("/");
      } catch (err) {
        console.error("Failed to fetch user info", err);
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.log("Login Failed:", error);
      setLoading(false);
    },
  });

  return (
    <Box
      className="min-h-screen px-4"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bgcolor={theme.palette.background.default}
      color={theme.palette.text.primary}
    >
      <Lottie animationData={loginAnimation} loop className="w-64 h-64 mb-6" />

      <Typography variant="h5" fontWeight={600} gutterBottom>
        Welcome Back!
      </Typography>

      <Button
        onClick={() => login()}
        variant="outlined"
        startIcon={
          loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <img
              src={GoogleIcon}
              alt="google"
              style={{ width: 24, height: 24 }}
            />
          )
        }
        sx={{
          mt: 2,
          px: 6,
          py: 1,
          borderColor: theme.palette.divider,
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#fff",
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "dark" ? "#333" : theme.palette.grey[100],
          },
        }}
      >
        {t("login")}
      </Button>

      <Typography variant="body2" sx={{ mt: 3 }}>
        {t("no-account")}
        <Link
          to="/register"
          style={{
            color: theme.palette.primary.main,
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          {t("sign-in")}
        </Link>
      </Typography>
    </Box>
  );
};

export default LoginPage;
