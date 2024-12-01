import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { createTheme, ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import store from "../redux/store";

const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#000000",
          },
          "& .MuiInputBase-input::placeholder": {
            color: "#A0A0A0",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#A0A0A0",
          "&.Mui-focused": {
            color: "#A0A0A0",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          "&.Mui-disabled": {
            color: "#A0A0A0",
          },
          "&[aria-expanded='false']": {
            color: "#A0A0A0",
          },
          "&.Mui-focused": {
            color: "#A0A0A0",
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            color: "#A0A0A0",
          },
        },
      },
    },
  },
});

const RootLayout = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <div className="flex bg-[#1B1B20]">
          <Sidebar />
          <div className="min-h-screen max-h-screen w-full h-full">
            <Outlet />
          </div>
        </div>
      </ThemeProvider>
    </Provider>
  );
};

export default RootLayout;
