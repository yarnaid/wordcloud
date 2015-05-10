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
    return questions;
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
