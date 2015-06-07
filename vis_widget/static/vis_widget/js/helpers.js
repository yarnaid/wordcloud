'use strict';

var show_menu = function(id_, div_id) {
    $(id_).toggleClass('hidden_menu');
    var full_height = $(div_id).height();
    var menu_pos = $(div_id).position();
    $(id_).width('30%');
    $(id_).height(full_height);
    $(id_).css({
        position: 'absolute',
        left: menu_pos.left,
        top: 0
    });
    $(id_).animate({
        width: '70%'
    }, 1000);
    return false;
};