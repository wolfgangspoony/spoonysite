(function () {
  const trackList = document.getElementById('trackList');
  if (!trackList) return;

  const tracks = Array.isArray(window.MIXTAPE_TRACKS) ? window.MIXTAPE_TRACKS : [];
  trackList.innerHTML = '';

  if (!tracks.length) {
    trackList.innerHTML = '<p class="mixtape-empty">No tracks configured yet. Edit <code>scripts/mixtape-tracks.js</code> to point at your Backblaze files.</p>';
    return;
  }

  tracks.forEach((track, index) => {
    const card = document.createElement('article');
    card.className = 'track-card';

    const header = document.createElement('div');
    header.className = 'track-headline';

    const number = document.createElement('span');
    number.className = 'track-number';
    number.textContent = String(index + 1).padStart(2, '0');

    const titleWrap = document.createElement('div');
    titleWrap.className = 'track-title-wrap';

    const title = document.createElement('h3');
    title.textContent = track.title || `Track ${index + 1}`;

    const duration = document.createElement('span');
    duration.className = 'track-duration';
    duration.textContent = track.duration || '';

    titleWrap.appendChild(title);
    if (track.duration) {
      titleWrap.appendChild(duration);
    }

    header.appendChild(number);
    header.appendChild(titleWrap);

    const desc = document.createElement('p');
    desc.className = 'track-description';
    desc.textContent = track.description || 'Add a description in scripts/mixtape-tracks.js';

    const status = document.createElement('span');
    status.className = 'track-status ' + (track.streamUrl ? 'online' : 'offline');
    status.textContent = track.streamUrl ? 'Streaming from Backblaze' : 'Missing Backblaze URL';

    const footer = document.createElement('div');
    footer.className = 'track-footer';

    if (track.downloadUrl) {
      const downloadLink = document.createElement('a');
      downloadLink.href = track.downloadUrl;
      downloadLink.target = '_blank';
      downloadLink.rel = 'noopener';
      downloadLink.className = 'download-link';
      downloadLink.textContent = 'Download from Backblaze';
      footer.appendChild(downloadLink);
    } else {
      const reminder = document.createElement('span');
      reminder.className = 'download-link disabled';
      reminder.textContent = 'Add a downloadUrl to enable downloads';
      footer.appendChild(reminder);
    }

    card.appendChild(header);
    card.appendChild(desc);
    card.appendChild(status);

    if (track.streamUrl) {
      const audio = document.createElement('audio');
      audio.controls = true;
      audio.preload = 'none';
      audio.dataset.trackTitle = track.title || `Track ${index + 1}`;
      audio.src = track.streamUrl;
      card.appendChild(audio);
    } else {
      const placeholder = document.createElement('div');
      placeholder.className = 'track-placeholder';
      placeholder.textContent = 'Add a streamUrl in scripts/mixtape-tracks.js to enable playback.';
      card.appendChild(placeholder);
    }
    card.appendChild(footer);

    trackList.appendChild(card);
  });
})();
