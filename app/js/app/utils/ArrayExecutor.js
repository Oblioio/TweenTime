function nullObj(o) {
  const obj = o;
  Object.keys(obj).forEach((key) => delete obj[key]);
}

const ArrayExecutor = function ArrayExecutor() {
  let task_arr = [];

  return {
    execute(arr) {
      if (arr.length === 0) return;
      this.addNext(arr);
      this.runStep('');
    },
    addNext(arr) {
      if (typeof arr === 'function') {
        // add single function
        task_arr.unshift({ fn: arr, vars: null });
      } else {
        task_arr = [...arr, ...task_arr];
      }
    },
    tackOn(arr) {
      task_arr = [...task_arr, ...arr];
      this.runStep('');
    },
    next() {
      this.runStep();
    },
    runStep(vars) {
      if (task_arr.length === 0) return;

      const step = task_arr.shift();
      const funct = step.fn;
      step.vars = step.vars || [];

      if (vars) step.vars = step.vars.concat(vars);

      const step_scope = step.scope || this;

      const promise = new Promise(((resolve, reject) => {
        funct.apply(step_scope, [...step.vars, resolve, reject]);
      }));

      promise.then((next_vars) => {
        this.runStep(next_vars);
      }).catch(
        // Log the rejection reason
        (cont) => {
          if (cont === true) {
            this.next();
          } else {
            throw cont;
          }
        },
      );

      nullObj(step);
    },
    clearArrayExecutor() {
      task_arr = [];
    },
    destroy() {
      for (let i = 0; i < task_arr.length; i++) {
        nullObj(task_arr[i]);
      }
      task_arr = [];
    },
  };
};

export { ArrayExecutor as default };
