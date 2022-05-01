import { Canvas, Image } from '@napi-rs/canvas';

const NAPI_RS_IMAGE = new Image();
NAPI_RS_IMAGE.width = 320;
NAPI_RS_IMAGE.height = 320;

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
  const { title, description } = req.query;
  const WIDTH = 1200;
  const HEIGHT = 768;
  const canvas = new Canvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#c9ada7';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.save();
  ctx.fillStyle = '#000';
  ctx.font = '800 64px';
  printAt(ctx, 'Yuanlin', 96, 240, 96, WIDTH);
  ctx.fillStyle = '#72554f';
  ctx.font = '800 48px';
  printAt(ctx, 'Blog', 340, 240, 96, WIDTH);
  ctx.font = '800 82px';
  ctx.fillStyle = '#000';

  printAt(ctx, title, 96, HEIGHT / 2, 96, WIDTH - 192);
  ctx.font = '800 48px';
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  printAt(ctx, description, 96, HEIGHT - 200, 96, WIDTH - 192);
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

function printAt(context: any, text: string, x: number, y: number, lineHeight: number, fitWidth: number) {
  fitWidth = fitWidth || 0;

  if (fitWidth <= 0) {
    context.fillText(text, x, y);
    return;
  }

  for (var idx = 1; idx <= text.length; idx++) {
    var str = text.substr(0, idx);
    if (context.measureText(str).width > fitWidth) {
      context.fillText(text.substr(0, idx - 1), x, y);
      printAt(context, text.substr(idx - 1),
        x, y + lineHeight, lineHeight, fitWidth);
      return;
    }
  }
  context.fillText(text, x, y);
}
