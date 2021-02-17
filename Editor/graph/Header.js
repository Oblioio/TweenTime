import * as d3 from "d3";

import Signals from 'signals';
import Utils from '../../Utils';

export default class Header {
  constructor(editor, timer, initialDomain, tweenTime, width, margin) {
    this.timer = timer;
    this.initialDomain = initialDomain;
    this.tweenTime = tweenTime;

    this.onBrush = new Signals.Signal();
    this.margin = {top: 10, right: 20, bottom: 0, left: margin.left};
    this.height = 50 - this.margin.top - this.margin.bottom + 20;

    this.currentTime = this.timer.time;
    this.x = d3.scaleTime().range([0, width]);
    this.x.domain([0, this.timer.totalDuration]);

    // Same as this.x from timeline
    this.xDisplayed = d3.scaleTime().range([0, width]);
    this.xDisplayed.domain(this.initialDomain);

    this.xAxis = d3.axisTop(this.x)
      .tickSize(-5, 0)
      .tickFormat(Utils.formatMinutes);

    this.svg = d3.select(editor.$timeline.get(0)).select('.timeline__header').append('svg')
      .attr('width', width + this.margin.left + this.margin.right)
      .attr('height', 56);

    this.svgContainer = this.svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.createBrushHandle();
    this.createTimeHandle();
    this.timer.durationChanged.add(this.onDurationChanged.bind(this));
  }

  adaptDomainToDuration(domain, seconds) {
    var ms = seconds * 1000;
    var new_domain = [domain[0], domain[1]];
    // Make the domain smaller or equal to ms.
    new_domain[0] = Math.min(new_domain[0], ms);
    new_domain[1] = Math.min(new_domain[1], ms);
    // Should not go below 0.
    new_domain[0] = Math.max(new_domain[0], 0);

    return new_domain;
  }

  setDomain() {
    // this.brush.move(this.gBrush, this.initialDomain.map(this.x));
    // this.brush.x(this.x).extent([[0, 1], [this.initialDomain[1], 1]]);
    // this.svgContainer.select('.brush').call(this.brush);
    // // Same as onBrush
    this.onBrush.dispatch(this.initialDomain);
    this.render();
    this.xDisplayed.domain(this.initialDomain);
  }

  onDurationChanged(seconds) {
    this.x.domain([0, this.timer.totalDuration]);
    this.xAxisElement.call(this.xAxis);
    this.initialDomain = this.adaptDomainToDuration(this.initialDomain, seconds);
    this.setDomain(this.initialDomain);
  }

  createBrushHandle() {
    this.xAxisElement = this.svgContainer.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + (this.margin.top + 7) + ')')
      .call(this.xAxis);

    var onBrush = ({ selection }) => {
      // var extent0 = this.brush.extent();
      // // Get domain as milliseconds and not date.
      // console.log('ON BRUSH', selection, this.brush.extent);
      // var start = extent0[0].getTime();
      // var end = extent0[1].getTime();
      const start = this.x.invert(selection[0]);
      const end = this.x.invert(selection[1]);
      // // Set the initial domain.
      this.initialDomain[0] = start;
      this.initialDomain[1] = end;
      console.log(selection[1], this.brush.extent()());
      this.setDomain(this.initialDomain);
      // const selection = data.selection;
      // console.log('WHAT IS THE SELECTION', data, selection, this.x.range(), this.x.domain(), this.brush.extent()());
      // if (selection) {
      //   console.log(this.x.invert(selection[0]));
      //   this.svgContainer.property("value", selection.map(this.x.invert, this.x).map(d3.utcDay.round));
      //   // this.onBrush.dispatch("input");
      // }
    };

    var brushended = ({selection}) => {
      if (!selection) {
        console.log('ended!');
        // this.gBrush.call(this.brush.move, defaultSelection);
      }
    }

console.log('INITIAL DOMAIN', this.initialDomain, this.x(), this.height);
    this.brush = d3.brushX()
      .extent([[this.x.range()[0], 0], [this.x.range()[1], 20]])
      // .extent([[this.x, this.height], [this.initialDomain[1], this.height]])
      .on('brush', onBrush)
      .on('end', brushended);

    this.gBrush = this.svgContainer.append('g')
      .attr('class', 'brush')
      .call(this.brush)
      .call(this.brush.move, [0, this.x.range()[1] * 0.2])
      .selectAll('rect')
      .attr('height', 20);
  }

  

  render() {
    var timeSelection = this.svgContainer.selectAll('.time-indicator');
    timeSelection.attr('transform', 'translate(' + this.xDisplayed(this.currentTime[0]) + ', 25)');
  }

  createTimeHandle() {
    var self = this;

    var dragTimeMove = function(e) {
      const event = e.sourceEvent;
      event.stopPropagation();
      var tweenTime = self.tweenTime;
      var event_x = event.x !== undefined ? event.x : event.clientX;
      var dx = self.xDisplayed.invert(event_x - self.margin.left);
      dx = dx.getTime();
      dx = Math.max(0, dx);

      var timeMatch = false;
      if (event.shiftKey) {
        var time = dx / 1000;
        timeMatch = Utils.getClosestTime(tweenTime.data, time, '---non-existant', false, false, 0.3);
        if (timeMatch !== false) {
          timeMatch = timeMatch * 1000;
        }
      }
      if (timeMatch === false) {
        timeMatch = dx;
      }
      self.timer.seek([timeMatch]);
    };

    var dragTime = d3.drag()
      .subject(function(d) {
        return d;
      })
      .on('drag', dragTimeMove);

    var timeSelection = this.svgContainer.selectAll('.time-indicator').data(this.currentTime);

    timeSelection.enter().append('rect')
      .attr('x', 0)
      .attr('y', 20)
      .attr('width', self.xDisplayed(self.timer.totalDuration))
      .attr('height', 50)
      .attr('fill-opacity', 0)
      .on('click', function(event) {
        var mouse = d3.pointer(event, this);
        var dx = self.xDisplayed.invert(mouse[0]);
        dx = dx.getTime();
        dx = Math.max(0, dx);
        self.timer.seek([dx]);
      });

    var timeGrp = timeSelection.enter().append('g')
      .attr('class', 'time-indicator')
      .attr('transform', 'translate(-0.5,' + 30 + ')')
      .call(dragTime);

    timeGrp.append('rect')
      .attr('class', 'time-indicator__line')
      .attr('x', -0.5)
      .attr('y', 0)
      .attr('width', 1)
      .attr('height', 1000);

    timeGrp.append('path')
      .attr('class', 'time-indicator__handle')
      .attr('d', 'M -5 -3 L -5 5 L 0 10 L 5 5 L 5 -3 L -5 -3');

    // Mask time indicator
    // todo: remove the mask.
    this.svgContainer.append('rect')
      .attr('class', 'graph-mask')
      .attr('x', -self.margin.left)
      .attr('y', -self.margin.top)
      .attr('width', self.margin.left - 5)
      .attr('height', self.height);
  }

  resize(width) {
    let width2 = width - this.margin.left - this.margin.right;
    this.svg.attr('width', width2 + this.margin.left + this.margin.right);

    this.x.range([0, width2]);
    this.xDisplayed.range([0, width2]);
    this.xAxisElement.call(this.xAxis);
  }
}
