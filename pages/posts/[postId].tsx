import Post from '../../models/post';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import { NextPageContext } from 'next';
import cx from 'classnames';

export default function (props: {postId: string}) {
  const { postId } = props;
  const [mdxSource, setMdxSource] = useState<any>(null);
  const [post, setPost] = useState<Post>();

  async function refresh() {
    if (!postId) return;
    try {
      const res = await fetch('/api/posts/' + postId);
      const data = await res.json();
      data.createdAt = new Date(data.createdAt);
      setPost(data);
      const mdxSource = await serialize(data.content);
      setMdxSource(mdxSource);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    (async () => {await refresh();})();
  }, []);

  return (
    <div>
      <Head>
        <title>{post ? post.title : 'Blog'} | Yuanlin Lin 林沅霖</title>
        <link rel="icon" href="/favicon.png" />
        <meta
          name="description"
          content="我是林沅霖，目前就讀於浙江大學資訊工程系。
          我熱愛產品設計與軟體開發，擅長分析複雜的問題並提供有效的解決方案。歡迎查看我的作品集與部落格！"
        />
      </Head>
      <div
        className="w-full lg:h-[46rem] h-[36rem] overflow-hidden
         relative flex justify-center">
        <img
          src={post?.coverImageUrl}
          className="absolute top-0 w-full h-full object-cover bg-zinc-500"
          alt="" />
        <div
          className="w-full h-full absolute top-0 right-0
         bg-black bg-opacity-60" />
        <div className="w-[650px] mx-auto absolute lg:bottom-24 bottom-12">

          {!post ? <TitleSkeleton /> : <p
            className="text-white text-5xl font-extrabold"
            style={{ lineHeight: 1.5 }}>
            {post?.title}
          </p>}

          {!post ? <AuthorSkeleton /> : <div
            className="flex flex-row align-bottom mt-4">
            <img
              src="https://avatars.githubusercontent.com/u/21105863"
              className="rounded-full h-8 w-8 mr-4"
              alt="" />
            <p className="text-white text-xl font-extrabold opacity-80">
              Yuanlin Lin 林沅霖
            </p>
            <p className="text-white text-xl ml-8 opacity-60">
              {post?.createdAt.toISOString().split('T')[0]}
            </p>
          </div>}

        </div>
      </div>
      <div className="w-[650px] mx-auto min-h-screen">
        <div id="article" className="mt-16 mb-32">
          {!post && <ArticleSkeleton />}
          {mdxSource && <MDXRemote {...mdxSource} components={{}} />}
        </div>
      </div>
    </div>
  );
};

function AuthorSkeleton() {
  return <div className="flex flex-row align-bottom mt-8 items-center">
    <div className="rounded-full h-8 w-8 mr-4 animate-pulse bg-zinc-500" />
    <div className="bg-zinc-600 w-64 mr-4 animate-pulse h-6 rounded-lg"/>
    <div className="bg-zinc-700 w-36 animate-pulse h-6 rounded-lg"/>
  </div>;
}

function TitleSkeleton() {
  return <div>
    <div className="bg-zinc-600 animate-pulse w-full h-14 rounded-xl"/>
    <div className="bg-zinc-600 mt-4 animate-pulse w-1/2 h-14 rounded-xl"/>
  </div>;
}

function ArticleSkeleton() {
  return <div>
    <div className="bg-zinc-200 animate-pulse w-full h-4 rounded-lg"/>
    <div className="bg-zinc-200 mt-4 animate-pulse w-1/2 h-4 rounded-lg"/>
    <div className="bg-zinc-200 mt-4 animate-pulse w-1/3 h-4 rounded-lg"/>
    <div className="bg-zinc-200 mt-4 animate-pulse w-full h-4 rounded-lg"/>
    <div className="bg-zinc-200 mt-4 animate-pulse w-1/4 h-4 rounded-lg"/>
    <div className="bg-zinc-300 animate-pulse w-full h-8 my-16 rounded-lg"/>
    <div className="bg-zinc-200 animate-pulse w-full h-4 rounded-lg"/>
    <div className="bg-zinc-200 mt-4 animate-pulse w-1/2 h-4 rounded-lg"/>
    <div className="bg-zinc-200 mt-4 animate-pulse w-1/3 h-4 rounded-lg"/>
    <div className="bg-zinc-200 mt-4 animate-pulse w-full h-4 rounded-lg"/>
    <div className="bg-zinc-200 mt-4 animate-pulse w-1/4 h-4 rounded-lg"/>
  </div>;
}

export function getServerSideProps(context: NextPageContext) {
  return { props: { postId: context.query.postId } };
}
