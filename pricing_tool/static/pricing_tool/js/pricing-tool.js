$(document).ready(function() {

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

    $('.pt-language-selector').click(
        function() {
            // hide results
            $('.pt-results-wrapper').hide();
            // hide all other containers
            $('.pt-sample-size-content').hide();
            $('.pt-questions-content').hide();
            // set the active class
            $(this).toggleClass('pt-language-selector-active');
            // remove all other active classes
            $('.pt-sample-size-selector').removeClass('pt-sample-size-selector-active');
            $('.pt-questions-selector').removeClass('pt-questions-selector-active');
            // show current container and form controls
            $('.pt-language-content').fadeIn();
            $('.buttons-wrapper').fadeIn();
        }
    );

    $('.pt-sample-size-selector').click(
        function() {
            // hide results
            $('.pt-results-wrapper').hide();
            // hide all other containers
            $('.pt-language-content').hide();
            $('.pt-questions-content').hide();
            // set the active class
            $(this).toggleClass('pt-sample-size-selector-active');
            // remove all other active classes
            $('.pt-language-selector').removeClass('pt-language-selector-active');
            $('.pt-questions-selector').removeClass('pt-questions-selector-active');
            // show current container and form controls
            $('.pt-sample-size-content').fadeIn();
            $('.buttons-wrapper').fadeIn();
        }
    );

    $('.pt-questions-selector').click(
        function() {
            // hide results
            $('.pt-results-wrapper').hide();
            // hide all other containers
            $('.pt-language-content').hide();
            $('.pt-sample-size-content').hide();
            // set the active class
            $(this).toggleClass('pt-questions-selector-active');
            // remove all other active classes
            $('.pt-sample-size-selector').removeClass('pt-sample-size-selector-active');
            $('.pt-language-selector').removeClass('pt-language-selector-active');
            // show current container and form controls
            $('.pt-questions-content').fadeIn();
            $('.buttons-wrapper').fadeIn();
        }
    );

});
