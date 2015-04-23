'use strict';
/**
 * Created by yarnaid on 23/04/2015.
 */

$(function () {
    var data = {};

    function init() {
        var tree = new Tree('#svg', data);
    };
    function data_loaded(err, _data) {
        if (!err) {
            data = _data;
            init();
        } else {
            console.log(err)
        }
    };
    function start() {
        $.ajax({
            url: window.location.href,
            data: {all: true},
            success: function(d) {
                data_loaded(null, d);
            },
            method: 'post'
        });
    };

    start();
});