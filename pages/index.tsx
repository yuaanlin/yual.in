import Post from '../models/post';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function () {
  const [data, setData] = useState<Post[]>();

  async function refresh() {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
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
          {(data && data[0]) && <Link href={'/posts/' + data[0]._id}>
            <div className="w-full p-8">
              <img
                src={data[0].coverImageUrl}
                className="w-full object-cover h-96 rounded-lg"
                alt="" />
              <p className="font-extrabold text-3xl mt-6">
                {data[0].title}
              </p>
              <p className="text-zinc-600 mt-4">
                {data[0].content.substring(0, 100)} ...
              </p>
            </div>
          </Link>}
          <div className="w-full flex flex-row">
            <div className="w-1/2">
              {(data && data[3]) && <Link href={'/posts/' + data[3]._id}>
                <div className="w-full p-8">
                  <img
                    src={data[3].coverImageUrl}
                    className="w-full object-cover h-48 rounded-lg"
                    alt="" />
                  <p className="font-extrabold text-xl mt-6">
                    {data[3].title}
                  </p>
                  <p className="text-zinc-600 mt-4">
                    {data[3].content.substring(0, 100)} ...
                  </p>
                </div>
              </Link>}
            </div>
            <div className="w-1/2">
              {(data && data[4]) && <Link href={'/posts/' + data[4]._id}>
                <div className="w-full p-8">
                  <img
                    src={data[4].coverImageUrl}
                    className="w-full object-cover h-48 rounded-lg"
                    alt="" />
                  <p className="font-extrabold text-xl mt-6">
                    {data[4].title}
                  </p>
                  <p className="text-zinc-600 mt-4">
                    {data[4].content.substring(0, 100)} ...
                  </p>
                </div>
              </Link>}
            </div>
          </div>
        </div>
        <div className="w-1/3">
          {(data && data[1]) && <Link href={'/posts/' + data[1]._id}>
            <div className="w-full p-8">
              <img
                src={data[1].coverImageUrl}
                className="w-full object-cover h-48 rounded-lg"
                alt="" />
              <p className="font-extrabold text-xl mt-6">
                {data[1].title}
              </p>
              <p className="text-zinc-600 mt-4 text-sm">
                {data[1].content.substring(0, 100)} ...
              </p>
            </div>
          </Link>}
          {(data && data[2]) && <Link href={'/posts/' + data[2]._id}>
            <div className="w-full p-8">
              <img
                src={data[2].coverImageUrl}
                className="w-full object-cover h-48 rounded-lg"
                alt="" />
              <p className="font-extrabold text-xl mt-6">
                {data[2].title}
              </p>
              <p className="text-zinc-600 mt-4 text-sm">
                {data[2].content.substring(0, 100)} ...
              </p>
            </div>
          </Link>}
        </div>
      </div>
    </div>
  );
};
