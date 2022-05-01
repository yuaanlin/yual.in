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

  if(!post) {
    return <div className="w-full p-8">
      <div
        className={cx(imageClassName, 'w-full object-cover',
          'rounded-lg bg-zinc-200 animate-pulse')}
      />
      <div className="w-96 h-8 mt-6 bg-zinc-300 animate-pulse rounded-lg" />
      <div className="w-72 h-4 mt-6 bg-zinc-100 animate-pulse rounded-lg" />
      <div className="w-48 h-4 mt-2 bg-zinc-100 animate-pulse rounded-lg" />
      <div className="w-64 h-4 mt-2 bg-zinc-100 animate-pulse rounded-lg" />
    </div>;
  }

  return <Link href={'/posts/' + post._id}>
    <div className="w-full p-8">
      <img
        src={post.coverImageUrl}
        className={cx(imageClassName, 'w-full object-cover rounded-lg')}
        alt="" />
      <p className={cx(titleClassName, 'font-extrabold text-3xl mt-6')}>
        {post.title}
      </p>
      <p>{post.createdAt.toISOString()}</p>
      <p className="text-zinc-600 mt-4">
        {post.content.substring(0, 100)} ...
      </p>
    </div>
  </Link>;
}

export default PostCard;
