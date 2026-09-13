const video = document.getElementById('heroVideo');
const playBtn = document.getElementById('playBtn');
const muteBtn = document.getElementById('muteBtn');
const likeBtn = document.getElementById('likeBtn');
const fsBtn = document.getElementById('fsBtn');
const progress = document.getElementById('progress');
const progressBar = document.getElementById('progressBar');
const toast = document.getElementById('toast');

// Friendly helper
const showToast = (msg) => { toast.textContent = msg; toast.classList.add('show'); clearTimeout(toast._t); toast._t = setTimeout(()=>toast.classList.remove('show'),1500); }

// Play / Pause
playBtn.addEventListener('click', ()=>{
  if(video.paused){ video.play(); playBtn.textContent='Pause'; showToast('Playing'); }
  else{ video.pause(); playBtn.textContent='Play'; showToast('Paused'); }
});

// Mute / Unmute
muteBtn.addEventListener('click', ()=>{
  video.muted = !video.muted;
  muteBtn.textContent = video.muted ? 'Unmute' : 'Mute';
  showToast(video.muted ? 'Muted' : 'Sound on');
});

// Like animation
likeBtn.addEventListener('click', ()=>{
  const liked = likeBtn.classList.toggle('liked');
  likeBtn.setAttribute('aria-pressed', liked);
  showToast(liked ? 'Liked' : 'Unliked');
});

// Fullscreen
fsBtn.addEventListener('click', async ()=>{
  try{
    if(!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  }catch(e){console.warn(e)}
});

// Progress update
video.addEventListener('timeupdate', ()=>{
  const pct = (video.currentTime / (video.duration || 1)) * 100;
  progressBar.style.width = pct + '%';
});

// Seek by clicking progress bar
progress.addEventListener('click', (e)=>{
  const rect = progress.getBoundingClientRect();
  const x = e.clientX - rect.left; const pct = x / rect.width;
  video.currentTime = pct * (video.duration || 0);
});

// Keyboard shortcuts
window.addEventListener('keydown', (e)=>{
  if(e.code === 'Space'){ e.preventDefault(); playBtn.click(); }
  if(e.code === 'KeyM'){ muteBtn.click(); }
  if(e.code === 'KeyL'){ likeBtn.click(); }
});

// Show a short loading toast when metadata loads
video.addEventListener('loadedmetadata', ()=>{
  showToast('Ready — press Play');
});

// Make controls smarter for autoplay policies: if browser blocks autoplay, show a notice
video.addEventListener('play', ()=>{ playBtn.textContent='Pause'; });
video.addEventListener('pause', ()=>{ playBtn.textContent='Play'; });

// If the video fails to load, show message
video.addEventListener('error', ()=>{ showToast('Video failed to load. Place your file at assets/video.mp4 or update the <video> src.'); });

// Small accessibility: focus outlines
[playBtn, muteBtn, likeBtn, fsBtn].forEach(b => b.addEventListener('focus', ()=> b.style.outline='2px solid rgba(110,231,183,0.22)'));
[playBtn, muteBtn, likeBtn, fsBtn].forEach(b => b.addEventListener('blur', ()=> b.style.outline=''));
