import SelectQuestion from './SelectQuestion';
import FadeInImage from '../FadeInImage';
import { Note as NoteRaw, Snippet as SnippetRaw, Tree } from '@geist-ui/core';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

function Note(props: any) {
  return <NoteRaw {...props} style={{ margin: '24px 0' }}>
    {props.children}
  </NoteRaw>;
}

function Snippet(props: any) {
  return <SnippetRaw {...props} style={{ margin: '24px 0' }} />;
}

function code({ className, ...props }: any) {
  console.log(className);
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
  img: (props: any) => <div className="mdx-rendered my-16">
    {props.src.startsWith('https://www.youtube.com/embed/') ? <iframe
      src={props.src}
      className="w-full h-96 shadow-lg rounded-xl lg:hover:scale-105
        transition-all duration-200 hover:shadow-2xl"
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; gyroscope; picture-in-picture"
      allowFullScreen /> :
      <FadeInImage
      className="shadow-lg rounded-xl lg:hover:scale-105
       transition-all duration-200 hover:shadow-2xl"
      {...props} />}
    <p className="text-center text-xs opacity-50">{props.alt}</p>
  </div>
};

export default mdxComponents as any;
