import "../styles/tailwind.css";
import classNames from "classnames";

// @ts-ignore
global.classNames = classNames;

function MyApp({ Component, pageProps }: any) {
  return <Component {...pageProps} />;
}

export default MyApp;
