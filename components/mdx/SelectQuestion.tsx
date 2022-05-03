import { Button, ButtonGroup, Description } from '@geist-ui/core';

interface Props {
  questionName: string;
  question: string;
  options: string[];
}

function SelectQuestion(props: Props) {
  return <div className="w-full bg-zinc-50 rounded-lg p-2 mdx-component my-12">
    <Description
      style={{ margin: '16px 8px' }}
      title={props.questionName}
      content={props.question} />
    <ButtonGroup vertical width="100%">
      {props.options.map((opt, i) =>
        <Button key={i} style={{ textAlign: 'left' }}>
          {opt}
        </Button>)}
    </ButtonGroup>
  </div>;
}

export default SelectQuestion;
