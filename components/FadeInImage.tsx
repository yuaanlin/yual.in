import { useEffect, useState } from 'react';
import cx from 'classnames';

interface Props {
  className?: string;
  src?: string;
  alt?: string;
}

function fadeInImage(props: Props) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, [props.src]);

  return <img
    onLoad={() => setIsLoaded(true)}
    className={cx(props.className,
      isLoaded ? 'opacity-100' : 'opacity-0', 'transition')}
    src={props.src}
    alt={props.alt}
  />;
}

export default fadeInImage;
