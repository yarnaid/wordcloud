'use strict';
/**
 * Created by yarnaid on 18/04/2015.
 */

var Wordle = function(_parent_id, _data, _event_handler) {
    var self = this;

    self.parent_id = _parent_id;
    self.data = _data;
    self.event_handler = _event_handler;
    self.margin = {
        top: 20,
        bottom: 200,
        left: 20,
        right: 20
    };

    this.width = $(this.parent_id).width() - this.margin.left - this.margin.right;
    this.height = $(this.parent_id).height();
    this.height = Math.max(window.innerHeight, this.height);
    this.height = this.height - this.margin.top - this.margin.bottom;

    self.layout = d3.layout.cloud();
    self.scale = d3.scale.linear().range([5, 40]);
    self.radius = function(node, key) {
        key = key || 'effecif';
        return self.scale(node[key]);
    };

    self.zoom = d3.behavior.zoom();
    self.fill = d3.scale.category20();

    self.process_data();
    self.init();
};

Wordle.prototype.init = function() {
    var self = this;

    var zoom = function() {
        var x = self.zoom.translate()[0] + self.width/2;
        var y = self.zoom.translate()[1] + self.height/2;
        self.svg.attr('transform',
            'translate(' + [x, y] + ') scale(' + self.zoom.scale() + ')');
    };

    self.svg = d3.select(self.parent_id)
        .append('svg')
        .attr('encoding', 'UTF-8')
        .attr('width', this.width)
        .attr('height', this.height)
        .attr('pointer-events', 'all')
        .append('svg:g')
        .call(self.zoom.on('zoom', zoom))
        .append('svg:g')
        .attr('transform', 'translate(' + self.width/2 + ',' + self.height/2 + ')');

    var draw = function() {
        self.svg.selectAll('.text')
            .data(self.words)
            .enter()
            .append('text')
            .style('font-size', function(d) { return d.size + 'px'; })
            .style('fill', function(d, i) { return self.fill(i); })
            .attr('text-anchor', 'middle')
            .attr('transform', function(d) {
              return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
    };

    self.layout.size([self.width, self.height])
        .timeInterval(10)
        .words(self.words)
        .rotate(function(d) { return ~~(Math.random() * 5) * 30 - 60; })
        // .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .fontSize(function(d) { return d.size; })
        .on('end', draw);

    self.update();
};

Wordle.prototype.process_data = function () {
    var self = this;
    self.words = [];
    self.scale.domain([1, d3.max(self.data.nodes, function(d) {return d['effecif'];})]);
    self.data.nodes.forEach(function (d) {
        self.words.push({text: d.title, size: self.radius(d)});
    });
};

Wordle.prototype.update = function() {
    var self = this;
    self.layout.start();
};