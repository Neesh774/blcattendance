import Head from "next/head";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import "regenerator-runtime";

export default function App({ Component, pageProps }: AppProps) {
  dayjs.extend(customParseFormat);
  return (
    <>
      <Head>
        <title>BLC Attendance</title>
        <meta
          name="description"
          content="Attendance Manager for Brookfield Learning Center"
        />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Component {...pageProps} />
      <Toaster />
    </>
  );
}
