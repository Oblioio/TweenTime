/* eslint-disable max-len */
import {
  gsap
} from 'gsap/all';

function CircleLoader() {
  this.id = 'CircleLoader';

  this.elem = document.getElementById('circle_loader');
  this.progressCircle = document.getElementById('loader_circle');

  this.circ = this.progressCircle.querySelector('circle');
}

function init(callback) {
  callback();
}

function goOut() {
  return new Promise((resolve) => {
    const tl = gsap.timeline({
      paused: true,
      onComplete: () => {
        this.elem.parentElement.removeChild(this.elem);
        resolve();
      }
    });

    const prog = {
      offset: 628
    };

    tl.to(prog, 1, { offset: 942, ease: 'power4.inOut', onUpdate: () => {
      this.circ.style.strokeDashoffset = prog.offset;
    } }, 0);
    // tl.fromTo('#landing .bg', { scale: 1, duration: 0.4 }, { scale: 1.1, duration: 0.75, ease: 'power3.easeOut' }, 0);
    // tl.fromTo('#landing .content', { scale: 0.85, duration: 0.4 }, { scale: 1, duration: 0.75, ease: 'power3.easeOut' }, 0);
    tl.play();

    // sfx.playFx('sx_jj_site_load_ticker_stereo', 'site');

    // // this.elem.classList.remove('show');
    // // this.elem.classList.add('hide');
    // window.setTimeout(() => {
    //   resolve();
    // }, 500);
  });
}

function bringIn(isIn) {
  this.elem.classList.add('show');
  window.setTimeout(() => {
    isIn();
  }, 500);
}

function onProgress(perc) {
  this.circ.style.strokeDashoffset = ((1 + perc) * (Math.PI * 100));
  return perc >= 1;
}

function resize() {}

CircleLoader.prototype.resize = resize;
CircleLoader.prototype.onProgress = onProgress;
CircleLoader.prototype.goOut = goOut;
CircleLoader.prototype.bringIn = bringIn;
CircleLoader.prototype.init = init;

export default CircleLoader;
