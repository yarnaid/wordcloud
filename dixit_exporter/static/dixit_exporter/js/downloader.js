'use strict';
/**
 * Created by yarnaid on 19/04/2015.
 */

var downloader = function (svg_id, output_format) {
    output_format = output_format || 'png';
    var tmp = document.getElementById(svg_id);
    var svg = document.getElementsByTagName('svg')[0];

    var svg_xml = (new XMLSerializer).serializeToString(svg);
    var form = document.getElementById('save_form');
    form['output_format'].value = output_format;
    form['data'].value = svg_xml;
    form.submit();
    return;
};


var download_png = function () {
    var svg = d3.select('svg');
    var width = svg.attr('width');
    var height = svg.attr('height');
    var html = svg
        .attr('version', 1.1)
        .attr('encoding', 'UTF-8')
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .node().parentNode.innerHTML;

    //console.log(html);
    var imgsrc = 'data:image/svg+xml;utf8,' + html;

    var canvas = document.querySelector('canvas'),
        context = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    var image = new Image;
    image.src = imgsrc;
    image.onload = function () {
        context.drawImage(image, 0, 0);

        var canvasdata = canvas.toDataURL('image/png');

        var pngimg = '<img src="' + canvasdata + '">';
        //d3.select('#pngdataurl').html(pngimg);

        var a = document.createElement('a');
        a.download = 'sample.png';
        a.href = canvasdata;
        a.click();
    };
};