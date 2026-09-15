const placeholder = '/public/media-unavailable.svg';
// Capture handles errors from dynamically rendered images, including lazy images.
document.addEventListener('error', event => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement) || image.dataset.fallback) return;
  image.dataset.fallback = 'true';
  image.src = placeholder;
  image.alt = 'Demonstração indisponível. Consulte a fonte do exercício.';
  image.closest('.media')?.classList.remove('missing');
}, true);
