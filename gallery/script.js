const galleryItems = document.querySelectorAll('.gallery-item');
const videoOverlay = document.getElementById('videoOverlay');
const videoPlayer = document.getElementById('videoPlayer');
const closeBtn = document.getElementById('closeBtn');

// galleryItems.forEach(item => {
//     item.addEventListener('click', () => {
//         const videoSrc = item.getAttribute('data-video-src');
//         videoPlayer.src = videoSrc;
//         videoOverlay.classList.add('active');
//     });
// });

// closeBtn.addEventListener('click', () => {
//     videoOverlay.classList.remove('active');
//     videoPlayer.pause();
//     videoPlayer.src = "";
// });

//  // Close video player on pressing Escape key
//  document.addEventListener('keydown', (e) => {
//      if (e.key === 'Escape' && videoOverlay.classList.contains('active')) {
//          videoOverlay.classList.remove('active');
//          videoPlayer.pause();
//          videoPlayer.src = "";
//      }
//  });