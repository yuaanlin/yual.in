import ErrorBoundary from '../components/ErrorBoundary';
import User from '../models/user';
import { useEffect, useState } from 'react';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import { Note } from '@geist-ui/core';
import { NextPageContext } from 'next';
import jwt from 'jsonwebtoken';

export default function () {
  const [input, setInput] = useState<string>('');
  const [mdxSource, setMdxSource] = useState<any>(null);
  const [error, setError] = useState<string>();

  useEffect(() => {
    (async () => {
      try {
        setMdxSource(await serialize(input));
        setError(undefined);
      } catch (err: any) {
        setError(err.message);
      }
    })();
  }, [input]);

  return (
    <div className="w-screen grid grid-cols-5">
      <div className="col-span-2">
        <textarea
          spellCheck={false}
          style={{ width: '40vw' }}
          className="h-full p-4 outline-none fixed top-0 z-20 bg-zinc-100"
          value={input}
          onChange={e => setInput(e.target.value)} />
      </div>
      <div className="col-span-3 z-30">
        <div
          className="w-full lg:h-[46rem] h-[36rem] overflow-hidden
         relative flex justify-center">
          <img
            src=""
            className="absolute top-0 w-full h-full object-cover bg-zinc-500"
            alt="" />
          <div
            className="w-full h-full absolute top-0 right-0
         bg-black bg-opacity-60" />
          <div
            className="w-full px-4
         lg:w-[650px] mx-auto absolute lg:bottom-24 bottom-12">

            <p
              className="text-white text-3xl lg:text-5xl font-extrabold"
              style={{ lineHeight: 1.5 }}>
              Title
            </p>

            <div
              className="flex flex-row align-bottom mt-4">
              <img
                src="https://avatars.githubusercontent.com/u/21105863"
                className="rounded-full h-8 w-8 mr-4"
                alt="" />
              <p
                className="text-white lg:text-xl
             font-extrabold opacity-80">
                Yuanlin Lin 林沅霖
              </p>
              <p className="text-white lg:text-xl ml-2 lg:ml-8 opacity-60">
                {new Date().toISOString().split('T')[0]}
              </p>
            </div>

          </div>
        </div>
        <div className="w-full lg:w-[650px] px-4 mx-auto min-h-screen">
          {error && <Note type="error">{error}</Note>}
          <div id="article" className="mt-16 mb-32">
            {mdxSource && <ErrorBoundary>
              <MDXRemote{...mdxSource} />
            </ErrorBoundary>}
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    return { redirect: { permanent: false, destination: '/' }, props: {} };
  }

  const token = context.req?.headers.cookie?.split(';').map(c => c.trim())
    .find(c => c.startsWith('token='));
  if (!token) {
    return { redirect: { permanent: false, destination: '/' }, props: {} };
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err || !decoded ||
      (decoded as User).email !== 'im.yuanlinlin@gmail.com') {
      return { redirect: { permanent: false, destination: '/' }, props: {} };
    }
  });

  return { props: {} };
}
