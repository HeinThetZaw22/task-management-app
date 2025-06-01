"use client";

import { Box, useTheme } from "@mui/material";
import { PuffLoader } from "react-spinners";

const Loader = () => {
  const theme = useTheme();

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <PuffLoader size={100} color={theme.palette.primary.main} />
    </Box>
  );
};

export default Loader;
