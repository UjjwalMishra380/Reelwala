import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const MODEL = 'fal-ai/wan/v2.2-5b/text-to-video';
const QUEUE_BASE = 'https://queue.fal.run';
const MAX_BODY_BYTES = 16 * 1024;
const MAX_PROMPT_CHARS = 1200;

function loadEnvFile() {
  const envPath = path.join(ROOT, '.env');
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) throw new Error(`Invalid .env line: ${trimmed}`);
    const value = match[2].trim().replace(/^(['"])(.*)\1$/, '$2');
    if (process.env[match[1]] === undefined) process.env[match[1]] = value;
  }
}

loadEnvFile();

const port = Number(process.env.PORT || 3000);
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

function sendJson(response, status, data) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  });
  response.end(JSON.stringify(data));
}

async function readJsonBody(request) {
  const chunks = [];
  let length = 0;
  for await (const chunk of request) {
    length += chunk.length;
    if (length > MAX_BODY_BYTES) {
      const error = new Error('Request body is too large.');
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    const error = new Error('Request body must be valid JSON.');
    error.statusCode = 400;
    throw error;
  }
}

function getFalKey() {
  if (!process.env.FAL_KEY || process.env.FAL_KEY === 'add_your_fal_api_key_here') {
    const error = new Error('Video generation is not configured. Add your fal.ai API key to the .env file.');
    error.statusCode = 503;
    throw error;
  }
  return process.env.FAL_KEY;
}

async function falRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Key ${getFalKey()}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers
    },
    signal: AbortSignal.timeout(30_000)
  });
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { detail: text.slice(0, 500) };
  }
  if (!response.ok) {
    const detail = data.detail || data.error || data.message || `HTTP ${response.status}`;
    const error = new Error(`fal.ai request failed: ${String(detail).slice(0, 500)}`);
    error.statusCode = 502;
    throw error;
  }
  return data;
}

function validateVideoRequest(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw Object.assign(new Error('Provide a video prompt and settings.'), { statusCode: 400 });
  }
  const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
  const style = body.style;
  const aspectRatio = body.aspectRatio;
  const durationFrames = Number(body.durationFrames);
  const frameOptions = [73, 121, 145];

  if (!prompt || prompt.length > MAX_PROMPT_CHARS) {
    throw Object.assign(new Error(`Prompt must be between 1 and ${MAX_PROMPT_CHARS} characters.`), { statusCode: 400 });
  }
  if (!['Cartoon', 'Anime', 'Product'].includes(style)) {
    throw Object.assign(new Error('Choose a supported visual style.'), { statusCode: 400 });
  }
  if (!['9:16', '1:1', '16:9'].includes(aspectRatio)) {
    throw Object.assign(new Error('Choose a supported video format.'), { statusCode: 400 });
  }
  if (!frameOptions.includes(durationFrames)) {
    throw Object.assign(new Error('Choose a supported video length.'), { statusCode: 400 });
  }
  return { prompt, style, aspectRatio, durationFrames };
}

function originIsAllowed(request) {
  const origin = request.headers.origin;
  if (!origin) return true;
  return origin === `http://127.0.0.1:${port}` || origin === `http://localhost:${port}`;
}

async function handleApi(request, response, pathname) {
  if (pathname === '/api/health' && request.method === 'GET') {
    return sendJson(response, 200, {
      configured: Boolean(process.env.FAL_KEY && process.env.FAL_KEY !== 'add_your_fal_api_key_here')
    });
  }

  if (!originIsAllowed(request)) {
    return sendJson(response, 403, { error: 'Requests from this website origin are not allowed.' });
  }

  if (pathname === '/api/videos' && request.method === 'POST') {
    const body = await readJsonBody(request);
    const { prompt, style, aspectRatio, durationFrames } = validateVideoRequest(body);
    const styleDescription = {
      Cartoon: '2D animated cartoon style',
      Anime: 'colorful anime illustration style',
      Product: 'polished product commercial style'
    }[style];
    const submitted = await falRequest(`${QUEUE_BASE}/${MODEL}`, {
      method: 'POST',
      body: JSON.stringify({
        prompt: `${prompt}\nVisual style: ${styleDescription}.`,
        num_frames: durationFrames,
        frames_per_second: 24,
        resolution: '580p',
        aspect_ratio: aspectRatio,
        enable_safety_checker: true,
        enable_output_safety_checker: true
      })
    });
    if (typeof submitted.request_id !== 'string') {
      throw Object.assign(new Error('fal.ai did not return a video request ID.'), { statusCode: 502 });
    }
    return sendJson(response, 202, {
      requestId: submitted.request_id,
      queuePosition: submitted.queue_position ?? null
    });
  }

  const statusMatch = pathname.match(/^\/api\/videos\/([A-Za-z0-9_-]{1,128})$/);
  if (statusMatch && request.method === 'GET') {
    const requestId = statusMatch[1];
    const status = await falRequest(`${QUEUE_BASE}/fal-ai/wan/requests/${encodeURIComponent(requestId)}/status`);

    if (status.status === 'COMPLETED' && status.error) {
      return sendJson(response, 200, { status: 'FAILED', error: status.error });
    }
    if (status.status !== 'COMPLETED') {
      if (status.status === 'FAILED') {
        return sendJson(response, 200, { status: 'FAILED', error: status.error || 'Video generation failed.' });
      }
      return sendJson(response, 200, {
        status: status.status,
        queuePosition: status.queue_position ?? null
      });
    }

    const result = await falRequest(`${QUEUE_BASE}/fal-ai/wan/requests/${encodeURIComponent(requestId)}`);
    const videoUrl = result.video && result.video.url;
    if (typeof videoUrl !== 'string' || new URL(videoUrl).protocol !== 'https:') {
      throw Object.assign(new Error('fal.ai completed the request without a valid video URL.'), { statusCode: 502 });
    }
    return sendJson(response, 200, { status: 'COMPLETED', videoUrl });
  }

  return sendJson(response, 404, { error: 'API route not found.' });
}

async function serveStatic(request, response, pathname) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    response.writeHead(400);
    return response.end('Invalid URL path.');
  }

  const relativePath = decodedPath === '/' ? 'index.html' : decodedPath.replace(/^[/\\]+/, '');
  if (relativePath.split(/[\\/]/).some(part => part.startsWith('.'))) {
    response.writeHead(404);
    return response.end('Not found.');
  }
  const filePath = path.resolve(ROOT, relativePath);
  if (!filePath.startsWith(`${ROOT}${path.sep}`)) {
    response.writeHead(403);
    return response.end('Forbidden.');
  }

  try {
    const content = await readFile(filePath);
    response.writeHead(200, {
      'Content-Type': mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff'
    });
    if (request.method === 'HEAD') return response.end();
    return response.end(content);
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'EISDIR') {
      response.writeHead(404);
      return response.end('Not found.');
    }
    throw error;
  }
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host || '127.0.0.1'}`);
    if (url.pathname.startsWith('/api/')) {
      await handleApi(request, response, url.pathname);
    } else if (request.method === 'GET' || request.method === 'HEAD') {
      await serveStatic(request, response, url.pathname);
    } else {
      sendJson(response, 405, { error: 'Method not allowed.' });
    }
  } catch (error) {
    const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 502;
    if (statusCode === 502) console.error(error.message);
    if (!response.headersSent) sendJson(response, statusCode, { error: error.message || 'The request could not be completed.' });
    else response.destroy();
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Reelwala Studio running at http://127.0.0.1:${port}`);
  if (!process.env.FAL_KEY || process.env.FAL_KEY === 'add_your_fal_api_key_here') {
    console.warn('Set FAL_KEY in .env to enable video generation.');
  }
});
