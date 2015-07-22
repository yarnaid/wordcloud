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

Rest.prototype.get_all_verbatims_of_subnet = function(subnet_id) {
    var verbatims;
    $.ajax({
        async: false,
        url: '/data/subnet_verbatims/?format=json&id='+subnet_id,
        success: function(vars) {
            verbatims = vars
        }
    })
    return verbatims;
}

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

Rest.prototype.get_verbatims_on_link = function(link) {
    var source_verbatims = this.get_verbatims(link.source.id, link.question_id)
    var target_verbatims = this.get_verbatims(link.target.id, link.question_id)

    return target_verbatims.concat(source_verbatims);
}

Rest.prototype.get_verbatims = function(code_id, question_id) {
    var self = this;
    var verbatims;
    $.ajax({
        async: false,
        url: '/data/verbatims/?format=json&parent=' + code_id + '&question=' + question_id,
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
    else {
        var rest = new Rest();

        if(d.children != null || d._children !=null) 
        {//DIRTY HACK
            var code_tree = rest.get_all_verbatims_of_subnet(d.id, d.question_id);
            
            var dfs = function(arr) {

                function dfs(arr,res) {
                    if(arr.length==0) 
                        return res;

                    var children_codes = [];
                    for(var i = 0; i<arr.length; i++) {
                        res = res.concat(arr[i].children_verbatims);
                        children_codes = children_codes.concat(arr[i].children_codes)
                    }
                    return dfs(children_codes, res)
                }

                return dfs(arr, [])
            }
            var verbatims = dfs(code_tree)
        }
        else {
            var verbatims = rest.get_verbatims(d.id, d.question_id);
            if (verbatims.length < 1) {
                return;
            }
        }
        display_table_with_verbatims(verbatims);
    }
};

var display_table_with_verbatims = function(verbatims) {
    verbatims.forEach(function(v) {
        v.uid = v.variable.uid;
        v.sex = v.variable.sex;
        v.age = v.variable.age_bands;
        v.region = v.variable.reg_quota;
        v.csp = v.variable.csp_quota;
        v.main_cell_text = v.variable.main_cell_text;
    });
    verbatims = verbatims.filter(function(v) {return parseInt(v.variable.uid) >= 0;});
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
        title: "",
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
}

var show_verbatims_on_link = function(d) {
    var verbatims = new Rest().get_verbatims_on_link(d);
    display_table_with_verbatims(verbatims);
}

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
    '<td>' + d.verbatim_count + '</td>' +
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

var coocurence_tooltip_html = function(d) {
    var self = this;
    var code_html = '<tr>' +
    '<td><i>Code number:</i></td>' +
    '<td>' + d.code + '</td>' +
    '</tr>';
    var code = d.code ? code_html : '';
    var res = '<div id="tooltip-border"><table class="table table-striped table-hover table-condensed">' +
    '<caption class="text-center">Number of coocurences</caption>' +
    '<tbody>' +
    '<tr>' +
    '<td><i>Value:</i></td>' +
    '<td>' + d.value + '</td>' +
    '</tr>' +
    '<tr>' +
    '<td><i>'+d.cell_1.title+'</i></td>' +
    '<td>' + d.cell_1.value + '</td>' +
    '</tr>' +
    '<tr>' +
    '<td><i>'+d.cell_2.title+'</i></td>' +
    '<td>' + d.cell_2.value + '</td>' +
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
        response,
        _data
    var rest = new Rest();
    var question = rest.get_short_questions(job_id, "&name="+question_name)[0];
    var filter_params = eval('get_filter_params_'+col+'()');
    var url_ = '/data/visualization_data/?format=json';
    var url_coocurence = '/data/coocurence/?format=json'
    var _checked = filter_params["checked"]
    delete filter_params["checked"]
    $.each(filter_params, function(k, v) {
        if (v !== '-1') {
            url_ += '&' + k + '=' + v;
            url_coocurence += '&' + k + '=' + v;
        }
    });
    if(!_checked)
        $.ajax({
            async: false,
            url: url_,
            success: function(data_) {
                _data = data_;
            }
        });
    else 
        $.ajax({
            async: false,
            url: url_coocurence,
            success: function(data_) {
                _data = data_;
            }
        });

    return {data: _data, checked: _checked};
};


var make_svg = function(vis_list, toggle_motion_id, svg_parent_id_, col) {
    var col = col || 1;
    var data = {};
    var rest = new Rest();
    var event_handler = eval('get_filter_event_handler_'+col+'()');

    // var on1 = $(event_handler).on('filter_menu_update')
    $(event_handler).on('filter_menu_update', function() {
        $((svg_parent_id_ || '#svg') + ' svg').remove();
        start();
    });

    function init(vis_) {
        var svg_parent_id = svg_parent_id_ || '#svg';
        var cluster = new vis_list[vis_](svg_parent_id, data);
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

    function data_loaded(err, _data, vis_) {
        if (!err) {
            data = _data;
            init(vis_);
        } else {
            console.log(err);
        }
    };

    var path = window.location.href;
    var start = function() {
        var params = eval('get_filter_params_'+col+'()');
        var vis_data = get_vis_data(params.job, params.question, col);
        var vis_type = params.visualization;
        data_loaded(null, vis_data, vis_type);
    };
    start();
};
