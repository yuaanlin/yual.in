import '../styles/globals.css';
import Link from 'next/link';
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
    <div className="w-64 fixed top-0 p-8">
      <Link href="/">
        <div className="font-extrabold text-3xl mb-0 cursor-pointer">
          <p>Yuanlin Lin</p>
          <p className="text-lg text-[#c9ada7]">Blog</p>
        </div>
      </Link>
    </div>
    <Component {...pageProps} />
  </>;
}

export default MyApp;
