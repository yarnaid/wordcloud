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

    this.width = $(this.parent_id).width() - this.margin.left - this.margin.right;
    this.height = $(this.parent_id).height();
    this.height = Math.max(window.innerHeight, this.height);
    this.height = this.height - this.margin.top - this.margin.bottom;

    self.scale = d3.scale.linear().range([5, 40]);
    self.radius = function(node, key) {
        key = key || 'effecif';
        return self.scale(node[key]);
    };

    self.fill = d3.scale.category20();

    self.process_data();
    self.zoom = d3.behavior.zoom();

    self.tree = d3.layout.tree()
        .size([self.height, self.width]);

    self.diagonal = d3.svg.diagonal()
        .projection(function (d) {return [d.x, d.y];});


    self.init();
};


Tree.prototype.init = function () {
    var self = this;

    var zoom = function () {
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
        .attr('transform', 'translate(' + self.width/2 + ',' + self.height/2 + ')');

    self.process_data();
    self.update(self.display_data);
};

Tree.prototype.process_data = function () {
    var self = this;
    self.display_data = {
        job_name: 'Job Name',
        job_id: 0,
        books: [
            {
                name: 'book_1',
                nets: self.data.clusters,
                codes: self.data.nodes,
                children: []
            }
        ]
    };

    var clusters = $.map(self.data.clusters, function(v, i) {
        v['name'] = i;
        return [v];
    });
    console.log('ccc', clusters);

    var treeMap = self.display_data

    var books = self.display_data.books;

    var root = {
        job_name: self.display_data.job_name,
        job_id: self.display_data.job_id,
        children: self.display_data.books
    }

    for (key in root.children) {
        if (books.hasOwnProperty(key)) {
            var book = books[key];
            var nets_data = book['nets'];
            var codes_data = book['codes'];
            for (nk in nets_data) {
                book['children'].push(nets_data[nk]);
            }
            console.log('222', book);

            book['children'] = nets_data;
            for (code_key in codes_data) {
                var code = codes_data[code_key];
                var net = nets_data[code.cluster];
                net['children'] = net['children'] || [];
                net['children'].push(code);
            }
        }
    }

    console.log('111', root);

    self.display_data = root;
};

Tree.prototype.update = function(root) {
    var self = this;
    var nodes = self.tree.nodes(root);
    console.log(nodes);
    return;
};