import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@fontsource/poppins";
import RootPage from "./routes/RootPage";
import ErrorPage from "./routes/ErrorPage";
import RootLayout from "./routes/RootLayout";
import EditorPage from "./routes/EditorPage";
import DesignerPage from "./routes/DesignerPage";
import TeamsPage from "./routes/TeamsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <RootPage />,
      },
      {
        path: "designer",
        element: <DesignerPage />,
      },
      {
        path: "editor",
        element: <EditorPage />,
      },
      {
        path: "teams",
        element: <TeamsPage />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
