import Post from '../models/post';
import Link from 'next/link';
import cx from 'classnames';
import Image from 'next/image';

interface Props {
  post: Post;
  imageClassName?: string;
  titleClassName?: string;
}

function PostCard(props: Props) {
  const {
    post,
    imageClassName,
    titleClassName
  } = props;

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
            placeholder="blur"
            blurDataURL={post.blurCoverImageDataUrl}
            src={post.coverImageUrl}
            alt=""/>
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
