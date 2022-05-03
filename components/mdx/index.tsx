import SelectQuestion from './SelectQuestion';
import { Note as NoteRaw, Snippet as SnippetRaw, Tree } from '@geist-ui/core';

function Note(props: any) {
  return <NoteRaw {...props} style={{ margin: '24px 0' }}>
    {props.children}
  </NoteRaw>;
}

function Snippet(props: any) {
  return <SnippetRaw {...props} style={{ margin: '24px 0' }} />;
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
  img: (props: any) => <div className="mdx-rendered my-16">
    <img
      className="shadow-lg rounded-xl lg:hover:scale-105 transition-all duration-200 hover:shadow-2xl"
      {...props} />
    <p className="text-center text-xs opacity-50">{props.alt}</p>
  </div>
};

export default mdxComponents as any;
