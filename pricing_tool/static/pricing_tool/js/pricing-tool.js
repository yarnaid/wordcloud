$(document).ready(function() {
    var lastOpened = '';

    var lastOpenedSelector = '';

    var previousSelectedButton = null;

    $('.pt-options-list a').hover(
        function() {
            $('.pt-outher-circle').toggleClass('pt-outher-circle-hover');
        }
    );

    $('.pt-options-list a').click(
        function() {
            $('.pt-options-list a').removeClass('pt-options-list-active');
            $(this).addClass('pt-options-list-active');
            $('.pt-inner-circle').addClass('pt-inner-circle-show');
            $('.pt-outher-circle').addClass('pt-outher-circle-active');
        }
    );

    $('.pt-language-selector, .pt-sample-size-selector, .pt-questions-selector, .pt-verbatim-translation-selector, .pt-date-availability-selector, .pt-codebooks-selector, .pt-codebook-translation-selector').click(
        function() {
            // hide results
            $('.pt-results-wrapper').hide();
            // hide all other containers
            $(lastOpened).hide();
            // remove all other active classes
            // alert(this);
            $(lastOpenedSelector).removeClass(lastOpenedSelector.substring(1) + '-active');
            // set the active class
            $(this).toggleClass(this.className + '-active');
            // show current container and form controls
            var content_classname = '.' + this.className.split(' ')[0].substring(0, this.className.split(' ')[0].lastIndexOf('-selector')) + '-content';
            $(content_classname).fadeIn();
            $('.buttons-wrapper').fadeIn();
            lastOpened = content_classname;
            lastOpenedSelector = '.' + this.className.split(' ')[0];
        }
    );

    $('.pt-progress-bar-wrapper').hover(
        function() {
            $(this)
                .css('border', '2px solid #00F');
        },
        function() {
            $(this)
                .css('border', '2px solid #AAA');
        }
    );

    $('.button-verbatim-translation').click(
        function() {
            if (previousSelectedButton !== null) {
                $(previousSelectedButton).removeClass("button-verbatim-translation-selected");
            } else
                $('#number').removeClass("button-verbatim-translation-selected");
            $(this).toggleClass('button-verbatim-translation-selected');

            if (this.id == 'number') {
                $(".pt-verbatim-translation-languages").hide();
                $(".pt-verbatim-translation-labels").fadeIn();
            } else {
                $(".pt-verbatim-translation-labels").hide();
                $(".pt-verbatim-translation-languages").fadeIn();
            }
            previousSelectedButton = this;
        }
    );

    $("#datepicker").datepicker({
        firstDay: 1,
        buttonImageOnly: true,
        showOtherMonths: true,
        selectOtherMonths: true,
    });

});
