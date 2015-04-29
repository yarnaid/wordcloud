'use strict';
/**
 * Created by yarnaid on 23/04/2015.
 */

var helpers_init = function() {
    this.percentage = d3.format('.1%');

    this.tooltip_elem = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    this.inited = true;
}

var show_verbatims = function(d) {
    if (d.overcode)
        return;
    $.ajax({
        method: 'post',
        url: window.location.href,
        data: {
            verbatim: true,
            id: d.code
        },
        success: function(answer) {
            var a = answer;
            bootbox.dialog({
                backdrop: false,
                message: '<table id="table-methods-table" data-search="true" data-show-refresh="true" data-show-toggle="true" data-show-export="true" data-pagination="true" data-show-columns="true" data-toggle="table" data-height="299">' +
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
                },
                onEscape: function() {return;}
            });
            var $table = $('#table-methods-table').bootstrapTable({
                data: answer,
                showExport: true,
                exportOptions: {
                    ignoreColumn: [0],
                    fileName: 'verbatim'
                }
            });
            //$('.modal-dialog').css('z-axis', '15000');
        }
    });
};

var tooltip_html = function(d) {
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
