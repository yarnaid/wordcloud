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
    console.log(path);
    var start = function() {
        var tmp;
        $.ajax({
            url: path,
            data: {all: true},
            success: function(j) {
                data_loaded(null, j);
            },
            method: 'post'});
    };
    start();
});