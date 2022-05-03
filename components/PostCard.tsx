import Post from '../models/post';
import Link from 'next/link';
import cx from 'classnames';

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

  return <Link href={'/posts/' + post._id} scroll>
    <div className="w-full">
      <img
        src={post.coverImageUrl}
        className={cx(imageClassName, 'w-full object-cover transition',
          'rounded-lg cursor-pointer shadow-lg lg:hover:scale-105')}
        alt="" />
      <p
        className={cx(titleClassName, 'font-extrabold text-2xl',
          'mt-6 cursor-pointer')}>
        {post.title}
      </p>
      <p
        className="text-[#b2938d] font-extrabold
      mt-2 cursor-pointer">
        {post.createdAt.toISOString().split('T')[0]}
      </p>
      <p className="text-zinc-500 mt-4 cursor-pointer">
        {post.content.substring(0, 100)} ...
      </p>
    </div>
  </Link>;
}

export default PostCard;
