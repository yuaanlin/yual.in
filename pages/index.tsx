import Post, { parsePost } from '../models/post';
import PostCard from '../components/PostCard';
import PageHead from '../components/PageHead';
import SocialLinks from '../components/SocialLinks';
import {
  getPostsInMongo,
  getPostsInRedis,
  setPostsInRedis
} from '../services/getPosts';
import { GOOGLE_OAUTH_CLIENT_ID } from '../config.client';
import Link from 'next/link';
import cx from 'classnames';

export default function (props: { posts: Post[] }) {
  const data = props.posts.map(parsePost);
  return (
    <div className="min-h-screen">
      <PageHead canonicalUrl="https://www.yuanlin.dev" />
      <div
        className="container 2xl:px-32 px-6 lg:px-12 mx-auto flex
       flex-row py-8 lg:pb-24 flex-wrap">
        <div className="mt-4 lg:mt-12">
          <Link href="/" scroll>
            <div
              className="font-extrabold text-xl lg:text-3xl mb-4 lg:mb-0
        cursor-pointer flex flex-row lg:flex-col items-baseline">
              <p className="mr-2">Yuanlin Lin</p>
              <p className="text-lg text-[#c9ada7]">Blog</p>
            </div>
          </Link>
          <SocialLinks />
        </div>
        <div
          className="w-full my-16 grid grid-cols-1 md:grid-cols-2
          xl:grid-cols-3 gap-12">
          {!data && [0, 1, 2, 3, 4].map(i =>
            <div
              className={cx(i == 0 && 'md:col-span-2')}
              key={i}>
              <PostCard
                post={undefined}
                imageClassName={cx(i === 0 && 'h-64 lg:h-96',
                  i === 1 && 'h-64', i > 1 && 'h-48 lg:h-64')} />
            </div>)}
          {data && data.map((post, i) =>
            <div
              className={cx(i == 0 && 'md:col-span-2')}
              key={post._id.toHexString()}>
              <PostCard
                post={post}
                imageClassName={cx(i === 0 && 'h-64 lg:h-96',
                  i === 1 && 'h-64', i > 1 && 'h-48 lg:h-64')} />
            </div>)}
        </div>
      </div>
      <div
        id="g_id_onload"
        data-auto_select="true"
        data-skip_prompt_cookie="token"
        data-client_id={GOOGLE_OAUTH_CLIENT_ID}
        data-login_uri="/api/login?url=/" />
    </div>
  );
};

export async function getServerSideProps() {
  const postsInRedis = await getPostsInRedis();
  if (postsInRedis) return { props: { posts: postsInRedis } };
  const postsInMongo = await getPostsInMongo();
  await setPostsInRedis(postsInMongo);
  return { props: { posts: postsInMongo } };
}
