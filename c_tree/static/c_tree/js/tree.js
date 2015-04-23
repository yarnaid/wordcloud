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
        .attr('transform', 'translate(' + 0 + ',' + 0 + ')');

    self.process_data();
    self.update(self.display_data);
};

Tree.prototype.process_data = function() {
    var self = this;

    // TODO: do it for each book
    var book_name;
    var clusters = $.map(self.data.clusters, function(v, i) {
        v['name'] = i;
        v.cluster = book_name;
        return [v];
    });
    var book = {
        name: book_name,
        parent: null,
        children: clusters
    }

    self.data.nodes.map(function(node) {
        node['name'] = node.title;
    })
    var nodes = _.union(book, clusters, self.data.nodes);
    self.scale.domain([self.min_r, d3.max(nodes, function(d) {return d['effecif'];})]);


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

    var root = {
        job_name: 'Job Name',
        job_id: 0,
        children: [{
            name: 'book_1',
            children: treeData
        }]
    };

    self.display_data = root;
};

Tree.prototype.update = function(source) {
    var self = this;
    var nodes = self.tree.nodes(source);
    var links = self.tree.links(nodes);

    var max_depth = 3;
    self.depth_scale.domain([0, (max_depth + 1) * 180]);

    nodes.forEach(function(d) {
        d.y = self.depth_scale(d.depth * 180);
    });

    var node = self.svg.selectAll('g.node')
        .data(nodes, function(d) {
            return d.id || (d.id = ++(self.i));
        });

    var nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .attr('transform', function(d){return 'translate(' + d.y + ',' + d.x + ')'});

    nodeEnter.append('circle')
        .attr('r', function(d){return Math.max(self.radius(d), self.min_r) || self.min_r;})
        .style('fill', '#fff');

    nodeEnter.append('text')
        .attr('x', function(d) {return d.children || d._children ? -self.radius(d) -self.t_offset : self.radius(d) + self.t_offset;})
        .attr('dy', '.35em')
        .attr('text-anchor', function(d) {return d.children || d._children ? 'end' : 'start';})
        .text(function(d) {return d.name; })
        .style('fill-opacity', 1);

    var link = self.svg.selectAll('path.link')
        .data(links, function(d) {return d.target.id;});

    link.enter().insert('path', 'g')
        .attr('class', 'link')
        .attr('d', self.diagonal);
};
