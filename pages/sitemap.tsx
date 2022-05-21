import { getPostsInMongo } from '../services/getPosts';
import { GetServerSideProps } from 'next';
import React from 'react';

const Sitemap: React.FC = () => null;

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (context.res) {
    const postsInMongo = await getPostsInMongo();
    let urls = '';
    postsInMongo.map((e) => {
      urls += `<url>
          <loc>
              https://www.linyuanlin.com/posts/${e._id}
          </loc>
          <priority>0.8</priority>
          <changefreq>daily</changefreq>
      </url>`;
    });
    context.res.setHeader('Content-Type', 'text/xml');
    context.res.write(`<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
    </urlset>`);
    context.res.end();
  }
  return { props: {} };
};

export default Sitemap;
