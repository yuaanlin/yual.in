import Post, { parsePost, serializePost } from '../models/post';
import PostCard from '../components/PostCard';
import PageHead from '../components/PageHead';
import SocialLinks from '../components/SocialLinks';
import { getPostsInMongo } from '../services/getPosts';
import { GOOGLE_OAUTH_CLIENT_ID } from '../config.client';
import ChiefNoobLogo from '../public/chiefnoob.png';
import Link from 'next/link';
import cx from 'classnames';
import { GetStaticProps } from 'next';

type Card = { type: 'Article', data: Post, key: string }
  | { type: 'ChiefNoob', key: string };

export default function (props: { posts: Post[] }) {
  const data = props.posts.map(parsePost);

  const cards: Card[] = data.map((post) => ({
    type: 'Article',
    data: post,
    key: post.slug,
  }));

  // Inject ChiefNoob Ad Card
  cards.splice(2, 0, {
    type: 'ChiefNoob',
    key: 'chiefnoob'
  });

  return (
    <div className="min-h-screen">
      <PageHead canonicalUrl="https://yual.in"/>
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
          <SocialLinks/>
        </div>
        <div
          className="w-full my-16 grid grid-cols-1
           md:grid-cols-2 xl:grid-cols-3 gap-12"
        >
          {cards.map((card, i) => {
            switch (card.type) {
              case 'Article':
                return <div
                  className={cx(i == 0 && 'md:col-span-2')}
                  key={card.key}>
                  <PostCard
                    post={card.data}
                    imageClassName={cx(i === 0 && 'h-64 lg:h-96',
                      i === 1 && 'h-64', i > 1 && 'h-48 lg:h-64')}/>
                </div>;
              case 'ChiefNoob':
                return <a
                  key={card.key}
                  href="https://discord.gg/Nyke4bBWJh"
                  target="_blank"
                  rel="noreferrer"
                >
                  <div
                    className="lg:h-full h-[480px] bg-gray-50 shadow
                    cursor-pointer relative group lg:hover:scale-105
                    duration-500 transition-all overflow-hidden rounded-lg"
                    style={{
                      background:
                        'linear-gradient(120deg, rgb(234,121,49) 0%,' +
                        ' rgb(282,181,79) 100%)'
                    }}
                  >
                    <div className="p-8 lg:p-12 font-bold text-white">
                      <p className="text-lg opacity-70">立即加入</p>
                      <p className="text-4xl mt-2">Chief Noob <br/>菜雞開發社群
                      </p>
                      <p className="mt-4">
                        與其他開發者同學們分享交流程式語言、前後端開發、產品設計、系統架構等話題！
                      </p>
                    </div>
                    <img
                      src={ChiefNoobLogo.src}
                      className="w-64 h-64 -rotate-[30deg] absolute -bottom-12
                -right-12 group-hover:scale-110 transition-all duration-700"
                      alt="chief-noob-logo"
                    />
                  </div>
                </a>;
              default:
                return null;
            }
          })}
        </div>

        <div
          className="w-full flex justify-center items-center
        text-xs mt-8 lg:mt-24 flex-wrap"
        >
          <div className="flex w-full lg:w-auto justify-center">
            <p>這個部落格是使用</p>
            <a href="https://nextjs.org/" target="_blank" rel="noreferrer">
              <img
                src="/nextjs.svg"
                alt="next.js"
                className="h-4 mx-2 inline mb-1"
              />
            </a>
            <p>框架開發，</p>
          </div>
          <div className="flex w-full lg:w-auto justify-center mt-6 lg:mt-0">
            <p>並且自動部署於</p>
            <a href="https://zeabur.com/" target="_blank" rel="noreferrer">
              <img
                src="/zeabur.svg"
                alt="zeabur"
                className="h-4 mx-2 inline mb-1"
              />
            </a>
            <p>服務部署平台</p>
          </div>
        </div>

      </div>
      <div
        id="g_id_onload"
        data-auto_select="true"
        data-skip_prompt_cookie="token"
        data-client_id={GOOGLE_OAUTH_CLIENT_ID}
        data-login_uri="/api/login?url=/"/>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  let postsInMongo: any = await getPostsInMongo();
  postsInMongo = postsInMongo.map(serializePost);
  return {
    props: { posts: postsInMongo },
    revalidate: 10
  };
};
