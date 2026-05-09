import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-geist-sans), sans-serif',
  },
  palette: {
    primary: {
      main: '#2563EB', // blue-600 to match existing design
    },
    background: {
      default: '#F8F9FA', // from globals.css
    },
    text: {
      primary: '#1A1A1A',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '16px',
          fontWeight: 'bold',
        },
      },
    },
  },
});

export default theme;
