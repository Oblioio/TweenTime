import { Howl, Howler } from 'howler';
// import portraitsFX from '../../../assets/audio/portraitsFX';
// import homeFX from '../../../assets/audio/homeFX';
import siteFX from '../../../assets/audio/siteFX';

let initialized = false;
let portraitsIndex = 0;
let homeIndex = 0;
let siteIndex = 0;
let currentSound = null;
let muted = false;
let paused = false;

const portraitsFXPool = [];
const homeFXPool = [];
const siteFXPool = [];
const sounds = {};
const numObjs = 5;

// Howler global settings
Howler.mobileAutoEnable = true;

const sfx = {
  init() {
  },
  loadFX(section) {
    if (initialized) return;
    initialized = true;

    switch (section) {
      case 'portraits':
        portraitsFXPool[0] = new Howl(portraitsFX);
        portraitsFXPool[0].preload = true;
        break;
      case 'home':
        homeFXPool[1] = new Howl(homeFX);
        homeFXPool[1].preload = true;
        break;
      case 'site':
        siteFXPool[1] = new Howl(siteFX);
        siteFXPool[1].preload = true;
        break;
      default:
        console.log('Wrong section, no FX!');
    }
  },
  getDuration(id) {
    return new Promise((resolve) => {
      if (!sounds[id]) {
        this.loadSound(id)
          .then(() => this.getDuration(id))
          .then((duration) => {
            resolve(duration);
          });
      } else {
        resolve(sounds[id].duration());
      }
    });
  },
  loadSound(id, loop = true) {
    return new Promise((resolve) => {
      const urls = [
        `/assets/audio/${id}.ogg`,
        `/assets/audio/${id}.m4a`,
        `/assets/audio/${id}.mp3`,
        `/assets/audio/${id}.ac3`
      ];
      sounds[id] = new Howl({
        src: urls,
        preload: true,
        loop,
        onload: () => {
          console.log('ON LOAD?');
          resolve();
        }
      });
      sounds[id].id = id;
    });
  },
  getSound(id) {
    return sounds[id];
  },
  playFx(id, section = 'portraits') {
    if (!initialized) return;

    let fxPool;
    let fxIndex;
    let fxInfo;
    let volume = 1;

    switch (section) {
      case 'portraits':
        fxPool = portraitsFXPool;
        fxIndex = (portraitsIndex + 1) % numObjs;
        fxInfo = portraitsFX;
        volume = 1;
        break;
      case 'home':
        fxPool = homeFXPool;
        fxIndex = (homeIndex + 1) % numObjs;
        fxInfo = homeFX;
        volume = 0.4;
        break;
      case 'site':
        fxPool = siteFXPool;
        fxIndex = (siteIndex + 1) % numObjs;
        fxInfo = siteFX;
        volume = 1;
        break;
      default:
        console.log('Wrong section, no FX!');
    }

    if (!fxPool[fxIndex]) {
      fxPool[fxIndex] = new Howl(fxInfo);
    }

    fxPool[fxIndex].volume(volume);
    fxPool[fxIndex].play(id);
  },
  fadeInSound(id, volume = 1) {
    console.log(this);
    if (!sounds[id]) {
      if (currentSound) currentSound.stop();
      this.loadSound(id);
    }

    currentSound = sounds[id];
    sounds[id].fade(0, volume, 500);

    currentSound.play();
    return currentSound;
  },
  playSound(id, seek = 0) {
    if (!sounds[id]) {
      if (currentSound) currentSound.stop();
      this.loadSound(id);
    }
    currentSound = sounds[id];
    console.log(seek);
    currentSound.seek(seek);
    currentSound.play();
    return currentSound;
  },
  stopSound(id) {
    if (sounds[id]) {
      sounds[id].stop();
    } else if (currentSound) {
      currentSound.stop();
    }
  },
  mute(bool) {
    muted = bool;
    Howler.mute(muted || paused);
  },
  setVolume(id, volume, section = 'portraits') {
    let fxPool;
    let fxIndex;
    let fxInfo;

    switch (section) {
      case 'portraits':
        fxPool = portraitsFXPool;
        fxIndex = portraitsIndex % numObjs;
        fxInfo = portraitsFX;
        break;
      case 'home':
        fxPool = homeFXPool;
        fxIndex = homeIndex % numObjs;
        fxInfo = homeFX;
        break;
      case 'site':
        fxPool = siteFXPool;
        fxIndex = siteIndex % numObjs;
        fxInfo = siteFX;
        break;
      default:
        console.log('Wrong section, no FX!');
    }

    if (!fxPool[fxIndex]) {
      fxPool[fxIndex] = new Howl(fxInfo);
    }

    fxPool[fxIndex].volume(volume, id);
  },
  pause(bool) {
    paused = bool;
    this.mute(muted);
  }
};

window.sfx = sfx;

export default sfx;
