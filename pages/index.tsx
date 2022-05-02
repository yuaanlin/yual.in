import Post, { parsePost } from '../models/post';
import PostCard from '../components/PostCard';
import PageHead from '../components/PageHead';
import { useEffect, useState } from 'react';

export default function () {
  const [data, setData] = useState<Post[]>();

  async function refresh() {
    try {
      const res = await fetch('/api/posts');
      let data = await res.json();
      data = data.map(parsePost);
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
    <div className="min-h-screen">
      <PageHead />
      <div
        className="container 2xl:px-32 px-0 lg:pl-24 mx-auto flex
       flex-row py-8 lg:pb-24 lg:pt-24 lg:pt-0 flex-wrap">
        <div className="w-full flex flex-row flex-wrap">
          <div className="w-full lg:w-2/3">
            <PostCard
              post={data ? data[0] : undefined}
              imageClassName="h-96" />
          </div>
          <div className="w-full lg:w-1/3 flex-wrap">
            <PostCard
              post={data ? data[1] : undefined}
              imageClassName="h-64"
              titleClassName="text-xl"
            />
          </div>
        </div>
        <div className="w-full flex flex-row">
          {(data ? data.slice(2, 5) : [undefined, undefined, undefined])
            .map((post, i) => (
              <div
                className="w-full lg:w-1/3"
                key={post?._id.toHexString() || i}
              >
                <PostCard
                  post={post}
                  imageClassName="h-64"
                  titleClassName="text-xl"
                />
              </div>))}
        </div>
      </div>
    </div>
  );
};
