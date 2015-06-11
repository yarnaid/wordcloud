$(document).ready(function() {
    var lastOpened = '';

    var lastOpenedSelector = '';

    var previousSelectedButton = null;

	var getSourceLang = function() {
		var checked_radio = 
					$("input[name='pt-language-choose']:checked")[0].id;

		var source_lang = $("label[for='"+checked_radio+"']").text();

		return source_lang
    }
   	
    $('#cells-number').change(
    	function(){
    		var diff = {
    			4: "65px",
    			3: "35px",
    			2: "18px",
    			1: "5px",
    			0: "0px",
    		}

    		$('.pt-options-list li').remove();
    		var number_of_cells = $('#cells-number')[0].valueAsNumber;
    		var width = number_of_cells * 47;
    		var percents_per_cell = 100.0/number_of_cells;

 			var mid = Math.floor(number_of_cells/2)+1;
 			if(number_of_cells%2==0)
 				mid = mid-1;

    		$('.pt-options-wrapper').css("width", width+"px");
    		$('.pt-options-list').css("width", width+"px");
    		for(var i=1; i<=number_of_cells; i++)
    			$('.pt-options-list').append(
    				"<li id='cell_"+i
    				+"' class='pt-options-tab' style='left:"+percents_per_cell*(i-1)+"%;top:"+diff[Math.abs(mid-i)]+";'><a href='#'>"+i+"</a></li>");
    	}
    );

    $('.pt-options-wrapper').on("mouseover",'.pt-options-tab',
    	function() {
    		var prev_top = $(this).css("top");
			
			if(this.className.indexOf('pt-options-tab-active')==-1) {
	    		$(this).css("top", parseInt(prev_top)-10+"px");
	    		$('.pt-outher-circle').toggleClass('pt-outher-circle-hover');
    		}
    	}
    );

    $('.pt-options-wrapper').on("mouseout",'.pt-options-tab',
    	function() {
    		var prev_top = $(this).css("top");
    		if(this.className.indexOf('pt-options-tab-active')==-1) {
	    		$(this).css("top", parseInt(prev_top)+10+"px");
	    		$('.pt-outher-circle').toggleClass('pt-outher-circle-hover');
	    	}
    	}
    );

    $('.pt-options-wrapper').on("click",'.pt-options-tab',
        function() {
            var prev_top = $('.pt-options-tab-active').css("top") 
            $('.pt-options-tab-active').css("top", parseInt(prev_top)+20+"px");;
            $('.pt-options-tab-active').removeClass('pt-options-tab-active');
            
            prev_top = $(this).css("top");
    		$(this).css("top", parseInt(prev_top)-10+"px");
            $(this).addClass('pt-options-tab-active');
            $('.pt-inner-circle').addClass('pt-inner-circle-show');
           	$('.pt-outher-circle').toggleClass('pt-outher-circle-hover');
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

    $("input[name='codebook-choose']").change(
		function() {
			if(this.id == 'codebook-use-previous') {
				$('.pt-codebooks-content').animate({ margin : '20% auto'})
				$('.pt-codebook-use-previous-content').slideDown();
			} else {
				$('.pt-codebooks-content').animate({ margin : '40% auto'})
				$('.pt-codebook-use-previous-content').hide();
			}
		}    
    )

    $("#perform-calculations").click(
    	function() {

    		var codebookFormHandler = function() {
    			var usePrevious = false;

    			var id = $("input[name='codebook-choose']:checked")[0].id;
    			if(id == 'codebook-use-previous')
    				usePrevious = true;

    			if(!usePrevious) {
    				return { uses: false};
    			} else {
    				if($("input[name='codebook-cell-or-job-choose']:checked")[0].id == "codebook-from-other-cell") {
    					var cell_num = $("#select-cell-number").val()
    					
    					return {
    						uses: true,
    						from: "cell",
    						cell_number: cell_num
    					}
    				} else {
    					var job_num = $("#select-job-number").val();
    					return {
							uses: true,
							from: "job",
							job_number: job_num
						}
					}
    			}
    		}

    		var cell_num = $('#cells-number')[0].valueAsNumber;
    		var sample_sz = $("#sample-size")[0].valueAsNumber;
    		var brand_q = $("#brand-question")[0].valueAsNumber;
    		var short_q = $("#one-word-question")[0].valueAsNumber;
    		var likes_q = $("#feeling-likes-question")[0].valueAsNumber;
    		var story_q = $("#story-question")[0].valueAsNumber;
    		var long_q  = $("#long-questions")[0].valueAsNumber;

    		var prev_codebook = codebookFormHandler();

    		var source_lang = getSourceLang();

    		var formArray = {
    			cells_number: cell_num,
    			source_language: source_lang,
    			sample_size: sample_sz,
    			previous_codebook: prev_codebook,
    			questions: {
    				brand_questions: brand_q,
    				short_questions: short_q,
    				like_questions : likes_q,
    				story_questions: story_q,
    				long_questions : long_q,
    			}
    		}

    		$(".pt-result-cost p").text(calculator.countCodingCost(formArray)+" Euro");
    		$(".pt-result-timing p").text((calculator.timeCalculation(formArray)));

    		$(lastOpened).fadeOut();
    		$(".buttons-wrapper").fadeOut();
    		$(".pt-results-wrapper").fadeIn();
    	}
    )

   $("input[name='pt-language-choose']").change(
    	function() {
    		$(".pt-verbatim-translation-languages input[type='checkbox']").removeAttr("disabled");
    		var source_lang = getSourceLang();

    		var checkboxId = source_lang.toLowerCase();

    		$('#pt-verbatim-translation-language-'+checkboxId).attr("disabled", true)
    	}
    )

    $("input[name='codebook-cell-or-job-choose']").change(
		function() {
			if(this.id == 'codebook-from-previous-job') {

				$('#codebook-cell-number-combobox').hide();
				$('#codebook-job-number-combobox').fadeIn()
			} else {
				$('#codebook-job-number-combobox').hide()
				$('#codebook-cell-number-combobox').fadeIn();
			}
		}    
    )

    $("#datepicker").datepicker({
        firstDay: 1,
        buttonImageOnly: true,
        showOtherMonths: true,
        selectOtherMonths: true,
    });

});

