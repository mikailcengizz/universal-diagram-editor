import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#000000", // Set the focused border color to black
          },
        },
      },
    },
  },
});

const RootLayout = () => {
  return (
    <ThemeProvider theme={theme}>
      <div className="flex bg-[#1B1B20]">
        <Sidebar />
        <div className="min-h-screen max-h-screen w-full h-full">
          <Outlet />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default RootLayout;
