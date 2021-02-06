/* eslint-disable linebreak-style */
/* eslint-disable max-len */

// import 'core-js/features/symbol';
// import 'core-js/features/promise';
// import 'regenerator-runtime';

import $ from 'jquery';
import Core from './scripts/Core';
import Editor from './scripts/Editor';
import app from './app/global';

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
  // var data = [
  //   {
  //     "id": "box",
  //     "type": "box",
  //     "label": "Box 1",
  //     "start": 0,
  //     "end": 4,
  //     "properties": [
  //       {
  //         "name": "x",
  //         "keys": [
  //           {
  //             "time": 0,
  //             "val": 0
  //           },
  //           {
  //             "time": 2,
  //             "val": 100,
  //             "ease": "Quart.easeInOut"
  //           }
  //         ],
  //         "val": 0
  //       },
  //       {
  //         "name": "y",
  //         "keys": [
  //           {
  //             "time": 0,
  //             "val": 0,
  //             "ease": "Quad.easeOut"
  //           },
  //           {
  //             "time": 0.9870000000000003,
  //             "val": 50,
  //             "ease": [
  //               0.14184397163120563,
  //               0.9105263157894737,
  //               0.6271529888551163,
  //               1.1105263157894736
  //             ]
  //           },
  //           {
  //             "time": 2.006,
  //             "val": 0,
  //             "ease": [
  //               0.9254170755642788,
  //               0.3157894736842105,
  //               0.2051030421982333,
  //               0.9473684210526315
  //             ]
  //           }
  //         ],
  //         "val": 0
  //       },
  //       {
  //         "name": "opacity",
  //         "keys": [
  //           {
  //             "time": 1.214,
  //             "val": 1
  //           },
  //           {
  //             "time": 3.98,
  //             "val": 0,
  //             "ease": "Quad.easeOut"
  //           }
  //         ],
  //         "val": 1,
  //         "min": 0,
  //         "max": 1
  //       }
  //     ],
  //     "values": {
  //       "x": 0,
  //       "y": 0,
  //       "opacity": 1
  //     }
  //   },
  //   {
  //     "id": "box2",
  //     "type": "box",
  //     "label": "Box 2",
  //     "start": 0,
  //     "end": 4.3,
  //     "collapsed": true,
  //     "properties": [
  //       {
  //         "name": "x",
  //         "keys": [
  //           {
  //             "time": 0,
  //             "val": 0
  //           },
  //           {
  //             "time": 2,
  //             "val": 300,
  //             "ease": "Quart.easeInOut"
  //           }
  //         ],
  //         "val": 0
  //       },
  //       {
  //         "name": "y",
  //         "keys": [
  //           {
  //             "time": 0,
  //             "val": 0,
  //             "ease": "Quad.easeOut"
  //           },
  //           {
  //             "time": 0.9870000000000003,
  //             "val": 50,
  //             "ease": "Cubic.easeInOut"
  //           },
  //           {
  //             "time": 2.006,
  //             "val": 0,
  //             "ease": "Quad.easeInOut"
  //           }
  //         ],
  //         "val": 0
  //       },
  //       {
  //         "name": "opacity",
  //         "keys": [
  //           {
  //             "time": 1.214,
  //             "val": 1
  //           },
  //           {
  //             "time": 4.2,
  //             "val": 0,
  //             "ease": "Quad.easeOut"
  //           }
  //         ],
  //         "val": 1,
  //         "min": 0,
  //         "max": 1
  //       }
  //     ],
  //     "values": {
  //       "x": 0,
  //       "y": 0,
  //       "opacity": 1
  //     }
  //   }
  // ];

  var tweenTime = new Core(data);
  var editor = new Editor(tweenTime);

  var box_values = tweenTime.getValues('box');
  var box2_values = tweenTime.getValues('box2');

  function animate() {
    $('.box--blue').css({
      'opacity': box_values.opacity,
      'transform': 'translate(' + box_values.x + 'px, ' + box_values.y + 'px)'
    });

    $('.box--red').css({
      'opacity': box2_values.opacity,
      'transform': 'translate(' + box2_values.x + 'px, ' + box2_values.y + 'px)'
    });

    window.requestAnimationFrame(animate);
  }

  animate();
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