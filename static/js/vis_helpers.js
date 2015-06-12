'use strict';
/**
 * Created by yarnaid on 23/04/2015.
 */

 var Rest = function() {
    var self = this;
};


Rest.prototype.get_jobs = function() {
    var self = this;
    var jobs;
    $.ajax({
        async: false,
        url: '/data/jobs/?format=json',
        success: function(jobs_) {
            jobs = jobs_;
        }
    });
    return jobs;
};


Rest.prototype.get_last_job = function() {
    return _(this.get_jobs()).last();
};


Rest.prototype.get_questions = function(job_id) {
    var self = this;
    var questions;
    if (!job_id) {
        job_id = this.get_last_job().id;
    }
    $.ajax({
        async: false,
        url: '/data/questions/?format=json&parent=' + job_id,
        success: function(questions_) {
            questions = questions_;
        }
    });
    return questions.reverse();
};


Rest.prototype.get_short_questions = function(job_id, extra_params) {
    var self = this;
    var questions;
    if (!job_id) {
        job_id = this.get_last_job().id;
    }
    var url = '/data/short_questions/?format=json&parent=' + job_id;
    if (extra_params) {
        url += extra_params;
    }
    $.ajax({
        async: false,
        url: url,
        success: function(questions_) {
            questions = questions_;
        }
    });
    return questions.reverse();
};


Rest.prototype.get_variables = function(job_id) {
    var self = this;
    var variables;
    if (!job_id) {
        job_id = this.get_last_job().id;
    }
    $.ajax({
        async: false,
        url: '/data/short_questions/?format=json&kind=Variable&parent=' + job_id,
        success: function(variables_) {
            variables = variables_;
        }
    });
    return variables;
};


Rest.prototype.get_variable_codes = function(var_id) {
    var self = this;
    var codes;
    $.ajax({
        async: false,
        url: '/data/variable_codes/?format=json&parent=' + var_id,
        success: function(variables_) {
            codes = variables_;
        }
    });
    return codes;
};


Rest.prototype.get_last_question = function(job_id) {
    return _(this.get_questions(job_id)).last();
};


Rest.prototype.get_verbatims = function(code_id) {
    var self = this;
    var verbatims;
    $.ajax({
        async: false,
        url: '/data/verbatims/?format=json&parent=' + code_id,
        success: function(v) {
            verbatims = v;
        }
    });
    return verbatims;
};


var helpers_init = function() {
    this.percentage = d3.format('.1%');

    this.tooltip_elem = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

    this.rest = new Rest();
    this.inited = true;
};

var show_verbatims = function(d) {
    if (d.overcode)
        return;
    var rest = new Rest();
    var verbatims = rest.get_verbatims(d.code_id);
    verbatims = verbatims.filter(function(v) {return parseInt(v.variable.uid) >= 0;});
    verbatims.forEach(function(v) {
        v.uid = v.variable.uid;
        // 'sex', 'age_bands', 'reg_quota',
                  // 'csp_quota', 'main_cell_text'
                  v.sex = v.variable.sex;
                  v.age = v.variable.age_bands;
                  v.region = v.variable.reg_quota;
                  v.csp = v.variable.csp_quota;
                  v.main_cell_text = v.variable.main_cell_text;
              });

    bootbox.dialog({
        backdrop: false,
        message: '<table id="table-methods-table" data-search="true" data-show-refresh="true" data-show-toggle="true" data-show-export="true" data-pagination="true" data-show-columns="true" data-toggle="table">' +
        '<thead>' +
        '<tr>' +
        '<th data-field="state" data-checkbox="true"></th>' +
        '<th data-field="uid">Responder ID</th>' +
        '<th data-field="verbatim">Item Answer</th>' +
        '<th data-field="sex">Item Sex</th>' +
        '<th data-field="age">Item Age</th>' +
        '<th data-field="region">Item Region</th>' +
        '<th data-field="csp">Item CSP</th>' +
        '<th data-field="main_cell_text">Item Mian Cell Text</th>' +
        '</tr>' +
        '</thead>' +
        '</table>',
        title: d.question,
        buttons: {
            success: {
                label: 'Ok',
                className: 'btn-default'
            }
        },
        onEscape: function() {
            return;
        }
    });
    var $table = $('#table-methods-table').bootstrapTable({
        data: verbatims,
        showExport: true,
        exportOptions: {
            ignoreColumn: [0],
            fileName: 'verbatim'
        }
    });
};

var tooltip_html = function(d) {
    var self = this;
    var code_html = '<tr>' +
    '<td><i>Code number:</i></td>' +
    '<td>' + d.code + '</td>' +
    '</tr>';
    var code = d.code ? code_html : '';
    var res = '<div id="tooltip-border"><table class="table table-striped table-hover table-condensed">' +
    '<caption class="text-center">' + d.title + '</caption>' +
    '<tbody>' +
    '<tr>' +
    '<td><i>Effectif:</i></td>' +
    '<td>' + d.radius + '</td>' +
    '</tr>' +
    '<tr>' +
    '<td><i>Code Title:</i></td>' +
    '<td>' + d.question + '</td>' +
    '</tr>' +
    code +
    '<tr>' +
    '<td><i>Repondents:</i></td>' +
    '<td>' + self.percentage(d.repondants) + '</td>' +
    '</tr>' +
    '<tr>' +
    '<td><i>Total:</i></td>' +
    '<td>' + self.percentage(d.total) + '</td>' +
    '</tr>' +
    '</tbody>' +
    '</table></div>';
    return res;
};

var get_vis_data = function(job_id, question_name, col) {
    col = col || 1;
    var overcodes = {},
        codes = [],
        verbatims = {},
        res;
    var rest = new Rest();
    var question = rest.get_short_questions(job_id, "&name="+question_name)[0];
    var code_book_id = question.code_book.id;
    var base_url = '/data/codes/?format=json&job=' + job_id +'&code_book=' + code_book_id;
    var clusters_by_id = {};
        $.ajax({
            async: false,
            url: base_url + '&overcode=True',
            success: function(_overcodes) {
                var tmp = _overcodes;
                _.map(tmp, function(value, key, list) {
                    if (value && value.text.length > 0) {
                        overcodes[value.text] = {
                            effecif: 0,
                            repondants: -0.1,
                            total: -0.1,
                            cluster: value.text,
                            cluster_id: value.id,
                            title: value.title,
                            question: value.text,
                            id: value.id
                        };
                        clusters_by_id[value.id] = overcodes[value.text];
                    }
                });
            }
        });
        $.ajax({
            async: false,
            url: base_url + '&overcode=False',
            success: function(_codes) {
                var tmp = _codes;
                var filter_params = eval('get_filter_params_'+col+'()');
                // console.log(filter_params);

                _.map(tmp, function(value, key, list) {
                    if (value.text.length > 0) {
                        var cluster_id = value.parent.id;
                        value.children_verbatims = value.children_verbatims.filter(function(verbatim) {
                            var sel_val;
                            var res = true;
                            var selectors = {
                                Age: 'age_bands',
                                Region: 'reg_quota',
                                Csp: 'csp_quota',
                                Sexe: 'sex'
                            };
                            for (var k in selectors) {
                                sel_val = $('select#sel-'+k).val();
                                if (sel_val > -1 && verbatim.variable[selectors[k]] == sel_val) {
                                    console.log(sel_val, k, verbatim.variable, selectors[k]);
                                    res = false;
                                }
                            }
                            return res;
                        });
                        if (value.children_verbatims.length > 0) {
                            codes.push({
                                cluster: clusters_by_id[cluster_id].cluster,
                                code: value.code,
                                code_id: value.id,
                                title: value.title,
                                question: value.text,
                                verbatims: value.children_verbatims,
                                effecif: value.children_verbatims.length,
                                total: -0.1,
                                repondants: -0.1,
                                id: value.id
                            });
                        }
                        clusters_by_id[cluster_id].effecif += value.children_verbatims.length;
                    }
                });

                res = {
                    clusters: overcodes,
                    nodes: codes
                };
            }
        });
    return res
}


var make_svg = function(Vis, toggle_motion_id, svg_parent_id_, col) {
    var col = col || 1;
    var data = {};
    var rest = new Rest();
    var event_handler = get_filter_event_handler();

    var on1 = $(event_handler).on('filter_menu_update')
    $(event_handler).on('filter_menu_update', function() {
        $(svg_parent_id_ || '#svg' + ' svg').remove();
        start();
    });

    function init() {
        var svg_parent_id = svg_parent_id_ || '#svg';
        var cluster = new Vis(svg_parent_id, data);
        if (toggle_motion_id) {
            $(toggle_motion_id).click(function() {
                $(svg_parent_id).toggleClass('motion');
                if($(svg_parent_id).hasClass('motion')) {
                    cluster.force.start();
                } else {
                    cluster.force.stop();
                }
            });
        }
    };

    function data_loaded(err, _data) {
        if (!err) {
            data = _data;
            init();
        } else {
            console.log(err);
        }
    }

    var path = window.location.href;
    var start = function() {
        var params = eval('get_filter_params_'+col+'()');
        var vis_data = get_vis_data(params.job, params.question);
        data_loaded(null, vis_data);
    };
    start();
}