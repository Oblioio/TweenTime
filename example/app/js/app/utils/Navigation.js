/* eslint-disable max-len */
import ArrayExecutor from './ArrayExecutor';
import SectionLoader from './SectionLoader';
import app from '../global';

let instance;
const sectionLoader = SectionLoader.getInstance();

const Navigation = function Navigation() {
  this.shellID = 'mainContent';
  this.verbose = false;
  this.currentSection = '';
  this.previous_section = '';
  this.forceChange = false;
  this.loadlist = [];
  this.arrayExecutor = ArrayExecutor(null, 'navigation');
  this.active = true;

  this.changeOrder = [
    'load',
    'section_add_next',
    'section_init_next',
    'section_hide_prev',
    'section_shutdown_prev',
    'section_startup_next',
    'section_show_next',
  ];
};

/**
 * @param  {string} shellID
 */
function setShell(shellID) {
  if (this.shell) {
    throw new Error('Shell already set!');
  } else {
    this.shellID = shellID;
    this.shell = document.getElementById(shellID);
    if (this.shell === null) {
      throw new Error(`Element with id of "${shellID}" does not exist.`);
    }
  }
}

function parseDeepLink() {
  const home = app.settings.homeSection || 'Home';
  let path_arr;

  const { hash } = window.location;
  if (hash.match('#/')) {
    path_arr = hash.replace('#/', '').split('/');
    this.currentSection = path_arr.length > 0 ? path_arr[0] : home;
    this.currentSubsection = path_arr[1];
  } else {
    this.currentSection = home;
  }

  console.log(this.currentSection);
}

/**
 * @param  {string} id
 * @param  {function} completeFn
 */
function changeSection(id, completeFn) {
  let sectionID = id;
  const subSectionID = null;
  const pop = false;

  if (app.verbose) console.log(`navigation | changeSection: ${sectionID} | ${subSectionID}`);

  const { hash } = window.location;
  if (sectionID.match(/^#/)) sectionID = 'Home';

  // if the user clicked the back or forward button while section is changing,
  // tack the change on to arrayExecutor
  if (!this.active) {
    if (pop) {
      this.arrayExecutor.tackOn([{
        fn: this.changeSection,
        scope: this,
        vars: [sectionID, subSectionID, null, true],
      }]);
    }
    return;
  }

  if (this.currentSection === sectionID && !this.forceChange) {
    // go to subsection if defined
    if (subSectionID && app.sections[sectionID].enterSubSection) {
      app.sections[sectionID].enterSubSection(subSectionID);
    }
    return;
  }

  if (app.mainMenu) {
    app.mainMenu.selectMenuItem(sectionID);
  }

  if (this.currentSection !== sectionID) {
    this.previous_section = this.currentSection;
  }

  this.currentSection = sectionID;
  this.currentSubsection = subSectionID || '';

  if (!pop && app.settings.deeplinking !== false 
    && window.history 
    && window.history.pushState 
    && this.previous_section !== ''
  ) {
    const data = {
      currentSection: this.currentSection,
      currentSubsection: this.currentSubsection,
    };

    if (window.innerHeight !== window.screen.height) {
      // pushState breaks fullscreen in chrome, so check if fullscreen first
      // window.history.pushState(data, '', (this.currentSection === 'Home' ? `${window.location.origin}${window.location.pathname}` : `${window.location.origin}${window.location.pathname}#/${this.currentSection}/${this.currentSubsection}`));
    }
  }

  this.loadQueue(sectionID);

  this.arrayExecutor.execute(this.assembleChangeFunction(completeFn));

  this.forceChange = false;
}

/**
 * @param  {function} completeFn
 */
function assembleChangeFunction(completeFn) {
  const function_arr = [{ fn: this.disable, scope: this, vars: null }];

  for (let i = 0; i < this.changeOrder.length; i++) {
    switch (this.changeOrder[i]) {
      case 'load':
        function_arr.push({ fn: this.load, scope: this, vars: null });
        break;
      case 'section_add_next':
        function_arr.push({ fn: this.section_add, scope: this, vars: [this.currentSection] });
        break;
      case 'section_init_next':
        function_arr.push({ fn: this.section_init, scope: this, vars: [this.currentSection] });
        break;
      case 'section_startup_next':
        function_arr.push({ fn: this.section_startup, scope: this, vars: [this.currentSection] });
        break;
      case 'section_show_next':
        function_arr.push({ fn: this.section_show, scope: this, vars: [this.currentSection] });
        break;
      case 'section_hide_prev':
        function_arr.push({ fn: this.section_hide, scope: this, vars: [this.previous_section] });
        break;
      case 'section_shutdown_prev':
        function_arr.push({
          fn: this.section_shutdown,
          scope: this,
          vars: [this.previous_section],
        });
        break;
      case 'section_remove_prev':
        function_arr.push({ fn: this.section_remove, scope: this, vars: [this.previous_section] });
        break;
      default:
        if (typeof this.changeOrder[i] === 'function') {
          function_arr.push({
            fn: this.changeOrder[i],
            scope: this,
            vars: [this.currentSection, this.previous_section],
          });
        } else {
          throw new Error(`assembleChangeFunction cannot add: ${this.changeOrder[i]}`);
        }
        break;
    }
  }

  function_arr.push({ fn: this.enable, scope: this, vars: null });
  if (completeFn) function_arr.push({ fn() { completeFn(); }, vars: null });

  return function_arr;
}

/**
 * @param  {...string} ...args
 */
function loadQueue(...args) {
  for (let i = 0; i < args.length; i++) {
    if (app.verbose) console.log(`navigation | loadQueue: ${args[i]}`);
    if (sectionLoader.sectionExists(args[i])) { this.loadlist.push(args[i]); }
    if (app.sections[args[i]]) { this.section_prepareLoad(args[i]); }
  }
}

/**
 * @param  {...*} ...args
 */
function load(...args) {
  console.log('navigation | load', args);

  let resolve;

  // if the last 2 arguments are functions, they should be the resolve
  // and reject functions passed by array executor
  if (args.length > 1) {
    if (typeof args[args.length - 2] === 'function') {
      args.pop(); // pop reject function
      resolve = args.pop();
    }
  }

  if (args.length) this.loadQueue(args);

  for (let i = 0; i < args.length; i++) {
    if (app.sections[this.currentSection].prepare) {
      app.sections[this.currentSection].prepare();
    }
  }

  const function_arr = [
    { fn: sectionLoader.loadSection, scope: sectionLoader, vars: this.loadlist },
    { fn: this.load_done, scope: this, vars: [resolve] },
  ];

  this.arrayExecutor.execute(function_arr);
}

/**
 * @param  {function} callback
 */
function load_done(callback) {
  if (app.verbose) console.log('navigation | load_done', callback);
  this.loadlist = [];
  if (callback) callback();
}

/**
 * @param  {string} sectionID
 */
function section_prepareLoad(sectionID) {
  if (app.verbose) console.log(`navigation | section_prepareLoad: ${sectionID}`);

  if (!app.sections[sectionID].prepared) {
    if (app.sections[sectionID].prepareLoad) {
      app.sections[sectionID].prepareLoad();
    }
    app.sections[sectionID].prepared = true;
  }
}

/**
 * Add section html to DOM
 *
 * @param  {string} sectionID
 * @param  {function} callbackFn
 */
function section_add(sectionID, callbackFn) {
  if (app.verbose) console.log(`navigation | section_add: ${sectionID}`);
  this.shell = this.shell || document.getElementById(this.shellID);

  if (app.sections[sectionID] && !app.sections[sectionID].added) {
    app.sections[sectionID].added = true;
    if (app.sections[sectionID].insert) {
      app.sections[sectionID].insert(this.shell).then(callbackFn);
    } else {
      callbackFn();
    }
  } else {
    callbackFn();
  }
}

/**
 * Initialize section
 *
 * @param  {string} sectionID
 * @param  {function} callbackFn
 */
function section_init(sectionID, callbackFn) {
  if (app.verbose) console.log(`navigation | section_init: ${sectionID}`);

  // lets auto add the section is not added
  if (!app.sections[sectionID].initialized) {
    if (app.sections[sectionID].init) {
      app.sections[sectionID].init(() => {
        app.sections[sectionID].initialized = true;
        callbackFn();
      });
      return;
    }

    app.sections[sectionID].initialized = true;
  }

  // only called if section init function wasn't called
  callbackFn();
}

/**
 * @param  {string} sectionID
 * @param  {function} callbackFn
 */
function section_startup(sectionID, callbackFn) {
  if (app.verbose) console.log(`navigation | section_startup: ${sectionID}`);

  if (app.sections[sectionID]) {
    if (app.sections[sectionID].startup) {
      app.sections[sectionID].startup(callbackFn);
    } else {
      const container = document.getElementById(sectionID.toLowerCase());
      if (container) {
        container.style.display = 'block';
      }
      callbackFn();
    }
  } else {
    callbackFn();
  }
}

/**
 * @param  {string} sectionID
 * @param  {function} callbackFn
 */
function section_show(sectionID, callbackFn) {
  if (app.verbose) console.log(`navigation | section_show: ${sectionID}`);

  if (app.sections[sectionID] && app.sections[sectionID].show) {
    app.sections[sectionID].show(callbackFn);
  } else {
    const container = document.getElementById(sectionID.toLowerCase());
    if (container) {
      container.style.opacity = 1;
      container.style.visibility = 'visible';
    }
    callbackFn();
  }
}
/**
 * @param  {string} sectionID
 * @param  {function} callbackFn
 */
function section_hide(sectionID, callbackFn) {
  if (app.verbose) console.log(`navigation | section_hide ${sectionID}`);

  if (app.sections[sectionID]) {
    if (app.sections[sectionID].hide) {
      app.sections[sectionID].hide(callbackFn);
    } else {
      const container = document.getElementById(sectionID.toLowerCase());
      if (container)container.style.display = 'none';
      container.style.opacity = 0;
      container.style.visibility = 'hidden';
      callbackFn();
    }
  } else {
    callbackFn();
  }
}

/**
 * @param  {string} sectionID
 * @param  {function} callbackFn
 */
function section_shutdown(sectionID, callbackFn) {
  if (app.verbose) console.log(`navigation | section_shutdown: ${sectionID}`);

  if (app.sections[sectionID] && app.sections[sectionID].shutdown) {
    app.sections[sectionID].shutdown(callbackFn);
  } else {
    callbackFn();
  }
}

/**
 * Remove htmlData from DOM
 *
 * @param  {string} sectionID
 * @param  {function} callbackFn
 */
function section_remove(sectionID, callbackFn) {
  if (app.verbose) console.log(`navigation | section_remove ${sectionID}`);
  if (!app.sections[sectionID]) {
    callbackFn();
    return;
  }

  if (app.sections[sectionID].destroy) {
    app.sections[sectionID].destroy();
    app.sections[sectionID].initialized = false;
  }

  if (app.sections[sectionID].added) {
    app.sections[sectionID].added = false;
    const el = document.getElementById(sectionID.toLowerCase());
    el.parentElement.removeChild(el);
  }

  callbackFn();
}

/**
 * Enable navigation
 *
 * @param  {function} completeFn
 */
function enable(completeFn) {
  if (app.verbose) console.log('/////// navigation_enable /////////');
  this.active = true;

  if (this.cover) this.cover.style.display = 'none';

  if (completeFn)completeFn();
}

/**
 * Disable navigation
 *
 * @param  {function} completeFn
 */
function disable(completeFn) {
  if (app.verbose) console.log('/////// navigation_disable /////////');
  this.active = false;

  /* turn on cover's display */
  if (this.cover) this.cover.style.display = 'block';

  if (completeFn)completeFn();
}

Navigation.prototype.changeSection = changeSection;
Navigation.prototype.assembleChangeFunction = assembleChangeFunction;
Navigation.prototype.loadQueue = loadQueue;
Navigation.prototype.load = load;
Navigation.prototype.load_done = load_done;
Navigation.prototype.section_prepareLoad = section_prepareLoad;
Navigation.prototype.section_add = section_add;
Navigation.prototype.section_init = section_init;
Navigation.prototype.section_startup = section_startup;
Navigation.prototype.section_show = section_show;
Navigation.prototype.section_hide = section_hide;
Navigation.prototype.section_shutdown = section_shutdown;
Navigation.prototype.section_remove = section_remove;
Navigation.prototype.enable = enable;
Navigation.prototype.disable = disable;
Navigation.prototype.setShell = setShell;
Navigation.prototype.parseDeepLink = parseDeepLink;

export default {
  getInstance() {
    instance = instance || new Navigation();
    return instance;
  },
};
