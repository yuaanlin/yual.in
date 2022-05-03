import '../styles/globals.css';
import dynamic from 'next/dynamic';
import type { AppProps } from 'next/app';
import 'nprogress/nprogress.css';

const TopProgressBar = dynamic(
  () => {
    return import('../components/TopProgressBar');
  },
  { ssr: false },
);

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <TopProgressBar />
    <Component {...pageProps} />
  </>;
}

export default MyApp;
