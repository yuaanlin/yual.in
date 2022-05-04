import '../styles/globals.css';
import { SessionProvider, useSession } from '../src/session';
import User from '../models/user';
import { useEffect, useState } from 'react';
import { Avatar, GeistProvider, useToasts } from '@geist-ui/core';
import dynamic from 'next/dynamic';
import type { AppProps } from 'next/app';
import 'nprogress/nprogress.css';
import { MDXProvider } from '@mdx-js/react';
import mdxComponents from '../components/mdx';

const TopProgressBar = dynamic(
  () => {
    return import('../components/TopProgressBar');
  },
  { ssr: false },
);

function MyApp({ Component, pageProps }: AppProps) {

  const [session, setSession] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      await restoreSession();
    })();
  }, []);

  async function restoreSession() {
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
        <TopProgressBar />
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
          <p className="ml-4">哈囉， {session.session.name}！歡迎回來我的 Blog。</p>
        </div>,
        type: 'success',
        delay: 5000
      });
    }
  }, [session?.session?.email]);
  return null;
}

export default MyApp;
