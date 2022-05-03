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

const mdxComponents = { Note, Tree, SelectQuestion, Snippet };

export default mdxComponents;
