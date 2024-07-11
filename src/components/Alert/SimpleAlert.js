import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useEffect } from "react";

export default function SimpleAlert({ open, duration, close, type, message }) {

  useEffect(() => {
    const timer = setTimeout(() => {
      close();
    }, duration);

    return () => clearTimeout(timer);
  }, [close, duration, message]);

  return (
    <>
      {open ? (
        <Stack sx={{ width: "50%" }} spacing={2}>
          <Alert
            severity={type}
            action={
              <Button color="inherit" size="small">
                closes in {Math.round(duration / 1000)} sec
              </Button>
            }
          >
            {message}
          </Alert>
        </Stack>
      ) : null}
    </>
  );
}
