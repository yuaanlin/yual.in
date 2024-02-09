import links from '../src/links';
import { GetServerSideProps } from 'next';

export default () => null;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader('location', links.twitter);
  context.res.statusCode = 302;
  context.res.end();
  return { props: {} };
};
