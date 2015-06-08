'use strict';

var show_menu = function(id_, div_id) {
    $(id_).toggleClass('hidden_menu');
    var full_height = $(div_id).height();
    var menu_pos = $(div_id).position();
    $(id_).height(full_height);
    $(id_).css({
        position: 'absolute',
        left: menu_pos.left + 1.5,
        top: '1.5px'
    });
    var width = '0%';
    var opacity = 0;
    if (!$(id_).hasClass('hidden_menu')) {
        width = '33%';
        opacity = 1;
    }
    $(id_)
    .animate({
        width: width,
        opacity: opacity
        }, 150);

    return false;
};