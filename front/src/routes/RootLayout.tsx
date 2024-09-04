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
          "& .MuiInputBase-input::placeholder": {
            color: "#A0A0A0", // Set placeholder color here
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#A0A0A0", // Set label color here (used as placeholder when not focused)
          "&.Mui-focused": {
            color: "#A0A0A0", // Keep the label placeholder color even when focused
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          "&.Mui-disabled": {
            color: "#A0A0A0", // Color for disabled selected item when displayed
          },
          "&[aria-expanded='false']": {
            color: "#A0A0A0", // Ensure the placeholder has the desired color when the dropdown is closed
          },
          "&.Mui-focused": {
            color: "#A0A0A0", // Keep color consistent when focused
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            color: "#A0A0A0", // Color for disabled MenuItem in the dropdown
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
