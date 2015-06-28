'use strict';

var Cluster = function(_parent_id, _data, _eventHandler, _fps) {
    var self = this;
    this.parent_id = _parent_id;
    this.data = _data;
    this.event_handler = _eventHandler;
    this.fps = _fps || 40;
    this.gravity = 0.1;
    this.friction = 0.2;
    this.link_strength = 2;
    $(this.parent_id).addClass('motion');

    this.padding = -5; // separation between same-color nodes
    this.clusterPadding = 2; // separation between different-color nodes
    this.maxRadius = 300;
    this.codes_overlap = 5;
    this.margin = {
        top: 10,
        right: 0,
        bottom: 200,
        left: 0
    };

    self.max_lengh = 0;
    self.max_depth = 0;
    self.max_verbatim_count = 0;
    self.verbatim_count = 0;



    this.min_radius = 4.5;

    this.raduis_scale = d3.scale.log();


    this.width = $(this.parent_id).width() - this.margin.left - this.margin.right;
    this.height = $(this.parent_id).height();
    this.height = Math.max(window.innerHeight, this.height);
    this.height = this.height - this.margin.top - this.margin.bottom;

    this.radius = function(node) {
        return self.raduis_scale(node.verbatim_count * 2);
    };

    this.duration = 1000 / this.fps;

    this.force = d3.layout.force()
        .gravity(this.gravity)
        .friction(this.friction)
        .linkStrength(this.link_strength)
        .linkDistance(function(link) {
            return self.radius(link.source) + self.radius(link.target) - self.codes_overlap;
        })
        .charge(function(node) {
            return -30 * self.radius(node);
        });

    this.links = [];
    this.zoom = d3.behavior.zoom();
    // this.venn = venn.VennDiagram();
    this.pack = d3.layout.pack().size([this.width, this.height]);

    this.init();
};


Cluster.prototype.init = function() {
    var self = this;
    self.helpers_init();

    var zoom = function() {
        self.svg.attr('transform',
            'translate(' + self.zoom.translate() + ') scale(' + self.zoom.scale() + ')');
    };

    this.svg = d3.select(this.parent_id).append('svg')
        .attr('width', this.width)
        .attr('height', this.height)
        .attr('class', 'cloud')
        // .attr('pointer-events', 'all')
        .append('svg:g')
        .call(self.zoom.on('zoom', zoom))
        .append('svg:g');

    this.svg.append('rect') // scaling rectangle
        .attr('class', 'hidden')
        .attr('width', this.width)
        .attr('height', this.height)
        .attr('transform', 'translate(' + this.width*0.1 + ',' + this.height*0.1 + ') scale(0.8)')
        .style('fill', 'none');

    // update data
    this.wrangle();


    this.nodes = [];
    var clusters = this.display_data.question.children;

    function add_nodes(root) {
        $.each(root.children, function(k, v) {
            v.overcode = false;
            v.parent = root;
            v.repondants = v.verbatim_count / root.verbatim_count;
            self.nodes.push(v);
            add_nodes(v);
        });
    };
    $.each(clusters, function(k, v) {
        v.overcode = true;
        self.nodes.push(v);
        add_nodes(v);
    });

    this.nodes.forEach(function(n) {
        n.radius = self.radius(n);
        n.weight = n.radius;

        if (n.parent) {
            var link = {
                source: n.parent,
                target: n
            };
            self.links.push(link);
        }
    });
    this.force.links(this.links);

    this.link = this.svg.selectAll('.link').data(this.links);

    var set_class = function(d) {
            var res = 'node';
            var c = d.overcode ? ' overcode' : ' code';
            res = res + c;
            if (d.children.length > 0 && !d.overcode) {
                res = res + ' subnet';
            }
            return res;
        };

    this.node = this.svg.selectAll('.node')
        .data(this.nodes)
        .enter()
        .append('g')
        .attr('class', set_class)
        .call(this.force.drag)
        .on("mouseover", function(d) {
            self.tooltip_elem.transition()
                .duration(self.duration)
                .style("opacity", 1);
            self.tooltip_elem.html(self.tooltip_html(d))
                .style("left", (d3.event.pageX + d.radius) + "px")
                .style("top", (d3.event.pageY - 75) + "px");
        })
        .on("mouseout", function(d) {
            self.tooltip_elem.transition()
                .duration(self.duration)
                .style("opacity", 0);
        })
        .on("click", self.show_verbatims);



    // Resolves collisions between d and all other circles.
    var collide = function(alpha) {
        var quadtree = d3.geom.quadtree(self.nodes);
        return function(d) {
            var r = d.radius + self.maxRadius + Math.max(self.padding, self.clusterPadding),
                nx1 = d.x - r,
                nx2 = d.x + r,
                ny1 = d.y - r,
                ny2 = d.y + r;
            quadtree.visit(function(quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== d)) {
                    var x = d.x - quad.point.x,
                        y = d.y - quad.point.y,
                        l = Math.sqrt(x * x + y * y),
                        r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? self.padding : self.clusterPadding);
                    if (l < r) {
                        l = (l - r) / l * alpha;
                        d.x -= x *= l;
                        d.y -= y *= l;
                        quad.point.x += x;
                        quad.point.y += y;
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
        };
    }

    var tick = function(e) {
        self.link.attr('x1', function(d) {
                return d.source.x;
            })
            .attr('y1', function(d) {
                return d.source.y;
            })
            .attr('x2', function(d) {
                return d.target.x;
            })
            .attr('y2', function(d) {
                return d.target.y;
            });

        self.node
            .each(collide(0.5))
            .attr('cx', function(d) {
                if (d.x > self.width - d.radius) d.x -= 1;
                else if (d.x < d.return) d.x += 1;
                return d.x;
            })
            .attr('cy', function(d) {
                if (d.y > self.height - d.return) d.y -= 1;
                else if (d.y < d.return) d.y += 1;
                return d.y;
            });

        self.node.attr('transform', function(d) {
            return 'translate(' + d.x + ',' + d.y + ')';
        });

        self.force.stop();

        if ($(self.parent_id).hasClass('motion')) {
            setTimeout(function() {
                self.force.start();
            }, self.duration);
        } else {
            self.force.stop();
        }
    };

    this.pack.nodes({children: clusters});
    this.force.size([this.width, this.height])
        .nodes(this.nodes)
        .links(this.links)
        .on('tick', tick)
        .start();

    this.link.enter()
        .insert('line', '.node')
        .attr('class', 'link');

    this.node.append('circle')
        .attr('id', 'one')
        .attr('class', set_class)
        .attr('r', function(d) {
            return d.radius || self.min_radius;
        });

    var wrap = function(text, width) {
        width = width || text.attr('width');
        text.each(function() {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = text.style('font-size').slice(0, -2), // px
                y = text.attr("y"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "px");
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "px").text(word);
                }
            }
        });
    };

    var text_area = this.node.append('g');
    text_area.append('rect')
        .attr('width', function(d) {
            return d.radius * 1.4;
        })
        .attr('height', function(d) {
            return d.radius * 1.4;
        })
        .attr('x', function(d) {
            return -d.radius * 0.7;
        })
        .attr('y', function(d) {
            return -d.radius * 0.7;
        })
        .attr('id', 'two')
        .attr('fill', 'none');

    text_area.append('text')
        // .attr('id', 'one')
        .attr('y', function(d) {
            return -(d.radius * 0.7) / 2;
        })
        .attr('dy', '3px')
        .attr('class', 'circle-text')
        .attr('width', function(d) {
            return d.radius * 2;
        })
        .text(function(d) {
            return d.title;
        })
        .style('font-size', function(d) {
            return Math.max(3, Math.min(2 * d.radius, (2 * d.radius - 8) / this.getComputedTextLength() * 12)) + "px";
        })
        .style('text-anchor', 'middle')
        .call(wrap);



    this.update();
};

Cluster.prototype.tooltip_html = tooltip_html;
Cluster.prototype.show_verbatims = show_verbatims;
Cluster.prototype.helpers_init = helpers_init;

Cluster.prototype.update = function() {};


Cluster.prototype.wrangle = function() {
    var self = this;

    $(self.data.question.children).each(function(k, v) {
        self.verbatim_count += v.verbatim_count;
    });

    var nodes = [];
    nodes.push(self.data.question);
    self.full_count = 0;
    var children_len = 0;
    while (nodes.length > 0) {
        var root = nodes.pop();
        root.total = root.verbatim_count / self.verbatim_count;
        console.log(root);
        self.max_lengh = Math.max(self.max_lengh, root.title.length);
        self.max_depth = Math.max(self.max_depth || 0, root.code_depth);
        self.max_verbatim_count =  Math.max(self.max_verbatim_count || 0, root.verbatim_count);
        self.full_count += root.verbatim_count || 0;
        for (var i = 0; i < root.children.length; ++i) {
            nodes.push(root.children[i]);
        }
        children_len = Math.max(children_len, nodes.length);
    }

    self.max_depth += 1;
    self.raduis_scale.range([self.min_radius, self.width/children_len/2])
        .domain([1, self.full_count]);


    self.display_data = self.data;
};

Cluster.prototype.toggle_motion = function() {
    var self = this;
    var parent_id = '#svg';
    $(parent_id).toggleClass('motion');
    if ($(parent_id).hasClass('motion')) {
        self.force.start();
    }
};
