import Document, { Head, Html, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-5S8XLKRFYM"></script>
          <script
            src="https://accounts.google.com/gsi/client"
            async
            defer></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-5S8XLKRFYM');
      `
            }}>
          </script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
