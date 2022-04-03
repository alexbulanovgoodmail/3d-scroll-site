const zSpacing = -1000;
const frames = Array.from(document.getElementsByClassName('frame'));
const zVals = [];
let lastPos = zSpacing / 5;

window.onscroll = () => {
  const top = document.documentElement.scrollTop;
  const delta = lastPos - top;

  lastPos = top;

  frames.forEach((n, i) => {
    zVals.push(i * zSpacing + zSpacing); // eslint-disable-line
    zVals[i] += delta * -5.5;
    const frame = frames[i];
    const transform = `translateZ(${zVals[i]}px)`;
    const opacity = zVals[i] < Math.abs(zSpacing) / 1.8 ? 1 : 0;
    frame.setAttribute('style', `transform: ${transform}; opacity: ${opacity}`);
  });
};

window.scrollTo(0, 1);
