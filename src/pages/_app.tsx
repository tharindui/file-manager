import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { FileProvider } from "../services/fileService";
import { AccountProvider } from "../services/accountService";
export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  const defaultTheme = createTheme();
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <AccountProvider>
          <FileProvider>
            <Component {...pageProps} />
          </FileProvider>
        </AccountProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
