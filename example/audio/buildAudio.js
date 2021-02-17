/* eslint-disable linebreak-style */
/* eslint-disable max-len */
const audiosprite = require('audiosprite');
const fs = require('fs');

function buildSiteFX() {
  const files = fs.readdirSync('siteFX');

  for (let i = 0; i < files.length; i++) {
    files[i] = `siteFX/${files[i]}`;
  }

  for (let m = 0; m < files.length; m++) {
    if (files[m].indexOf('.') < 0 || files[m].indexOf('DS_Store') > 0) {
      files.splice(m, 1);
      m--;
    }
  }

  console.log('FILES!!', files);

  const opts = {
    output: '../app/assets/audio/siteFX',
    bitrate: 96,
    samplerate: 44100,
    format: 'howler2'
  };

  audiosprite(files, opts, (err, obj) => {
    if (err) throw new Error(err);

    obj.src = obj.src.map((src) => src.replace('../app/', ''));

    fs.writeFile('../app/assets/audio/siteFX.js', `export default ${JSON.stringify(obj, null, 2)}`, (write_error) => {
      if (write_error) throw new Error(write_error);
      console.log('The file was saved!');
    });
  });
}

function buildMusicFiles() {
  const musicFiles = fs.readdirSync('music');

  for (let m = 0; m < musicFiles.length; m++) {
    if (musicFiles[m].indexOf('.') < 0 || musicFiles[m].indexOf('DS_Store') > 0) {
      musicFiles.splice(m, 1);
      m--;
    }
  }
  console.log(musicFiles);
  for (let m = 0; m < musicFiles.length; m++) {
    audiosprite(
      [`music/${musicFiles[m]}`],
      {
        output: `../app/assets/audio/${musicFiles[m].split('.')[0]}`,
        samplerate: 44100,
        bitrate: 192,
        gap: 0,
        channels: 2,
        ignorerounding: 1
      },
      (err) => {
        if (err) throw new Error(err);
        console.log('The file was saved!');
      }
    );
    audiosprite(
      [`music/${musicFiles[m]}`],
      {
        output: `../app/assets/audio/${musicFiles[m].split('.')[0]}_mono`,
        samplerate: 44100,
        bitrate: 192,
        gap: 0,
        channels: 1,
        ignorerounding: 1
      },
      (err) => {
        if (err) throw new Error(err);
        console.log('The file was saved!');
      }
    );
  }
}

buildSiteFX();
buildMusicFiles();
