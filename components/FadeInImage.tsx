interface Props {
  className?: string;
  src?: string;
  alt?: string;
}

function fadeInImage(props: Props) {
  return (
    <img
      className={props.className}
      src={props.src}
      alt={props.alt}
    />
  );
}

export default fadeInImage;
