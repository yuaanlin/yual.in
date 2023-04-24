interface Post {
  _id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  coverImageUrl: string;
  blurCoverImageDataUrl: string;
  content: string;
  slug: string;
}

export function parsePost(data: Post) {
  return {
    ...data,
    _id: data._id,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt)
  };
}

function dateToISOString(date: any) {
  if (typeof date.toISOString === 'function') {
    return date.toISOString();
  }
  return date;
}

function toHexString(id: any) {
  if (typeof id.toHexString === 'function') {
    return id.toHexString();
  }
  return id;
}

export function serializePost(data: Post) {
  return {
    ...data,
    _id: toHexString(data._id),
    createdAt: dateToISOString(data.createdAt),
    updatedAt: dateToISOString(data.updatedAt)
  };
}

export default Post;
