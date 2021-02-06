import {
  gsap
} from 'gsap/all';

import CircleLoader from './CircleLoader';

const loaderUI = new CircleLoader();

let perc = 0;
let instance;
let tweenProgress = 0;
let raf;
let images_to_load;
let images_loaded = 0;

function Preloader() {}

/**
 * Call bringIn function on current loaderUI object if exists
 * else animate it in using a default tween
 */
function bringIn() {
  return new Promise((resolve) => {
    perc = 0;

    loaderUI.bringIn(() => resolve());
  });
}

/**
 * Start loop that tracks load progress
 */
function startTracking() {
  return new Promise((resolve) => {
    /**
     * Get percentage, pass it to loaderUI
     */
    const track = () => {
      raf = window.requestAnimationFrame(track);

      let newPerc = images_loaded / images_to_load.length;

      if (Number.isNaN(newPerc) || !Number.isFinite(newPerc)) newPerc = 1;

      newPerc = perc + (Math.ceil((10 * (newPerc - perc)) / 0.2) / 1000);

      perc = Math.min(tweenProgress, newPerc);

      loaderUI.onProgress(perc);

      if (perc >= 1) {
        window.cancelAnimationFrame(raf);
        // resolve();
        goOut().then(() => isOut(resolve));
      }
    };

    raf = window.requestAnimationFrame(track);

    const t_obj = {
      t: 0
    };

    gsap.to(t_obj, 1.5, {
      t: 1,
      ease: 'power3.inOut',
      onUpdate: () => {
        tweenProgress = t_obj.t;
      }
    });
  });
}

/**
 * Animate out loader
 */
function goOut() {
  return new Promise((resolve) => {
    loaderUI.goOut().then(() => resolve());
  });
}

/**
 * Called when loader has finished animating out
 */
function isOut(callback) {
  if (callback) callback();
}

function load(images, callback) {
  console.log('LOAD', images, callback);

  images_loaded = 0;
  images_to_load = images;

  const onload = () => {
    images_loaded++;
  };

  for (let i = 0; i < images_to_load.length; i++) {
    const src = images_to_load[i];
    const img = new Image();
    img.addEventListener('load', onload);
    img.src = src;
  }

  bringIn().then(() => startTracking()).then(() => callback());
  // callback();
}

Preloader.prototype.load = load;

const preloader = {
  getInstance: () => {
    instance = instance || new Preloader();
    return instance;
  }
};

export { preloader as default };
