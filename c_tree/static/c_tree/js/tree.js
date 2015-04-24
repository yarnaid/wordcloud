/**
 * Created by yarnaid on 22/04/2015.
 */

var Tree = function(_parent_id, _data, _event_handler) {
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
    self.i = 0;
    self.min_r = 5;
    self.t_offset = 13;
    self.duration = 400;

    this.width = $(this.parent_id).width() - this.margin.left - this.margin.right;
    this.height = $(this.parent_id).height();
    this.height = Math.max(window.innerHeight, this.height);
    this.height = this.height - this.margin.top - this.margin.bottom;

    self.scale = d3.scale.linear().range([self.min_r, 40]);
    self.radius = function(node, key) {
        key = key || 'effecif';
        return self.scale(node[key]);
    };

    self.fill = d3.scale.category20();
    self.depth_scale = d3.scale.linear().range([10, self.width]);

    self.zoom = d3.behavior.zoom();

    self.tree = d3.layout.tree()
        .size([self.height, self.width]);

    self.diagonal = d3.svg.diagonal()
        .projection(function(d) {
            return [d.y, d.x];
        });


    self.init();
};


Tree.prototype.init = function() {
    var self = this;

    var zoom = function() {
        self.svg.attr('transform', 'translate(' + self.zoom.translate() + ') scale(' + self.zoom.scale() + ')');
    };

    self.svg = d3.select(self.parent_id)
        .append('svg')
        .attr('width', self.width)
        .attr('height', self.height)
        .attr('pointer-events', 'all')
        .append('svg:g')
        .call(self.zoom.on('zoom', zoom))
        .append('svg:g')
        .attr('transform', 'translate(' + self.margin.left + ',' + self.margin.top + ')');

    self.process_data();
    var root = self.display_data;
    root.x0 = self.height / 2. + self.margin.left;
    root.y0 = 0;
    self.update(self.display_data);
};

Tree.prototype.process_data = function() {
    var self = this;

    $.map(self.data.nodes, function(v) {v.id = null;});

    var job_name = 'Job Name';
    var root = {
        parent: null,
        name: job_name,
        cluster: null,
        effecif: self.min_r
    };


    // TODO: do it for each book
    var book_name = 'book 1';
    var clusters = $.map(self.data.clusters, function(v, i) {
        v['name'] = i;
        v.cluster = book_name;
        v.id = null;
        return [v];
    });
    var book = {
        name: book_name,
        parent: root,
        cluster: job_name,
        effecif: self.min_r,
        children: clusters
    }

    self.data.nodes.map(function(node) {
        node['name'] = node.title;
    })
    var nodes = _.union(root, book, clusters, self.data.nodes);
    self.scale.domain([self.min_r, d3.max(nodes, function(d) {
        return d['effecif'];
    })]);


    var dataMap = nodes.reduce(function(map, node) {
        var n = node.name;
        map[node.name] = node;
        return map;
    }, {});

    var treeData = [];
    nodes.forEach(function(node) {
        // add to parent
        var cluster = dataMap[node.cluster];
        if (cluster) {
            // create child array if it doesn't exist
            (cluster.children || (cluster.children = []))
            // add node to child array
            .push(node);
        } else {
            // cluster is null or missing
            treeData.push(node);
        }
    });

    root['children'] = [{
        name: book_name,
        effecif: self.min_r,
        cluster: root.name,
        parent: root,
        children: treeData
    }];

    self.display_data = root;
};

Tree.prototype.update = function(source) {
    var self = this;
    var nodes = self.tree.nodes(self.display_data).reverse();
    var links = self.tree.links(nodes);
    console.log(nodes);

    var max_depth = 3;
    self.depth_scale.domain([0, (max_depth + 1) * 180]);

    nodes.forEach(function(d) {
        d.y = self.depth_scale(d.depth * 180);
    });

    var node = self.svg.selectAll('g.node')
        .data(nodes, function(d) {
            return d.id || (d.id = ++(self.i));
        });

    function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        self.update(d);
    }

    var nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr('transform', function(d) {
            return 'translate(' + source.y0 + ',' + source.x0 + ')'
        })
        .on('click', click);

    nodeEnter.append('circle')
        .attr('r', 1e-6)// function(d) {
            // return Math.max(self.radius(d), self.min_r) || self.min_r;
        // })
        .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

    nodeEnter.append('text')
        .attr('x', function(d) {
            return d.children || d._children ? -self.radius(d) - self.t_offset : self.radius(d) + self.t_offset;
        })
        .attr('dy', '.35em')
        .attr('text-anchor', function(d) {
            return d.children || d._children ? 'end' : 'start';
        })
        .text(function(d) {
            return d.name;
        })
        .style('fill-opacity', 1e-6);

    var nodeUpdate = node.transition()
      .duration(self.duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

    nodeUpdate.select("circle")
      .attr("r", function(d) {
            return Math.max(self.radius(d), self.min_r) || self.min_r;
        })
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

    nodeUpdate.select("text")
      .style("fill-opacity", 1);

    var nodeExit = node.exit().transition()
      .duration(self.duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

    nodeExit.select("circle")
      .attr("r", 1e-6);

    nodeExit.select("text")
      .style("fill-opacity", 1e-6);

    var link = self.svg.selectAll('path.link')
        .data(links, function(d) {
            return d.target.id;
        });

    link.enter().insert('path', 'g')
        .attr('class', 'link')
        .attr('d', function(d) {
        var o = {x: source.x0, y: source.y0};
        return self.diagonal({source: o, target: o});
      });

    link.transition()
      .duration(self.duration)
      .attr("d", self.diagonal);

    link.exit().transition()
      .duration(self.duration)
      .attr('d', function(d) {
        var o = {x: source.x, y: source.y};
        return self.diagonal({source: o, target: o});
      })
      .remove();

    nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
};