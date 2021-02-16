/* eslint-disable linebreak-style */
/* eslint-disable max-len */

// import 'core-js/features/symbol';
// import 'core-js/features/promise';
// import 'regenerator-runtime';

// import $ from 'jquery';
import Core from './tweentime/Core';
import Editor from './tweentime/Editor';
import app from './app/global';
import gsap from 'gsap';

app.verbose = true;
app.debug = window.location.hash === '#debug';

function siteIsIn() {
  console.log('SITE IS IN');
  var data = [
    {
      "id": "box",
      "type": "box",
      "label": "Box 1",
      "start": 0,
      "end": 4.0,
      "properties": [
        {
          "name": "x",
          "keys": [
            {
              "time": 0,
              "val": 0
            },
            {
              "time": 2,
              "val": 100,
              "ease": "Quart.easeInOut"
            }
          ],
          "val": 0
        },
        {
          "name": "y",
          "keys": [
            {
              "time": 0,
              "val": 0,
              "ease": "Quad.easeOut"
            },
            {
              "time": 0.9870000000000003,
              "val": 50,
              "ease": "Cubic.easeInOut"
            },
            {
              "time": 2.006,
              "val": 0,
              "ease": "Quad.easeInOut"
            }
          ],
          "val": 0
        },
        {
          "name": "opacity",
          "keys": [
            {
              "time": 1.214,
              "val": 1
            },
            {
              "time": 3.98,
              "val": 0,
              "ease": "Quad.easeOut"
            }
          ],
          "val": 1,
          "min": 0,
          "max": 1
        }
      ]
    },
    {
      "id": "box2",
      "type": "box",
      "label": "Box 2",
      "start": 0,
      "end": 4.3,
      "collapsed": true,
      "properties": [
        {
          "name": "x",
          "keys": [
            {
              "time": 0,
              "val": 100
            },
            {
              "time": 0.1,
              "val": 200,
              "ease": "Quart.easeInOut"
            }
          ],
          "val": 0
        },
        {
          "name": "x",
          "keys": [
            {
              "time": 0.1,
              "val": 0
            },
            {
              "time": 2,
              "val": 300,
              "ease": "Quart.easeInOut"
            }
          ],
          "val": 0
        },
        {
          "name": "y",
          "keys": [
            {
              "time": 0,
              "val": 0,
              "ease": "Quad.easeOut"
            },
            {
              "time": 0.9870000000000003,
              "val": 50,
              "ease": "Cubic.easeInOut"
            },
            {
              "time": 2.006,
              "val": 0,
              "ease": "Quad.easeInOut"
            }
          ],
          "val": 0
        },
        {
          "name": "opacity",
          "keys": [
            {
              "time": 1.214,
              "val": 1
            },
            {
              "time": 4.2,
              "val": 0,
              "ease": "Quad.easeOut"
            }
          ],
          "val": 1,
          "min": 0,
          "max": 1
        }
      ]
    }
  ];

  var tweenTime = new Core(data);
  var editor = new Editor(tweenTime);

  var box_values = tweenTime.getValues('box');
  var box2_values = tweenTime.getValues('box2');

  function animate() {
    gsap.set('.box--blue', { alpha: box_values.opacity, x: `${box_values.x}px`, y: `${box_values.y}px` });
    gsap.set('.box--red', { alpha: box2_values.opacity, x: `${box2_values.x}px`, y: `${box2_values.y}px` });
    // $('.box--blue').css({
    //   'opacity': box_values.opacity,
    //   'transform': 'translate(' + box_values.x + 'px, ' + box_values.y + 'px)'
    // });

    // $('.box--red').css({
    //   'opacity': box2_values.opacity,
    //   'transform': 'translate(' + box2_values.x + 'px, ' + box2_values.y + 'px)'
    // });

    window.requestAnimationFrame(animate);
  }

  // tweenTime.timer.play();
  animate();

  window.thetimer = tweenTime.timer;
}

function init() {
  siteIsIn();
}

function Main() {
  init();
}

window.addEventListener('load', () => {
  app.main = new Main();
});