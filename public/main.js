const loadBtn = document.getElementById('load');
const urlInput = document.getElementById('url');
const readerDiv = document.getElementById('readerContent');
const iframe = document.getElementById('originalFrame');
const originalToggle = document.getElementById('original');
const darkToggle = document.getElementById('dark');
const spinner = document.getElementById('spinner');

loadBtn.addEventListener('click', async () => {
  const url = urlInput.value.trim();
  if (!url) return;
  readerDiv.innerHTML = '';
  iframe.src = '';
  spinner.style.display = 'block';
  originalToggle.checked = false;
  readerDiv.style.display = 'block';
  iframe.style.display = 'none';
  try {
    const resp = await fetch(`/fetch?url=${encodeURIComponent(url)}`);
    const data = await resp.json();
    spinner.style.display = 'none';
    if (data.error) {
      readerDiv.textContent = data.error;
      document.title = 'Thermos Reader';
    } else {
      document.title = data.title;
      readerDiv.innerHTML = data.content || '';
      iframe.src = url;
    }
  } catch (err) {
    spinner.style.display = 'none';
    readerDiv.textContent = 'Failed to load';
  }
});

originalToggle.addEventListener('change', () => {
  const showOriginal = originalToggle.checked;
  readerDiv.style.display = showOriginal ? 'none' : 'block';
  iframe.style.display = showOriginal ? 'block' : 'none';
});

darkToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark', darkToggle.checked);
});
