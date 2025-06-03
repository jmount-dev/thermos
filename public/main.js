const loadBtn = document.getElementById('load');
const urlInput = document.getElementById('url');
const contentDiv = document.getElementById('content');
const originalToggle = document.getElementById('original');
const darkToggle = document.getElementById('dark');

loadBtn.addEventListener('click', async () => {
  const url = urlInput.value.trim();
  if (!url) return;
  const resp = await fetch(`/fetch?url=${encodeURIComponent(url)}`);
  const data = await resp.json();
  document.title = data.title;
  contentDiv.innerHTML = data.content;
});

originalToggle.addEventListener('change', () => {
  const url = urlInput.value.trim();
  if (!url) return;
  if (originalToggle.checked) {
    window.open(url, '_blank');
    originalToggle.checked = false;
  }
});

darkToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark', darkToggle.checked);
});
