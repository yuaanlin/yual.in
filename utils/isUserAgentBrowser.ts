/**
 * 根據傳入的 User Agent 判斷是否為瀏覽器
 *
 * 用途：如果是瀏覽器則使用 CSR 策略提高 FCP，
 * 如果不是瀏覽器那可能是爬蟲，因此採用 SSR 提前注入 Headers
 * */
function isUserAgentBrowser(userAgent: string | undefined) {
  if (!userAgent) return false;
  return !!(userAgent.match(/chrome|chromium|crios/i)
    || userAgent.match(/firefox|fxios/i)
    || userAgent.match(/safari|applewebkit/i)
    || userAgent.match(/opr\//i)
    || userAgent.match(/edg/i));
}

export default isUserAgentBrowser;
