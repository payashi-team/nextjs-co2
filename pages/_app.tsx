import "../styles/globals.css";
import type { AppProps } from "next/app";
import { LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import jaLocale from "date-fns/locale/ja";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={jaLocale}>
      <Component {...pageProps} />
    </LocalizationProvider>
  );
}

export default MyApp;
