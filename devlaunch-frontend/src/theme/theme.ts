import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-geist-sans), sans-serif",
  },
  palette: {
    primary: {
      main: "#2563EB",
    },
    background: {
      default: "var(--bg-secondary)",
      paper: "var(--bg-primary)",
    },
    text: {
      primary: "var(--text-primary)",
      secondary: "var(--text-secondary)",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "16px",
          fontWeight: "bold",
        },
      },
    },
  },
});

export default theme;
