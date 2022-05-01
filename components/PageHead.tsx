import Head from 'next/head';

interface Props {
  title?: string;
  description?: string;
  imageUrl?: string;
}

function PageHead(props: Props) {
  return <Head>
    <title>
      {props?.title || 'Blog | Yuanlin Lin 林沅霖'}
    </title>
    <meta
      property="og:title"
      content={props?.title || 'Blog | Yuanlin Lin 林沅霖'}
      key="title" />
    <meta
      property="og:description"
      content={props?.description || '我是林沅霖，目前就讀於浙江大學資訊工程系。' +
        '我熱愛產品設計與軟體開發，擅長分析複雜的問題並提供有效的解決方案。歡迎查看我的作品集與部落格！'
      }
      key="description" />
    <meta
      property="og:image"
      content={props?.imageUrl || 'https://i.imgur.com/iZI6XtN.jpg'}
      key="image" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" href="/favicon.png" />
    <meta name="theme-color" content="#f2e9e4" />
  </Head>;
}

export default PageHead;
