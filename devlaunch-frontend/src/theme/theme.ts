import { createTheme } from "@mui/material/styles";

// NOTE: MUI runs color math (alpha/contrast) on palette colors, so palette
// values MUST be real parseable colors — never CSS variables. Dark mode is
// driven by the CSS variables in globals.css, applied here through component
// styleOverrides (and per-component `sx`), not through the palette.
const theme = createTheme({
  typography: {
    fontFamily: "var(--font-geist-sans), system-ui, -apple-system, sans-serif",
  },
  palette: {
    primary: { main: "#185FA5" },
    error: { main: "#ef4444" },
    success: { main: "#16a34a" },
    warning: { main: "#d97706" },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "10px",
          fontWeight: 600,
        },
      },
    },
    // Form inputs follow dark mode via CSS variables
    MuiInputBase: {
      styleOverrides: {
        root: { color: "var(--text-primary)" },
        input: {
          "&::placeholder": { color: "var(--text-muted)", opacity: 1 },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--bg-primary)",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--border)" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "var(--text-muted)" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "var(--blue)" },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "var(--text-muted)",
          "&.Mui-focused": { color: "var(--blue)" },
        },
      },
    },
    // Select / dropdown menus follow dark mode
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "var(--bg-primary)",
          color: "var(--text-primary)",
          border: "1px solid var(--border)",
          backgroundImage: "none",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: "var(--text-primary)",
          "&:hover": { backgroundColor: "var(--bg-tertiary)" },
        },
      },
    },
    MuiSelect: {
      styleOverrides: { icon: { color: "var(--text-muted)" } },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: "var(--border)", color: "var(--text-primary)" },
        head: { color: "var(--text-muted)" },
      },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: "var(--border)" } },
    },
  },
});

export default theme;
