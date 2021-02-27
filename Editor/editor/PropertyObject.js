import $ from 'jquery';
import PropertyBase from './PropertyBase';
import Utils from '../../Utils';
// let DraggableNumber = require('draggable-number.js');

import Mustache from 'mustache';
import tpl_property from '../templates/propertyObject.tpl.html.js';

export default class PropertyObject extends PropertyBase {
  // instance_property: The current property on the data object.
  // lineData: The line data object.
  constructor(instance_property, lineData, editor, key_val = false) {
    super(instance_property, lineData, editor, key_val);
    this.onInputChange = this.onInputChange.bind(this);
    this.$input = this.$el.find('input');
    this.inputs = this.$el[0].querySelectorAll('input');
    for (let i = 0; i < this.inputs.length; i++) {
      const input = this.inputs[i];
      input.addEventListener('change', this.onInputChange);
    }
    // console.log('PROP OBJ CONSTRUCTOR', this.$input, this.$el[0].querySelectorAll('input'));
  }

  getInputVal() {
    const obj = {...this.getCurrentVal()};
    for (let i = 0; i < this.inputs.length; i++) {
      const input = this.inputs[i];
      obj[input.dataset.propname] = input.value;
    }
    return obj;
  }

  onInputChange(e) {
    var current_value = this.getInputVal();
    var currentTime = this.timer.getCurrentTime() / 1000;

    // if we selected a key simply get the time from it.
    if (this.key_val) {
      currentTime = this.key_val.time;
    }

    if (this.instance_property.keys && this.instance_property.keys.length) {
      // Add a new key if there is no other key at same time
      var current_key = Utils.find(this.instance_property.keys, (key) => key.time === currentTime);

      if (current_key) {
        // if there is a key update it
        current_key.val = current_value;
      }
      else {
        // add a new key
        this.addKey(current_value);
      }
    }
    else {
      // There is no keys, simply update the property value (for data saving)
      this.instance_property.val = current_value;
      // Also directly set the lineData value.
      this.lineData.values[this.instance_property.name] = current_value;
      // Simply update the custom object with new values.
      if (this.lineData.object) {
        currentTime = this.timer.getCurrentTime() / 1000;
        // Set the property on the instance object.
        this.lineData.object.update(currentTime - this.lineData.start);
      }
    }

    // Something changed, make the lineData dirty to rebuild things. d
    this.lineData._isDirty = true;
  }

  render() {
    super.render();
    // By default assign the property default value
    var val = this.getCurrentVal();
    var vals = Object.keys(val).map((key) => {
      return {
        propName: key,
        val: val[key]
      }
    });

    var data = {
      id: this.instance_property.name, // "circleRadius" instead of "circle radius"
      label: this.instance_property.label || this.instance_property.name,
      vals
    };

    var view = Mustache.render(tpl_property, data);
    console.log('VIEW!', view);
  
    this.$el = $(view);
    this.$el.find('.property__key').click(this.onKeyClick);

    

    var onChangeEnd = () => {
      this.editor.undoManager.addState();
    };

    // var draggableOptions = {
    //   changeCallback: () => this.onInputChange(),
    //   endCallback: () => onChangeEnd()
    // };
    // // Set min & max if they are defined.
    // if ('min' in this.instance_property) {
    //   draggableOptions.min = this.instance_property.min;
    // }
    // if ('max' in this.instance_property) {
    //   draggableOptions.max = this.instance_property.max;
    // }

    // var draggable = new DraggableNumber($input.get(0), draggableOptions);
    // $input.data('draggable', draggable);
    // $input.change(this.onInputChange);
    // var $input = this.$el.find('input');
    console.log('THIS EL 0', this.$el[0]);
    // const inputs = this.$el[0].querySelectorAll('input');
    // inputs.forEach((input) => {
    //   let $input = $(input);
    //   let draggable = new DraggableNumber(input, draggableOptions);
    //   console.log(draggable)
    //   $input.data('draggable', draggable);
    //   $input.change(this.onInputChange);
    // })
  }

  remove() {
    super.render();

    delete this.$input;
    delete this.$el;
  }

  update() {
    super.render();
    var val = this.getCurrentVal();
    var draggable = this.$input.data('draggable');

    // if (draggable) {
    //   draggable.set(val.toFixed(3));
    // }
    // else {
    //   this.$input.val(val.toFixed(3));
    // }
    for (let i = 0; i < this.inputs.length; i++) {
      const input = this.inputs[i];
      input.value = val[input.dataset.propname];
    }
  }
}
