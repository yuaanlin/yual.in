import Post from '../models/post';
import PostCard from '../components/PostCard';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function () {
  const [data, setData] = useState<Post[]>();

  async function refresh() {
    try {
      const res = await fetch('/api/posts');
      let data = await res.json();
      data = data.map((post: Post) => ({
        ...post,
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt)
      }));
      setData(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    (async () => {
      await refresh();
    })();
  }, []);

  return (
    <div className="px-64 min-h-screen">
      <Head>
        <title>Blog | Yuanlin Lin 林沅霖</title>
        <link rel="icon" href="/favicon.png" />
        <meta
          name="description"
          content="我是林沅霖，目前就讀於浙江大學資訊工程系。
          我熱愛產品設計與軟體開發，擅長分析複雜的問題並提供有效的解決方案。歡迎查看我的作品集與部落格！"
        />
      </Head>
      <div className="container mx-auto flex flex-row">
        <div className="w-2/3">
          <PostCard
            post={data ? data[0] : undefined}
            imageClassName="h-96"/>
          <div className="w-full flex flex-row">
            <div className="w-1/2">
              <PostCard
                post={data ? data[3] : undefined}
                imageClassName="h-64"
                titleClassName="text-xl"
              />
            </div>
            <div className="w-1/2">
              <PostCard
                post={data ? data[4] : undefined}
                imageClassName="h-64"
                titleClassName="text-xl"
              />
            </div>
          </div>
        </div>
        <div className="w-1/3">
          <PostCard
            post={data ? data[1] : undefined}
            imageClassName="h-64"
            titleClassName="text-xl"
          />
          <PostCard
            post={data ? data[2] : undefined}
            imageClassName="h-64"
            titleClassName="text-xl"
          />
        </div>
      </div>
    </div>
  );
};
