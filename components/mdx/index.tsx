import SelectQuestion from './SelectQuestion';
import { Note as NoteRaw, Tree } from '@geist-ui/core';

function Note(props: any) {
  return <NoteRaw {...props} style={{ margin: '24px 0' }}>
    {props.children}
  </NoteRaw>;
}

const mdxComponents = { Note, Tree, SelectQuestion };

export default mdxComponents;
