'use strict';
$(function() {
    var data = {};
    var rest = new Rest();

    function init() {
        var svg_parent_id = '#svg';
        var cluster = new Cluster(svg_parent_id, data);
        $('#toggle_motion').click(function() {
            $(svg_parent_id).toggleClass('motion');
            if($(svg_parent_id).hasClass('motion')) {
                cluster.force.start();
            } else {
                cluster.force.stop();
            }
        });
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
        var overcodes = {},
            codes = [],
            verbatims = {};
        var base_url = '/data/codes/?format=json&job=25&code_book=73';
        var clusters_by_id = {};
        // var question = rest.get_last_question();
        // var question_codes = question.code_book.childern_codes;
        $.ajax({
            url: base_url + '&overcode=True',
            success: function(_overcodes) {
                var tmp = _overcodes;
                _.map(tmp, function(value, key, list) {
                    if (value.text.length > 0) {
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
            url: base_url + '&overcode=False',
            success: function(_codes) {
                var tmp = _codes;

                _.map(tmp, function(value, key, list) {
                    if (value.text.length > 0) {

                        var cluster_id = value.parent.id;
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
                        clusters_by_id[cluster_id].effecif += value.children_verbatims.length;
                    }
                });

                var super_puper_data = {
                    clusters: overcodes,
                    nodes: codes
                };
                data_loaded(null, super_puper_data);
            }
        });
    };
    start();
});
