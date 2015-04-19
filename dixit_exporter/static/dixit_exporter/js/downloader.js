'use strict';
/**
 * Created by yarnaid on 19/04/2015.
 */

function open_csv(csv) {
    var uri = 'data:text/csv;charset=utf-8,' + csv;
    var downloadLink = document.createElement("a");
    //var blob = new Blob(["\ufeff", csv]);
    //var url = URL.createObjectURL(blob);
    downloadLink.href = uri;
    downloadLink.download = "data.csv";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
};


var get_csv = function (path) {
    $.ajax({
        url: path,
        data: {all: true, csv: true},
        success: function (j) {
            //data_loaded(null, j);
            //window.open(j);
            //window.location.href = j.url;
            open_csv(j);
        },
        method: 'post'
    });
};
