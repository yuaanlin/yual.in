import Post from '../../models/post';
import getPost from '../../services/getPost';
import PageHead from '../../components/PageHead';
import SocialLinks from '../../components/SocialLinks';
import FadeInImage from '../../components/FadeInImage';
import { useSession } from '../../src/session';
import { useEffect, useState } from 'react';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { NextPageContext } from 'next';
import Link from 'next/link';
import cx from 'classnames';
import { Heart } from 'react-feather';
import { Avatar } from '@geist-ui/core';

interface PageProps {
  post: Post
  mdxSource: MDXRemoteSerializeResult
}

export default function (props: PageProps) {
  const { post, mdxSource } = props;
  const postId = post._id;
  const [shouldHideWhiteLogo, setShouldHideWhiteLogo] = useState(false);
  const session = useSession();
  const [likes, setLikes] = useState<{
    userLike: number,
    likeCount: number,
    userAvatars: string[]
  }>();

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    if (!postId) return;
    try {
      const likes = await fetch('/api/posts/' + postId + '/likes');
      const likesData = await likes.json();
      setLikes(likesData);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleLike() {
    if (!session.session) {
      window.location.href =
        'https://accounts.google.com/o/oauth2/v2/auth' +
        '?response_type=code' +
        '&client_id=' +
        '161014027797-ugj4ctsem3iu68701fe48u0vgc1ck4qm.apps.googleusercontent.com' +
        '&scope=openid%20email%20https://www.googleapis.com/auth/userinfo.profile' +
        '&redirect_uri=https://' +
        window.location.host +
        '/api/login&state=/posts/' + postId;
      return;
    }
    if (!likes || likes.userLike >= 10) return;
    setLikes(o => !o ? undefined : {
      ...o,
      likeCount: o.likeCount + 1,
      userLike: o.userLike + 1
    });
    await fetch('/api/posts/' + postId + '/likes', { method: 'POST' });
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
        canonicalUrl={`https://www.yuanlin.dev/posts/${postId}`}
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
              {new Date(post?.createdAt).toISOString().split('T')[0]}
            </p>
          </div>}

        </div>
      </div>
      <div className="w-full lg:w-[650px] px-4 mx-auto min-h-screen pb-32">
        <div id="article" className="my-16">
          {!post && <ArticleSkeleton />}
          <MDXRemote {...mdxSource} />
        </div>

        {likes && <div>
          <div
            onClick={handleLike}
            className="group flex items-center
        cursor-pointer">
            <Heart
              fill="#C9A7A7"
              fillOpacity={likes.userLike / 10}
              color="#C9A7A7"
              className="group-active:scale-125 transition" />
            {likes.likeCount && <p className="text-[#C9A7A7] ml-4 mr-6">
              {likes.likeCount}
            </p>}
            {likes.likeCount === 0 && <p className="text-[#C9A7A7] ml-4 mr-6">
              給這篇文章一個愛心吧！
            </p>}
            <Avatar.Group>
              {likes.userAvatars?.map((avatar, index) =>
                <Avatar key={index} src={avatar} stacked />)}
            </Avatar.Group>
          </div>
        </div>}
      </div>

      <div className="w-full pb-32 pt-16 bg-zinc-50">
        <div className="w-full lg:w-[650px] px-4 mx-auto">
          <div className="flex mt-12 flex-col md:flex-row">
            <img
              src="https://avatars.githubusercontent.com/u/21105863?v=4"
              alt="author-avatar"
              className="w-24 h-24 rounded-full"
            />
            <div className="ml-0 mt-12 md:ml-12 md:mt-0">
              <p className="font-extrabold opacity-60 mb-4">
                關於作者
              </p>
              <p className="font-extrabold text-2xl">
                Yuanlin Lin 林沅霖
              </p>
              <p className="mt-6 mb-12 opacity-70">
                台灣桃園人，目前就讀浙江大學，主修計算機科學與技術，同時兼職外包全端開發工程師，熱愛產品設計與軟體開發。
              </p>
              <SocialLinks />
            </div>
          </div>
        </div>
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
  const postId = context.query.postId;
  if (typeof postId !== 'string')
    return { props: { error: 'Post not found.' } };
  try {
    const post = await getPost(postId);
    const mdxSource = await serialize(post.content);
    return { props: { postId, post, mdxSource } };
  } catch (error) {
    return { props: { error } };
  }
}
