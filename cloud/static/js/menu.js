'use strict';
/**
 * Created by yarnaid on 09/04/2015.
 */

$(function() {
    function init_picker(p_class) {
        var title_picker = $(p_class).colorpicker();
        title_picker.act = function (event) {
        };
        title_picker.on('changeColor.colorpicker', function (event) {
            var c = event.color;
            c.setAlpha(0.5);
            c = c.toRGB();
            title_picker.rgba = function () {
                return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + c.a + ')';
            };
            title_picker.act(event);
        });
        return title_picker;
    }

    var title_p = init_picker('.title-color');
    title_p.act = function (event) {
        $(".circle-text").css('fill', title_p.rgba());
    };
    var code_p = init_picker('.code-color');
    code_p.act = function (event) {
        $(".code").css('fill', code_p.rgba());
    };
    var overcode_p = init_picker('.overcode-color');
    overcode_p.act = function (event) {
        $(".overcode").css('fill', overcode_p.rgba());
    };
    var bg_color = init_picker('.background-color');
    bg_color.act = function (event) {
        $('svg').css('background', bg_color.rgba());
    };
    $('#randomize-colors').click(function () {
        $(".circle-text").css('fill', getRandomColor());
        $(".code").css('fill', getRandomColor());
        $(".overcode").css('fill', getRandomColor());
        $('svg').css('background', getRandomColor());
    })
});