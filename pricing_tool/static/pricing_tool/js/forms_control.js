'use strict';
/**
 * Created by yarnaid on 26/04/2015.
 */

$(function () {
    var add_row = function (i) {
        // Note: Must use global replace here
        var html = $("#form_template_body").clone().html().replace(/__prefix__/g, i);
        $("#cells_table").append(html);
        fn += 1;
    };

    var remove_row = function (i) {
        $('#cells_table tr')[i].hidden = true;
    };

    var show_field = function (i) {
        $('#cells_table tr')[i].hidden = false;
    };

    var fn = 0;
    var shown_fields = $("#id_fields_number").val();

    $("#id_fields_number").change(function () {
        var quantity = $(this).val();
        $("[name=form-TOTAL_FORMS]").val(quantity);

        if (shown_fields < quantity) {
            if (fn  <= shown_fields) {
                add_row(quantity);
            } else {
                show_field(quantity);
            }
        } else {
            remove_row(quantity);
        }
        shown_fields = quantity;
    });
    for (var i = 0; i < shown_fields; ++i) {
        add_row(i);
    }
});