'use strict';

var Cluster = function(_parent_id, _data, _eventHandler, _fps) {
    var self = this;
    this.parent_id = _parent_id;
    this.data = _data;
    this.event_handler = _eventHandler;
    this.fps = _fps || 40;
    this.gravity = 0.05;
    this.friction = 0.2;
    this.link_strength = 10;

    this.padding = 1.5; // separation between same-color nodes
    this.clusterPadding = 20; // separation between different-color nodes
    this.maxRadius = 12;
    this.margin = {
        top: 10,
        right: 40,
        bottom: 200,
        left: 10
    };

    this.percentage = d3.format('.1%');

    this.min_radius = 4.5;

    this.width = $(this.parent_id).width() - this.margin.left - this.margin.right;
    this.height = $(this.parent_id).height();
    this.height = Math.max(window.innerHeight, this.height);
    this.height = this.height - this.margin.top - this.margin.bottom;

    this.tooltip_elem = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    this.radius = function(node, key) {
        key = key || 'effecif';
        return node[key] * 2;
    };

    this.duration = 1000 / this.fps;

    this.force = d3.layout.force()
        .gravity(this.gravity)
        .friction(this.friction)
        .linkStrength(this.link_strength)
        .linkDistance(function(link) {
            return self.radius(link.source) + self.radius(link.target);
        })
        .charge(function(node) {
            return -30 * self.radius(node);
        });

    this.links = this.force.links();
    this.zoom = d3.behavior.zoom();

    this.init();
};


Cluster.prototype.init = function() {
    var self = this;

    var zoom = function() {
        self.svg.attr('transform',
            'translate(' + self.zoom.translate() + ') scale(' + self.zoom.scale() + ')');
    };

    this.svg = d3.select(this.parent_id).append('svg')
        .attr('width', this.width)
        .attr('height', this.height)
        // .attr('pointer-events', 'all')
        .append('svg:g')
        .call(self.zoom.on('zoom', zoom))
        .append('svg:g');

    // this.svg.append('rect') // do i need it?
    //     .attr('width', this.width)
    //     .attr('height', this.height)
    //     .style('fill', 'none');

    // update data
    this.wrangle();


    this.nodes = this.display_data.nodes;
    var clusters = this.display_data.clusters;

    $.each(clusters, function(k, v) {
        v.overcode = true;
        self.nodes.push(v);
    });

    this.nodes.forEach(function(n) {
        n.radius = self.radius(n);
        if (!n.overcode)
            n.overcode = false;

        var link = {
            source: n,
            target: clusters[n.cluster]
        };
        self.links.push(link);
    });

    this.link = this.svg.selectAll('.link').data(this.links);

    this.node = this.svg.selectAll('.node')
        .data(this.nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .call(this.force.drag)
        .on("mouseover", function(d) {
            self.tooltip_elem.transition()
                .duration(self.duration)
                .style("opacity", .95);
            self.tooltip_elem.html(self.tooltip_html(d))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            // .style("cursor", function () {return !d.overcode ? "pointer" : "default";});
        })
        .on("mouseout", function(d) {
            self.tooltip_elem.transition()
                .duration(self.duration)
                .style("opacity", 0);
        })
        .on("click", self.show_verbatims);


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

        self.node.attr('cx', function(d) {
                if (d.x > self.width - d.r) d.x -= 1;
                else if (d.x < d.r) d.x += 1;
                return d.x;
            })
            .attr('cy', function(d) {
                if (d.y > self.height - d.r) d.y -= 1;
                else if (d.y < d.r) d.y += 1;
                return d.y;
            });

        self.node.attr('transform', function(d) {
            return 'translate(' + d.x + ',' + d.y + ')';
        });

        self.force.stop();

        setTimeout(function() {
            self.force.start();
        }, self.duration);
    };

    this.force.size([this.width, this.height])
        .nodes(this.nodes)
        .links(this.links)
        .on('tick', tick)
        .start();

    this.link.enter()
        .insert('line', '.node')
        .attr('class', 'link');

    this.node.append('circle')
        .attr('class', function(d) {
            var c = d.overcode ? 'overcode' : 'code';
            return 'node ' + c;
        })
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
        .attr('fill', 'none');

    text_area.append('text')
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
        .style('fill', 'black')
        .style('text-anchor', 'middle')
        .call(wrap);


    this.update();
};

Cluster.prototype.tooltip_html = function(d) {
    var self = this;
    var code_html = '<tr>' +
        '<td><strong>Code number:</strong></td>' +
        '<td>' + d.code + '</td>' +
        '</tr>';
    var code = d.code ? code_html : '';
    var res = '<table class="table table-striped table-hover table-condensed">' +
        '<caption class="text-center"><h5><strong>' + d.title + '</strong></h5></caption>' +
        '<tbody>' +
        '<tr>' +
        '<td><strong>Effectif:</strong></td>' +
        '<td>' + d.radius + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td><strong>Code Title:</strong></td>' +
        '<td>' + d.question + '</td>' +
        '</tr>' +
        code +
        '<tr>' +
        '<td><strong>Repondents:</strong></td>' +
        '<td>' + self.percentage(d.repondants) + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td><strong>Total:</strong></td>' +
        '<td>' + self.percentage(d.total) + '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>';
    return res;
};

Cluster.prototype.show_verbatims = function(d) {
    if (d.overcode)
        return;
    $.ajax({method: 'post', url: window.location.href, data: {verbatim: true, id: d.code}, success: function(answer) {
        var a = answer;
        bootbox.dialog({
            backdrop: false,
            message: '<table id="table-methods-table" data-height="299">' +
                '<thead>' +
                '<tr>' +
                '<th data-field="state" data-checkbox="true"></th>' +
                '<th data-field="id">Responder ID</th>' +
                '<th data-field="answer">Item Answer</th>' +
                '</tr>' +
                '</thead>' +
                '</table>',
            title: d.question,
            buttons: {
                success: {
                    label: 'Ok',
                    className: 'btn-default'
                }
            }
        });
        var $table = $('#table-methods-table').bootstrapTable({
            data: answer
        });
        //$('.modal-dialog').css('z-axis', '15000');
    }});
};

Cluster.prototype.update = function() {};


Cluster.prototype.wrangle = function() {
    // var self = this;
    this.display_data = this.data;
};
