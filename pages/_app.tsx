import "../styles/globals.css";
import type { AppProps } from "next/app";
import { LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import jaLocale from "date-fns/locale/ja";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Avatar from "@mui/material/Avatar";
import { grey, green } from "@mui/material/colors";
import Image from "next/image";
import { Container, createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  palette: {
    secondary: green,
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={jaLocale}>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            width: "100vw",
            height: "100vh",
            py: 2,
            backgroundColor: grey[50],
          }}
        >
          <Container maxWidth="lg">
            <Component {...pageProps} />
            <Fab
              color="secondary"
              sx={{
                position: "fixed",
                bottom: "30px",
                right: "30px",
              }}
            >
              <a
                href="https://line.me/R/ti/p/%40444rlonw"
                target="_blank"
                rel="noreferrer"
              >
                <Avatar alt="USAOMOCHI">
                  <Image
                    src="/images/usamo.png"
                    width={64}
                    height={64}
                    alt="usamo profile"
                  />
                </Avatar>
              </a>
            </Fab>
          </Container>
        </Box>
      </ThemeProvider>
    </LocalizationProvider>
  );
}

export default MyApp;
