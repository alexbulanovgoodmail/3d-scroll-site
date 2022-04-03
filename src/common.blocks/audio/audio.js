const soundbutton = document.querySelector('.soundbutton');
const audio = document.querySelector('.audio');

soundbutton.addEventListener('click', () => {
  soundbutton.classList.toggle('paused');
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});

window.onfocus = () => {
  if (soundbutton.classList.contains('paused')) {
    audio.pause();
  } else {
    audio.play();
  }
};

window.onblur = () => {
  audio.pause();
};
