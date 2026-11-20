'use strict';

const promptInput = document.querySelector('#videoPrompt');
const charCount = document.querySelector('#charCount');
const notice = document.querySelector('#creatorNotice');
const form = document.querySelector('#creatorForm');
const submitButton = form.querySelector('[type="submit"]');
const previewCanvas = document.querySelector('#previewCanvas');
const serviceStatus = document.querySelector('#serviceStatus');

async function readApiResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    if (location.port !== '3000') {
      throw new Error('The video API is unavailable on this page. Stop the static preview, run `npm start`, and open http://127.0.0.1:3000/chatbot.html.');
    }
    throw new Error(`The video server returned a non-JSON response (HTTP ${response.status}). Restart it with npm start and try again.`);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('The video server sent an empty or invalid response. Restart it with npm start and try again.');
  }
  if (!response.ok) throw new Error(data.error || `The video request failed (HTTP ${response.status}).`);
  return data;
}

promptInput.addEventListener('input', () => {
  charCount.textContent = String(promptInput.value.length);
});

document.querySelectorAll('.prompt-chip').forEach(button => {
  button.addEventListener('click', () => {
    promptInput.value = button.dataset.prompt;
    promptInput.dispatchEvent(new Event('input'));
    promptInput.focus();
  });
});

document.querySelectorAll('#styleChoices .choice').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('#selectedStyle').value = button.dataset.value;
    document.querySelectorAll('#styleChoices .choice').forEach(choice => {
      const selected = choice === button;
      choice.classList.toggle('is-selected', selected);
      choice.setAttribute('aria-pressed', String(selected));
    });
  });
});

const formatSelect = form.elements.format;
const durationSelect = form.elements.duration;
const formatRatios = {
  'Vertical 9:16': '9:16',
  'Square 1:1': '1:1',
  'Landscape 16:9': '16:9'
};
formatSelect.addEventListener('change', () => {
  document.querySelector('#formatSummary').textContent = formatSelect.value;
});
durationSelect.addEventListener('change', () => {
  document.querySelector('#durationSummary').textContent = durationSelect.selectedOptions[0].textContent;
});

async function checkService() {
  try {
    const response = await fetch('/api/health');
    const data = await readApiResponse(response);
    serviceStatus.innerHTML = data.configured
      ? '<span aria-hidden="true">●</span> fal.ai key configured'
      : '<span aria-hidden="true">●</span> fal.ai key not configured yet';
    serviceStatus.classList.toggle('is-ready', data.configured);
  } catch (error) {
    serviceStatus.textContent = error.message;
  }
}

function setNotice(message, isError = false) {
  notice.textContent = message;
  notice.classList.toggle('is-error', isError);
}

function showVideo(videoUrl) {
  document.querySelector('.preview__download')?.remove();
  const video = document.createElement('video');
  video.className = 'preview__video';
  video.src = videoUrl;
  video.controls = true;
  video.autoplay = true;
  video.playsInline = true;
  previewCanvas.replaceChildren(video);

  const download = document.createElement('a');
  download.className = 'preview__download';
  download.href = videoUrl;
  download.target = '_blank';
  download.rel = 'noopener';
  download.textContent = 'Open or download video';
  serviceStatus.after(download);
}

function wait(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function pollVideo(requestId) {
  const timeoutAt = Date.now() + 10 * 60 * 1000;
  while (Date.now() < timeoutAt) {
    await wait(4000);
    const response = await fetch(`/api/videos/${encodeURIComponent(requestId)}`);
    const data = await readApiResponse(response);

    if (data.status === 'COMPLETED' && data.videoUrl) {
      showVideo(data.videoUrl);
      setNotice('Your video is ready. Preview it here or use the link to open and download it.');
      serviceStatus.innerHTML = '<span aria-hidden="true">●</span> Video ready';
      return;
    }
    if (data.status === 'FAILED') throw new Error(data.error || 'Video generation failed.');

    const queueText = data.queuePosition === null || data.queuePosition === undefined
      ? ''
      : ` Queue position: ${data.queuePosition}.`;
    setNotice(`Your video is ${data.status === 'IN_QUEUE' ? 'waiting in the queue' : 'being generated'}.${queueText}`);
  }
  throw new Error('Generation is taking longer than expected. Check back later or try again.');
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  submitButton.disabled = true;
  submitButton.textContent = 'Submitting…';
  setNotice('Sending your prompt to fal.ai. Generation may take a few minutes.');
  try {
    const response = await fetch('/api/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: promptInput.value,
        style: form.elements.namedItem('style').value,
        aspectRatio: formatRatios[formatSelect.value],
        durationFrames: Number(durationSelect.value)
      })
    });
    const data = await readApiResponse(response);
    serviceStatus.innerHTML = '<span aria-hidden="true">●</span> Connected to fal.ai';
    await pollVideo(data.requestId);
  } catch (error) {
    setNotice(error.message || 'Video generation failed. Please try again.', true);
    serviceStatus.innerHTML = '<span aria-hidden="true">●</span> Generation error';
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = '<span aria-hidden="true">✦</span> Create my video';
  }
});

checkService();
