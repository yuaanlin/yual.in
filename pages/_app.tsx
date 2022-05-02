import '../styles/globals.css';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { AppProps } from 'next/app';
import 'nprogress/nprogress.css';
import SocialLinks from '../components/SocialLinks';

const TopProgressBar = dynamic(
  () => {
    return import('../components/TopProgressBar');
  },
  { ssr: false },
);

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <TopProgressBar />
    <div
      className="w-full lg:w-64 fixed top-0 px-4
     py-2 lg:p-6 bg-white lg:bg-opacity-0 flex flex-row lg:flex-col
      items-center lg:items-start justify-between lg:justify-start">
      <Link href="/" scroll>
        <div
          className="font-extrabold text-xl lg:text-3xl
        mb-0 cursor-pointer flex flex-row lg:flex-col items-baseline">
          <p className="mr-2">Yuanlin Lin</p>
          <p className="text-lg text-[#c9ada7]">Blog</p>
        </div>
      </Link>
      <SocialLinks />
      <div
        id="g_id_onload"
        data-auto_select="true"
        data-skip_prompt_cookie="token"
        data-client_id="161014027797-ugj4ctsem3iu68701fe48u0vgc1ck4qm.apps.googleusercontent.com"
        data-login_uri="/api/login">
      </div>
    </div>
    <Component {...pageProps} />
  </>;
}

export default MyApp;
