import Post, { parsePost } from '../../models/post';
import isUserAgentBrowser from '../../utils/isUserAgentBrowser';
import getPost from '../../services/getPost';
import PageHead from '../../components/PageHead';
import SocialLinks from '../../components/SocialLinks';
import FadeInImage from '../../components/FadeInImage';
import { useSession } from '../../src/session';
import { useEffect, useState } from 'react';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import { NextPageContext } from 'next';
import Link from 'next/link';
import cx from 'classnames';
import { Heart } from 'react-feather';

export default function (props: { postId: string, post?: Post }) {
  const { postId } = props;
  const [mdxSource, setMdxSource] = useState<any>(null);
  const [post, setPost] = useState<Post | undefined>(parsePost(props.post));
  const [shouldHideWhiteLogo, setShouldHideWhiteLogo] = useState(false);
  const [heartLevel, setHeartLevel] = useState(0);
  const session = useSession();

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
    (async () => {
      await refresh();
    })();
  }, []);

  async function handleLike() {
    setHeartLevel(heartLevel + 0.1);
    await fetch('/api/posts/' + postId + '/like', { method: 'POST' });
  }

  useEffect(() => {
    function handleScroll() {
      if (document.documentElement.scrollTop > 36 * 16) {
        setShouldHideWhiteLogo(true);
      } else {
        setShouldHideWhiteLogo(false);
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      <PageHead
        title={(post ? post.title : 'Blog') + '| Yuanlin Lin 林沅霖'}
        type="article"
        imageUrl={`/api/og_image?url=/posts/${postId}`}
        description={post?.content.substring(0, 100) + '...'}
      />
      <div
        className={cx('w-full lg:w-64 fixed top-0 px-4',
          'flex flex-row justify-between lg:flex-col',
          'py-2 lg:p-6 bg-white lg:bg-opacity-0 z-50 transition',
          !shouldHideWhiteLogo && 'bg-opacity-0')}>
        <Link href="/" scroll>
          <div
            className="font-extrabold text-xl lg:text-3xl
        mb-0 cursor-pointer flex flex-row lg:flex-col items-baseline">
            <p
              className={cx(
                'mr-2 z-50 transition duration-1000', shouldHideWhiteLogo
                  ? 'text-black' : 'text-white')}>
              Yuanlin Lin
            </p>
            <p className="text-lg text-[#c9ada7]">Blog</p>
          </div>
        </Link>
        <SocialLinks color={shouldHideWhiteLogo ? 'black' : 'white'} />
      </div>
      <div
        className="w-full lg:h-[46rem] h-[36rem] overflow-hidden
         relative flex justify-center">
        <FadeInImage
          src={post?.coverImageUrl}
          className="absolute top-0 w-full h-full object-cover bg-zinc-500"
          alt="" />
        <div
          className="w-full h-full absolute top-0 right-0
         bg-black bg-opacity-60" />
        <div
          className="w-full px-4
         lg:w-[650px] mx-auto absolute lg:bottom-24 bottom-12">

          {!post ? <TitleSkeleton /> : <p
            className="text-white text-3xl lg:text-5xl font-extrabold"
            style={{ lineHeight: 1.5 }}>
            {post?.title}
          </p>}

          {!post ? <AuthorSkeleton /> : <div
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
              {post?.createdAt.toISOString().split('T')[0]}
            </p>
          </div>}

        </div>
      </div>
      <div className="w-full lg:w-[650px] px-4 mx-auto min-h-screen">
        <div id="article" className="my-16">
          {!post && <ArticleSkeleton />}
          {mdxSource && <MDXRemote {...mdxSource} />}
        </div>

        {!session.session &&
        <div className="bg-zinc-50 p-4 rounded-lg mb-32">
          <p className="text-sm font-bold">請登入以按愛心及留言</p>
          <p className="mt-2 mb-4 text-zinc-600">
            Yuanlin Blog 需要先使用 Google 登入，才能給文章按愛心及留言！
          </p>
          <div
            className="g_id_signin"
            data-type="standard"
            data-size="large"
            data-theme="outline"
            data-text="sign_in_with"
            data-shape="rectangular"
            data-logo_alignment="left" />
        </div>}

        {session.session && mdxSource && <div
          onClick={handleLike}
          className="group flex items-center
        cursor-pointer mb-32">
          <Heart
            fill="#cc0000"
            fillOpacity={heartLevel}
            color="#cc0000"
            className="group-active:scale-125 transition" />
          <p className="select-none text-[#dd0000] ml-4">
            喜歡這篇文章嗎? 給我一個愛心吧!
          </p>
        </div>}
      </div>
      <div
        id="g_id_onload"
        data-auto_select="true"
        data-skip_prompt_cookie="token"
        data-client_id="161014027797-ugj4ctsem3iu68701fe48u0vgc1ck4qm.apps.googleusercontent.com"
        data-login_uri={'/api/login?url=/posts/' + postId} />
    </div>
  );
};

function AuthorSkeleton() {
  return <div className="flex flex-row align-bottom mt-8 items-center">
    <div className="rounded-full h-8 w-8 mr-4 animate-pulse bg-zinc-500" />
    <div className="bg-zinc-600 w-64 mr-4 animate-pulse h-6 rounded-lg" />
    <div className="bg-zinc-700 w-36 animate-pulse h-6 rounded-lg" />
  </div>;
}

function TitleSkeleton() {
  return <div>
    <div className="bg-zinc-600 animate-pulse w-full h-8 lg:h-14 rounded-xl" />
    <div
      className="bg-zinc-600 mt-4 animate-pulse
    w-1/2 h-8 lg:h-14 rounded-xl" />
  </div>;
}

function ArticleSkeleton() {
  return <div>
    <div className="bg-zinc-200 animate-pulse w-full h-4 rounded-lg" />
    <div className="bg-zinc-200 mt-4 animate-pulse w-1/2 h-4 rounded-lg" />
    <div className="bg-zinc-200 mt-4 animate-pulse w-1/3 h-4 rounded-lg" />
    <div className="bg-zinc-200 mt-4 animate-pulse w-full h-4 rounded-lg" />
    <div className="bg-zinc-200 mt-4 animate-pulse w-1/4 h-4 rounded-lg" />
    <div className="bg-zinc-300 animate-pulse w-full h-8 my-16 rounded-lg" />
    <div className="bg-zinc-200 animate-pulse w-full h-4 rounded-lg" />
    <div className="bg-zinc-200 mt-4 animate-pulse w-1/2 h-4 rounded-lg" />
    <div className="bg-zinc-200 mt-4 animate-pulse w-1/3 h-4 rounded-lg" />
    <div className="bg-zinc-200 mt-4 animate-pulse w-full h-4 rounded-lg" />
    <div className="bg-zinc-200 mt-4 animate-pulse w-1/4 h-4 rounded-lg" />
  </div>;
}

export async function getServerSideProps(context: NextPageContext) {
  const ua = context.req?.headers['user-agent'];
  if (isUserAgentBrowser(ua))
    return { props: { postId: context.query.postId } };
  const postId = context.query.postId;
  if (typeof postId !== 'string')
    return { props: { error: 'Post not found.' } };
  try {
    const post = await getPost(postId);
    return { props: { postId, post } };
  } catch (error) {
    return { props: { error } };
  }
}
