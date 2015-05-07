'use strict';
$(function() {
    var data = {};

    function init() {
        var cluster = new Cluster('#svg', data);
    };

    function data_loaded(err, _data) {
        if (!err) {
            data = _data;
            init();
        } else {
            console.log(err);
        }
    };

    var path = window.location.href
    var start = function() {
        var overcodes = {},
            codes = [],
            verbatims = {};
        var base_url = '/data/codes/?format=json&job=25&code_book=73'
        var clusters_by_id = {};
        $.ajax({
            url: base_url + '&overcode=True',
            success: function(_overcodes) {
                var tmp = _overcodes;
                _.map(tmp, function(value, key, list) {
                    if (value.text.length > 0) {
                        overcodes[value.text] = {
                            effecif: -1,
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
                // console.log(overcodes);
            }
        });
        $.ajax({
            url: base_url + '&overcode=False',
            success: function(_codes) {
                var tmp = _codes;

                _.map(tmp, function(value, key, list) {
                    if (value.text.length > 0) {
                        // console.log(value);

                        var cluster_id = value.parent.url.split('/').reverse()[1]
                        codes.push({
                            cluster: clusters_by_id[cluster_id].cluster,
                            code: value.code,
                            title: value.title,
                            question: value.text,
                            verbatims: value.children_verbatims,
                            effecif: value.children_verbatims.length,
                            total: -0.1,
                            repondants: -0.1,
                            id: value.id
                        });
                    }
                });

                var super_puper_data = {
                    clusters: overcodes,
                    nodes: codes
                };
                console.log(super_puper_data);
                data_loaded(null, super_puper_data);
            }
        });
        // $.ajax({
        //     url: path,
        //     data: {
        //         all: true
        //     },
        //     success: function(j) {
        //         data_loaded(null, j);
        //     },
        //     method: 'post'
        // });
    };
    start();
});
