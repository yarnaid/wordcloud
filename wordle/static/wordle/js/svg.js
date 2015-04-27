'use strict';
/**
 * Created by yarnaid on 18/04/2015.
 */
$(function() {
    var data = {};

    function init() {
        var cluster = new Wordle('#svg', data);
    };

    function data_loaded(err, _data) {
        if (!err) {
            data = _data;
            init();
        } else {
            console.log(err);
        }
    };

    var start = function() {
        $.ajax({
            url: window.location.href,
            data: {all: true},
            success: function(j) {
                data_loaded(null, j);
            },
            method: 'post'
        });
    };
    start();
});