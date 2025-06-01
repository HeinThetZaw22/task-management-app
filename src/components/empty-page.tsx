import Lottie from "lottie-react";
import { Box, Typography, useTheme } from "@mui/material";

import emptyAnimation from "@/assets/animations/empty.json";

const EmptyPage = () => {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      minHeight="50vh"
      px={2}
      color={theme.palette.text.primary}
    >
      <Lottie animationData={emptyAnimation} loop className="w-64 h-64 mb-6" />

      <Typography variant="h6" fontWeight={500} gutterBottom>
        No tasks yet
      </Typography>

      <Typography variant="body2" color="text.secondary">
        Add your to-dos and keep track of them across Google Workspace
      </Typography>
    </Box>
  );
};

export default EmptyPage;
