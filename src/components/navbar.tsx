import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  Box,
  Button,
  Divider,
  Avatar,
  Switch,
  Paper,
  RadioGroup,
  Radio,
  FormControlLabel,
  useTheme,
} from "@mui/material";
import { useThemeMode } from "@/theme/theme-provider";
import { MenuIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState<{
    name?: string;
    email?: string;
    picture?: string;
  } | null>(null);
  const { mode, toggleMode } = useThemeMode();
  const { i18n, t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  useEffect(() => {
    const userData = localStorage.getItem("userInfo");
    setUser(userData ? JSON.parse(userData) : null);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("googleAccessToken");
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{ backgroundColor: "background.paper", color: "text.primary" }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton
            onClick={() => setDrawerOpen(true)}
            edge="start"
            color="inherit"
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" fontWeight={500}>
            {t("taskManager")}
          </Typography>

          <Box width={40} />
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          width={260}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          height="100%"
          p={2}
        >
          {/* Top Content */}
          <Box>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mb={2}
            >
              {user?.picture && (
                <Avatar
                  alt={user?.name}
                  src={user?.picture}
                  sx={{ width: 80, height: 80, mb: 1 }}
                />
              )}
              <Typography variant="subtitle1">{user?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Dark Mode Toggle */}
            <Paper
              elevation={2}
              sx={{
                p: 2,
                mb: 2,
                backgroundColor: "background.paper",
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography>Dark Mode</Typography>
                <Switch checked={mode === "dark"} onChange={toggleMode} />
              </Box>
            </Paper>

            {/* Language Selector */}
            <Paper
              elevation={0}
              variant="outlined"
              sx={{
                p: 2,
                mb: 2,
                backgroundColor: isDark ? "#1e1e1e" : "#fff",
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {t("language")}
              </Typography>
              <RadioGroup
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
              >
                <FormControlLabel
                  value="en"
                  control={<Radio />}
                  label="English"
                />
                <FormControlLabel
                  value="my"
                  control={<Radio />}
                  label="မြန်မာ"
                />
              </RadioGroup>
            </Paper>
          </Box>

          {/* Bottom Logout Button */}
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={handleLogout}
          >
            {t("logout")}
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
