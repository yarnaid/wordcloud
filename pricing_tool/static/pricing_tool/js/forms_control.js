'use strict';
/**
 * Created by yarnaid on 26/04/2015.
 */

$(function () {

    var add_row = function (i, j) {
        j = j || i;
        // Note: Must use global replace here
        var html = $("#form_template_body").clone().html().replace(/__prefix__/g, j);
        $("#cells_table").append(html);
        ++fn;
    };

    var remove_row = function (i) {
        $('#cells_table tr')[i].hidden = true;
    };

    var show_field = function (i) {
        $('#cells_table tr')[i].hidden = false;
    };

    var fn = parseInt(0);
    var shown_fields = parseInt($("#id_fields_number").val());

    var price_table = function(cells) {
        var $table = $('#price_table').clone().bootstrapTable({
            data: cells
        });
        bootbox.dialog({
            backdrop: false,
            message: $table,
            title: 'Price in Points',
            buttons: {
                success: {
                    label: 'Ok',
                    className: 'btn-default',
                    callback: function(){$table.remove();}
                }
            },
            onEscape: function() {$table.remove();}
        });
    };

    $("#id_fields_number").change(function () {
        var quantity = parseInt($(this).val());

        if (shown_fields < quantity) {
            if (fn - 1 < shown_fields) {
                add_row(quantity, quantity - 1);
            } else {
                show_field(quantity);
            }
        } else {
            remove_row(quantity + 1);
        }
        shown_fields = quantity;
        $("[name=form-TOTAL_FORMS]").val(quantity);
    });
    for (var i = 0; i < shown_fields; ++i) {
        add_row(i);
        $("[name=form-TOTAL_FORMS]").val(1);
    }

    $('#pricing_form').submit(function (event) {
        event.preventDefault();

        $.ajax({
            method: 'post',
            //type: 'POST',
            url: window.location.href,
            data: $(this).serialize(),
            success: function (resp) {
                price_table(resp);
                return;
            }
        });
    });
});

var price_formatter = function price_formatter(value) {
    return value.toFixed(2) + ' <i class="glyphicon glyphicon-euro"></i>';
};

var time_formatter = function time_formatter(value) {
    return value.toFixed(0) + ' minute(s) <i class="glyphicon glyphicon-time"></i>';
};
