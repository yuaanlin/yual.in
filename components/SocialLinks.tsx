import { Facebook, GitHub, Globe, Instagram, Linkedin } from 'react-feather';

interface Props {
  color?: string
}

function SocialLinks(props: Props) {
  return <div className="flex lg:mt-4 opacity-70 items-center">
    <a
      href="https://portfolio.yuanlin.dev"
      target="_blank"
      rel="noreferrer">
      <Globe
        size={18}
        className="transition hover:text-zinc-500"
        color={props.color} />
    </a>
    <a
      href="https://github.com/yuaanlin"
      className="ml-4 transition hover:text-zinc-500"
      target="_blank"
      rel="noreferrer">
      <GitHub size={18} color={props.color} />
    </a>
    <a
      href="https://www.linkedin.com/in/yuanlinlin"
      className="ml-4 transition hover:text-zinc-500"
      target="_blank"
      rel="noreferrer">
      <Linkedin size={18} color={props.color} />
    </a>
    <a
      href="https://www.instagram.com/yuanlin___/"
      className="ml-4 transition hover:text-zinc-500"
      target="_blank"
      rel="noreferrer">
      <Instagram size={18} color={props.color} />
    </a>
    <a
      href="https://www.facebook.com/ken20001207"
      className="ml-4 transition hover:text-zinc-500"
      target="_blank"
      rel="noreferrer">
      <Facebook size={18} color={props.color} />
    </a>
  </div>;
}

export default SocialLinks;
