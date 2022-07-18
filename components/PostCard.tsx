import Post from '../models/post';
import Link from 'next/link';
import cx from 'classnames';
import Image from 'next/image';

interface Props {
  post: Post | undefined;
  imageClassName?: string;
  titleClassName?: string;
}

function PostCard(props: Props) {
  const { post, imageClassName, titleClassName } = props;

  if (!post) {
    return <div className="w-full">
      <div
        className={cx(imageClassName, 'w-full object-cover',
          'rounded-lg bg-zinc-200 animate-pulse')}
      />
      <div
        className="w-full lg:w-96 h-8 mt-6 bg-zinc-300
      animate-pulse rounded-lg" />
      <div className="w-72 h-4 mt-6 bg-zinc-100 animate-pulse rounded-lg" />
      <div className="w-48 h-4 mt-2 bg-zinc-100 animate-pulse rounded-lg" />
      <div className="w-64 h-4 mt-2 bg-zinc-100 animate-pulse rounded-lg" />
    </div>;
  }

  return <Link href={'/posts/' + post.slug} scroll>
    <a>
      <div className="w-full group transition-all duration-1000">
        <div
          className={cx(imageClassName, 'w-full object-cover',
            'overflow-hidden lg:group-hover:scale-105 duration-500',
            'rounded-lg cursor-pointer shadow-lg',
            'relative')}>
          <Image
            layout="fill"
            objectFit="cover"
            src={post.coverImageUrl}
            alt="" />
        </div>
        <p
          className={cx(titleClassName, 'font-extrabold text-2xl',
            'mt-6 cursor-pointer group-hover:translate-x-2', 'duration-1000')}>
          {post.title}
        </p>
        <p
          className="text-[#b2938d] font-extrabold duration-700
      mt-2 cursor-pointer group-hover:translate-x-4 transition-all">
          {post.createdAt.toISOString().split('T')[0]}
        </p>
        <p
          className="lg:opacity-40 mt-4 cursor-pointer
        group-hover:opacity-100 transition-all">
          {post.content.substring(0, 100)} ...
        </p>
      </div>
    </a>
  </Link>;
}

export default PostCard;
