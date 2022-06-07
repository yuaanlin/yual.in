import '../styles/globals.css';
import { SessionProvider, useSession } from '../src/session';
import User from '../models/user';
import mdxComponents from '../components/mdx';
import { useEffect, useState } from 'react';
import { Avatar, GeistProvider, useToasts } from '@geist-ui/core';
import NProgress from 'nprogress';
import { useRouter } from 'next/router';
import { MDXProvider } from '@mdx-js/react';
import type { AppProps } from 'next/app';
import 'nprogress/nprogress.css';

function MyApp({ Component, pageProps }: AppProps) {

  const router = useRouter();

  const handleRouteChange = (url: string) => {
    // @ts-ignore
    window.gtag('config', 'G-5S8XLKRFYM', { page_path: url, });
  };

  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    let routeChangeStart = () => NProgress.start();
    let routeChangeComplete = () => NProgress.done();

    router.events.on('routeChangeStart', routeChangeStart);
    router.events.on('routeChangeComplete', routeChangeComplete);
    router.events.on('routeChangeError', routeChangeComplete);
    return () => {
      router.events.off('routeChangeStart', routeChangeStart);
      router.events.off('routeChangeComplete', routeChangeComplete);
      router.events.off('routeChangeError', routeChangeComplete);
    };
  }, []);

  const [session, setSession] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      await restoreSession();
    })();
  }, []);

  async function restoreSession() {
    if (!window.document.cookie.split(';')
      .map(c => c.trim()).find(c => c.startsWith('token=')))
      return;
    try {
      const res = await fetch('/api/me');
      const user = await res.json();
      setSession(user);
    } catch (err) {

    }
  }

  return <SessionProvider value={{ session }}>
    <GeistProvider>
      <MDXProvider components={mdxComponents}>
        <SessionRestoreNotification />
        <Component {...pageProps} />
      </MDXProvider>
    </GeistProvider>
  </SessionProvider>;
}

function SessionRestoreNotification() {
  const session = useSession();
  const { setToast } = useToasts();
  useEffect(() => {
    if (session?.session) {
      setToast({
        text: <div className="flex flex-row items-center">
          <Avatar src={session.session.avatarUrl} />
          <p className="ml-4">哈囉， {session.session.name}！歡迎回來我的
            Blog。</p>
        </div>,
        type: 'success',
        delay: 5000
      });
    }
  }, [session?.session?.email]);
  return null;
}

export default MyApp;
