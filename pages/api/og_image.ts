import getPost from '../../services/getPost';
import arrayBufferToBuffer from '../../utils/arrayBufferToBuffer';
import { Canvas, GlobalFonts, Image } from '@napi-rs/canvas';

const SUPPORTED_ENCODING = new Set(['png', 'avif', 'webp']);
const MIME_MAP: any = {
  png: 'image/png',
  avif: 'image/avif',
  webp: 'image/webp',
};

/**
 * @param {import('@vercel/node').VercelRequest} req
 * @param {import('@vercel/node').VercelResponse} res
 */
export default async function generateImage(req: any, res: any) {
  const font = await fetch('https://www.yuanlin.dev/NotoSansTC-Bold.otf');
  const fontBuffer = arrayBufferToBuffer(await font.arrayBuffer());
  GlobalFonts.register(fontBuffer, 'NotoSansTC-Bold');
  const { url } = req.query;
  if (url.startsWith('/posts')) {
    const postId = url.split('/')[2];
    const post = await getPost(postId);
    const { title, content, coverImageUrl } = post;
    const cover = await fetch(coverImageUrl);
    const coverBuffer = arrayBufferToBuffer(await cover.arrayBuffer());
    const coverImage = new Image();
    coverImage.src = coverBuffer;
    const description = content.replace(/<[^>]+>/g, '')
      .slice(0, 80).trim() + ' ...';
    const WIDTH = 1200;
    const HEIGHT = 768;
    const canvas = new Canvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(coverImage, 0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.font = '800 64px NotoSansTC-Bold';
    printAt(ctx, 'Yuanlin', 96, 180, 96, WIDTH);
    ctx.fillStyle = '#e0c2bb';
    ctx.font = '800 48px NotoSansTC-Bold';
    printAt(ctx, 'Blog', 340, 180, 96, WIDTH);
    ctx.font = '800 64px NotoSansTC-Bold';
    ctx.fillStyle = '#fff';

    printAt(ctx, title, 96, HEIGHT / 2 - 64, 96, WIDTH - 192);
    ctx.font = '800 36px NotoSansTC-Bold';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    printAt(ctx, description, 96, HEIGHT - 200, 48, WIDTH - 192);
    ctx.restore();
    const { type = 'png' } = req.query;
    let encodeType: any;
    if (SUPPORTED_ENCODING.has(type)) {
      encodeType = type;
    } else {
      encodeType = 'png';
    }
    const buffer = await canvas.encode(encodeType);
    res.setHeader('Content-Type', MIME_MAP[encodeType]);
    res.setHeader('Content-Disposition', 'inline');
    res.send(buffer);
  }
}

function printAt(context: any, text: string, x: number, y: number, lineHeight: number, fitWidth: number) {
  fitWidth = fitWidth || 0;

  if (fitWidth <= 0) {
    context.fillText(text, x, y);
    return;
  }

  for (let idx = 1; idx <= text.length; idx++) {
    const str = text.substring(0, idx);
    if (context.measureText(str).width > fitWidth) {
      context.fillText(text.substring(0, idx - 1), x, y);
      printAt(context, text.substring(idx - 1),
        x, y + lineHeight, lineHeight, fitWidth);
      return;
    }
  }
  context.fillText(text, x, y);
}
