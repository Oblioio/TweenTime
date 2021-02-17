import Navigation from './Navigation';
import findAncestor from './findAncestor';
import Menu from '../widgets/Menu';

let instance;
const navigation = Navigation.getInstance();
const app = window.fashionbook;

function Shell() {
  this.elements = {
    shell: document.getElementById('shell')
  };
}

function init(callbackFn) {
  console.log('init shell');
  this.ready(callbackFn);
}

function ready(callbackFn) {
  this.initialized = true;

  callbackFn();
  setupMenu();
}

function setupMenu() {
  // create menu
  const menuData = {
    menuID: 'menu',
    wrapperID: 'mainHeader',
    paginatorElID: 'mainNav'
  };

  app.mainMenu = (typeof Menu !== 'undefined') ? Menu.getNew(menuData) : false;
  if (!app.mainMenu) return;

  app.mainMenu.init(navigation.currentSection);

  document.getElementById('menu').addEventListener('click', (e) => {
    const el = findAncestor(e.target, 'a');

    if (!el || el.getAttribute('target') === '_blank') return;

    e.preventDefault();

    const section_name = el.getAttribute('data-section');

    if (el.getAttribute('data-type') === 'overlay') {
      app.functions.showOverlay(section_name);
    } else {
      navigation.changeSection(section_name);
    }
  }, false);
}

function resize() {
  if (!this.initialized) return;
}

Shell.prototype.init = init;
Shell.prototype.ready = ready;
Shell.prototype.setupMenu = setupMenu;
Shell.prototype.resize = resize;

export default {
  getInstance: () => {
    instance = instance || new Shell();
    return instance;
  }
};
