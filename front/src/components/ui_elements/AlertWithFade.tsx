import { Alert } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/Error";

const AlertWithFade = ({
  message,
  showAlert,
  severity,
}: {
  message: string;
  showAlert: boolean;
  severity: "success" | "error";
}) => {
  return (
    <div
      className={`fixed bottom-5 right-10 transition-all duration-500 ease-in-out ${
        showAlert ? "opacity-100" : "opacity-0"
      }`}
      style={{ zIndex: 1000 }}
    >
      <Alert
        icon={
          severity === "success" ? (
            <CheckIcon fontSize="inherit" />
          ) : (
            <ErrorIcon fontSize="inherit" />
          )
        }
        severity={severity}
      >
        {message}
      </Alert>
    </div>
  );
};

export default AlertWithFade;
