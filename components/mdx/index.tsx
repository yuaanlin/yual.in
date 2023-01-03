import SelectQuestion from './SelectQuestion';
import { Note as NoteRaw, Snippet as SnippetRaw, Tree } from '@geist-ui/core';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { useEffect, useState } from 'react';

function Note(props: any) {
  return <NoteRaw {...props} style={{ margin: '24px 0' }}>
    {props.children}
  </NoteRaw>;
}

function Snippet(props: any) {
  return <SnippetRaw
    {...props}
    className="mdx-snippet"
    style={{ margin: '24px 0' }}
  />;
}

function code({
  className,
  ...props
}: any) {
  const match = /language-(\w+)/.exec(className || '');
  return match
    ? <SyntaxHighlighter language={match[1]} PreTag="div" {...props} />
    : <code className={className} {...props} />;
}

const mdxComponents = {
  Note,
  Tree,
  SelectQuestion,
  Snippet,
  ol: (props: any) => <ol
    className="mdx-rendered list-decimal ml-8"
    {...props}>{props.children}</ol>,
  pre: (props: any) => <pre className="mdx-rendered" {...props} />,
  code,
  img: (props: any) => {
    const [isLoaded, setLoaded] = useState(false);
    useEffect(() => {
      setLoaded(true);
    }, []);

    if (props.src.startsWith('https://www.youtube.com/embed/')) {
      return <>
        <iframe
          src={props.src}
          className="w-full h-96 shadow-lg rounded-xl lg:hover:scale-105
        transition-all duration-200 hover:shadow-2xl"
          title="YouTube video player"
          allow="accelerometer; clipboard-write; gyroscope; picture-in-picture"
          allowFullScreen/>
        {isLoaded && <span className="text-center text-xs opacity-50">
          {props.alt}
        </span>}
      </>;
    }

    return <>
      <img
        src={props.src}
        alt={props.alt}
        className="shadow-lg rounded-xl lg:hover:scale-105
       transition-all duration-200 hover:shadow-2xl mt-16"/>
      {isLoaded && <span className="text-center text-xs opacity-50 mb-16">
        {props.alt}
      </span>}
    </>;
  }
};

export default mdxComponents as any;
