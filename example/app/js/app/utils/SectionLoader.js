import loadScript from './loadScript';
import ArrayExecutor from './ArrayExecutor';

let instance;
let preload_images = true;
let filesLoadedCallback;

const arrayExecutor = ArrayExecutor(null, 'SectionLoader');
const app = window.jinglejangle;
const sectionLoaderState = {
  sections: [],
  currentlyLoadingIDs: [],
  filesToLoad: [],
  filesLoaded: 0,
  loader: null,
  loadedUrls: {},
  files: {},
};

/**
 * Loads a file, calls callback once file is loaded
 * or immediately if file is already loaded and saved in sectionLoaderState
 *
 * @param  {string} url Path to file to load
 * @param  {function} callback
 */
function loadFile(url, callback) {
  console.log(url);
  if (sectionLoaderState.files[url]) {
    callback(sectionLoaderState.files[url]);
  } else {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onreadystatechange = () => {
      switch (xhr.readyState) {
        case 0: // UNSENT
          // console.log('UNSENT', e.status, e.responseText);
          break;
        case 1: // OPENED
          // console.log('OPENED', e.status, e.responseText);
          break;
        case 2: // HEADERS_RECEIVED
          // console.log('HEADERS_RECEIVED', e.status, e.responseText);
          break;
        case 3: // LOADING
          // console.log('LOADING', e.status, e.responseText);
          break;
        case 4: // DONE
          if (xhr.status === 200) {
            sectionLoaderState.files[url] = xhr.responseText;
            callback(xhr.responseText);
          }
          break;
        default:
      }
    };
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send();
  }
}

/**
 * Loads the localization json file, parses it, and
 * saves it to the app namespace
 *
 * @param  {string} url
 * @param  {function} completeFn
 */
function loadJSON(url, completeFn) {
  loadFile.call(this, url, (d) => {
    let data = d;

    // this strips out line returns so that multiline strings in the JSON will parse correctly
    if (typeof data === 'object') {
      data = JSON.stringify(data);
    }

    data = data.replace(/(\r\n|\n|\r)/gm, '');
    data = data.replace(/\t/g, '');

    const parsedJSON = JSON.parse(String(data));

    app.dataSrc = parsedJSON;
    this.localizationJSON = parsedJSON;

    this.setupWidgets.call(this);

    if (completeFn) completeFn('Load JSON complete');
  });
}

/**
 * Loops through widgets declared in the localization json and
 * adds them to the sectionloader
 */
function setupWidgets() {
  Object.keys(app.dataSrc.widgets).forEach((widget_name) => {
    const widget_obj = app.dataSrc.widgets[widget_name];

    if (widget_obj.visible !== 'false') this.addSection(widget_name, widget_obj);
  });
}

/**
 * Returns section object with id that matches passed id
 *
 * @param  {string} id
 * @returns {Object}
 */
function returnSectionOBJ(id) {
  let numSections = sectionLoaderState.sections.length;

  while (numSections--) {
    if (sectionLoaderState.sections[numSections].id === id) {
      return sectionLoaderState.sections[numSections];
    }
  }

  throw new Error(`No section with id: ${id}`);
}

/**
 * @param  {Object} loaderObj
 */
function addLoaderUI(loaderObj) {
  if (app.verbose) console.log(`SectionLoader | addLoaderUI: ${loaderObj}`);
  sectionLoaderState.loader = loaderObj;
}

/**
 * Adds files to preload for section with id of section_id
 *
 * @param  {string} section_id
 * @param  {Array|string} files
 */
function addFiles(section_id, files) {
  const sectionOBJ = returnSectionOBJ(section_id);
  sectionOBJ.files = sectionOBJ.files || [];

  if (typeof files === 'string') {
    sectionOBJ.files.push(files);
  } else {
    sectionOBJ.files = sectionOBJ.files.concat(files);
  }
}

/**
 * Check to see if section exists
 *
 * @param  {string} id
 * @returns {boolean}
 */
function sectionExists(id) {
  return sectionLoaderState.sections.filter((section) => section.id === id).length > 0;
}

/**
 * Add section to sectionloader
 *
 * @param  {string} id
 * @param  {Object} d
 */
function addSection(id, d) {
  const data = d;

  if (sectionExists(id)) throw new Error(`SectionLoader | addSection: section id ${id} already exists`);

  if (instance.verbose) console.log(`SectionLoader | addSection: ${id}`);

  data.data = data.data || {};

  const sectionObj = {
    id,
    data: data.data,
    loaded: false,
  };

  if (data.widgets) {
    sectionObj.widgets = data.widgets;
  }

  if (data.files) {
    sectionObj.files = sectionObj.files || [];
    sectionObj.files = sectionObj.files.concat(data.files);
  }

  sectionLoaderState.sections.push(sectionObj);
}

/**
 * Load sections passed as list of section ids
 *
 * @param  {...*} ...a – List of section ids plus resolve and reject fns passed via arrayexecutor
 */
function loadSection(...a) {
  let args = a;

  if (app.verbose) console.log('SectionLoader | this.loadSection:', args);

  // the last 2 args are reject and resolve functions
  args.pop(); // pop the reject function
  const callback = args.pop();

  if (args === undefined || args === null) throw new Error('SectionLoader | this.loadSection: input not valid');

  // if 'all' is passed instead of a list of section ids, load all sections
  if (args.length === 1 && args[0] === 'all') {
    args = sectionLoaderState.sections.map((section) => section.id);
  }

  // add a call to initScrape for each section to the array executor
  const function_arr = args.reduce((arr, sectionName) => {
    if (sectionExists(sectionName)) {
      arr.push({ scope: this, fn: this.initScrape, vars: [sectionName] });
    }

    return arr;
  }, []);

  function_arr.push({ scope: this, fn: this.loadFiles, vars: null });

  if (callback) {
    function_arr.push({ fn: callback, vars: null });
  }

  arrayExecutor.execute(function_arr);
}

/**
 * @param  {string} id
 */
function getSectionData(id) {
  const data = returnSectionOBJ(id);

  return sectionLoaderState.sections.filter((section) => section.id === id)
    .reduce((o, section) => {
      const obj = o;
      section.partials.reduce((partialsObj, partialName) => {
        const partial = returnSectionOBJ(partialName);
        obj.data[partialName] = partial.data;
        return partialsObj;
      }, {});
      obj.template = id;
      obj.partials = section.partials;

      return obj;
    }, data);
}


/**
 * Recursively get all of the object's child widgets
 *
 * @param  {Object} sectionObj
 * @return {Array} Array of sectionObj child widgets as section objects
 */
function getWidgets(sectionObj) {
  const widgetNames = sectionObj.widgets;
  const partials = [];

  if (!widgetNames || widgetNames.length === 0) return [];

  let widget;
  for (let i = widgetNames.length - 1; i >= 0; i--) {
    widget = returnSectionOBJ(widgetNames[i]);
    if (widget) {
      if (partials.indexOf(widgetNames[i]) === -1) partials.push(widgetNames[i]);

      const childWidgets = getWidgets(widget);

      for (let j = childWidgets.length - 1; j >= 0; j--) {
        if (partials.indexOf(childWidgets[j]) === -1) partials.push(childWidgets[j]);
      }
    }
  }

  return partials;
}

/**
 * Scrape section's html for files to preload
 *
 * @param  {string} id
 * @param {function} resolve
 * @param {function} reject
 */
function initScrape(id, resolve, reject) {
  let sectionOBJ = returnSectionOBJ(id);

  // confirm sectionOBJ was found
  if (sectionOBJ === undefined) reject(`SectionLoader | this.loadSection: section id ${id} not found`);

  // check if section is already loaded
  if (sectionOBJ.loaded === true) {
    if (app.verbose) console.log(`SectionLoader | this.loadSection: ${id} is already loaded`);
    reject(true);
    return;
  }

  sectionLoaderState.currentlyLoadingIDs.push(sectionOBJ.id);

  // ////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////

  // sectionOBJ.partials = getWidgets(sectionOBJ);
  // sectionOBJ.template = id;

  // const partials = {};

  // if (sectionOBJ.partials) {
  //   for (let i = sectionOBJ.partials.length - 1; i >= 0; i--) {
  //     partials[sectionOBJ.partials[i]] = app.templates[sectionOBJ.partials[i]];
  //   }
  // }

  // sectionOBJ = getSectionData(id);
  // const template = app.templates[id];

  // if (template) sectionOBJ.html = template.render(sectionOBJ.data, partials);

  // if (preload_images) {
  //   // preload images from html
  //   const img_pattern = /<img [^>]*src="([^"]+)"[^>]*>/g;
  //   const files = [];
  //   let results = img_pattern.exec(sectionOBJ.html);

  //   while (results !== null) {
  //     files.push(results[1]);
  //     results = img_pattern.exec(sectionOBJ.html);
  //   }

  //   addFiles(id, files);
  // }

  // ////////////////////////////////////////////////////////////////////
  // ////////////////////////////////////////////////////////////////////

  if (sectionOBJ.files) {
    sectionLoaderState.filesToLoad = sectionLoaderState.filesToLoad.concat(sectionOBJ.files);
  }

  resolve();
}

/**
 * Check if file has already been loaded
 *
 * @param  {string} fileURL
 */
function isDuplicate(fileURL) {
  let numImages = sectionLoaderState.imagesToLoad.length;
  while (numImages--) {
    if (sectionLoaderState.imagesToLoad[numImages].url === fileURL) {
      return true;
    }
  }

  let numMisc = sectionLoaderState.miscToLoad.length;
  while (numMisc--) {
    if (sectionLoaderState.miscToLoad[numMisc].url === fileURL) {
      return true;
    }
  }

  return false;
}

/**
 * @param  {string} url
 * @param  {function} callback
 */
function loadImage(url, callback) {
  console.log(url);

  if (sectionLoaderState.loadedUrls[url]) {
    if (callback) callback();
    return;
  }
  if (app.verbose) console.log(`SectionLoader | load image: ${url}`);

  sectionLoaderState.loadedUrls[url] = url;
  const newImage = new Image();

  newImage.addEventListener('load', () => {
    if (app.verbose) console.log(`SectionLoader | image Loaded: ${url}`);
    if (callback) callback();
  });

  newImage.addEventListener('error', this.fileError);
  // newImage.addEventListener('error', () => {
  //   if (callback) callback();
  // });

  newImage.src = url;
}

/**
 * Called when all sections are loaded
 */
function complete() {
  if (app.verbose) console.log('SectionLoader | complete: ');

  let numSectionsLoaded = sectionLoaderState.currentlyLoadingIDs.length;
  while (numSectionsLoaded--) {
    const sectionID = sectionLoaderState.currentlyLoadingIDs[numSectionsLoaded];
    const sectionOBJ = returnSectionOBJ(sectionID);
    sectionOBJ.loaded = true;
  }

  sectionLoaderState.currentlyLoadingIDs = [];
  sectionLoaderState.filesToLoad = [];
  sectionLoaderState.filesLoaded = 0;

  if (sectionLoaderState.loader && !sectionLoaderState.loader.finished) {
    sectionLoaderState.loader.complete(filesLoadedCallback);
  } else {
    filesLoadedCallback();
  }
}

/**
 * Check if all sections have loaded
 */
function checkComplete() {
  if (sectionLoaderState.filesLoaded >= sectionLoaderState.filesToLoad.length) complete();
}

/**
 * Returns a fileLoadComplete function for passed url
 * When the file loads, the url is added to the loaded files object
 *
 * @param  {string} url
 * @return {function} A fileLoadComplete function
 */
function fileLoadComplete(url) {
  return (data) => {
    if (data) sectionLoaderState.files[url] = data;
    sectionLoaderState.filesLoaded++;
    checkComplete();
  };
}

/**
 * @param  {function} resolve
 * @param  {function} reject
 */
function loadFiles(resolve) {
  filesLoadedCallback = resolve;

  if (sectionLoaderState.filesToLoad.length < 1) {
    this.complete();
    if (app.settings.prepreloader && app.settings.prepreloader.goOut) {
      app.settings.prepreloader.goOut();
    }
    return;
  }

  let i = sectionLoaderState.filesToLoad.length;
  const { filesToLoad } = sectionLoaderState;

  const startload = () => {
    while (i--) {
      const url = filesToLoad[i];

      if (url.indexOf('.gif') > 0 || url.indexOf('.jpg') > 0 || url.indexOf('.jpeg') > 0 || url.indexOf('.png') > 0) {
        loadImage.call(this, url, fileLoadComplete(url));
      } else if (url.match(/\.js$/)) {
        const jspath = app.settings.jsUrl || '';
        if (sectionLoaderState.loadedUrls[url]) {
          fileLoadComplete(url)();
          return;
        }
        sectionLoaderState.loadedUrls[url] = url;
        loadScript(jspath + url).then(fileLoadComplete(url));
      } else {
        loadFile.call(this, url, fileLoadComplete(url));
      }
    }
  };

  if (sectionLoaderState.loader) {
    sectionLoaderState.loader.bringIn().then(() => startload());
  } else {
    startload();
  }
}

/**
 * @return {number} Percentage of files loaded
 */
function getPerc() {
  let loaded = sectionLoaderState.filesLoaded;
  let totalLoad = sectionLoaderState.filesToLoad.length;

  if (this.assetManager) {
    const assetManagerLoaded = this.assetManager.getLoaded();
    loaded += assetManagerLoaded.loaded;
    totalLoad += assetManagerLoaded.total;
  }

  return loaded / totalLoad;
}

/**
 * @param  {Object} e
 */
function fileError(e) {
  throw new Error(`SectionLoader | fileError ${e.path[0].src} not found`);
}

/**
 * @param  {string} id
 * @return {Object}
 */
function getSectionTemplates(id) {
  const data = returnSectionOBJ(id);

  return sectionLoaderState.sections.reduce((o, section) => {
    const obj = o;
    if (section.id === id) {
      const template = sectionLoaderState.files[section.templatePath];
      const partials = section.partials.reduce((po, partialName) => {
        const partialsObj = po;
        const partial = returnSectionOBJ(partialName);
        obj.data.data[partialName] = partial.data;
        partialsObj[partialName] = sectionLoaderState.files[partial.templatePath];
        return partialsObj;
      }, {});
      obj.template = template;
      obj.partials = partials;
    }
    return obj;
  }, { data });
}

/**
 * @returns {Object}
 */
function getSectionLoaderState() {
  return sectionLoaderState;
}

/**
 * By default, sectionloader scrapes html for images to preload
 * to skip preloading images, call setPreloadImages(false)
 *
 * @param  {boolean} doPreloadImages
 */
function setPreloadImages(doPreloadImages) {
  preload_images = doPreloadImages;
}

const sectionLoader = {
  verbose: false,
  loadJSON,
  setupWidgets,
  localizationJSON: {},
  addLoaderUI,
  addSection,
  sectionExists,
  addFiles,
  loadSection,
  initScrape,
  isDuplicate,
  loadFiles,
  getPerc,
  fileError,
  checkComplete,
  complete,
  returnSectionOBJ,
  getSectionData,
  getSectionTemplates,
  getSectionLoaderState,
  loadImage,
  arrayExecutor,
  getWidgets,
  setPreloadImages,
};

export default {
  getInstance() {
    instance = instance || Object.create(sectionLoader);
    return instance;
  },
};
