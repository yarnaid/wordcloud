$(document).ready(function() {
	var formData = {}
    var lastOpened = '';

    var lastOpenedSelector = '';

    var previousSelectedButton = null;

	var getSourceLang = function() {
		var checked_radio = 
					$("input[name='pt-language-choose']:checked")[0].id;

		var source_lang = $("label[for='"+checked_radio+"']").text();

		return source_lang
    };

    var saveToBuffer = function(cellIndex, data) {
    	formData[cellIndex] = data;
    }; 
   	
    var saveDataFromCurrentForm = function() {

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
		};

		var verbatim_translation_arr = function(source_lang) {
			var arr = $(".pt-verbatim-translation-languages input");
			var result = [];
			for (var i = 0; i < arr.length; i++) {
				var lang = $('label[for="'+ arr[i].id+'"]').text();
				if(arr[i].checked && lang != source_lang)
					result.push(lang);
			}

			return result;
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
		var date_avl = undefined;
		var verb_trans_langs = verbatim_translation_arr(source_lang);

		var long_q_trans = $("#verbatim-translation-long-questions")[0].valueAsNumber;
		var story_q_trans = $("#verbatim-translation-story-questions")[0].valueAsNumber;
		var likes_q_trans = $("#verbatim-translation-feeling-likes-questions")[0].valueAsNumber;

		if($(".ui-datepicker-current-day")[0] != undefined)
			date_avl = $("#datepicker").datepicker("getDate");

		var formArray = {
			cells_number: cell_num,
			source_language: source_lang,
			sample_size: sample_sz,
			previous_codebook: prev_codebook,
			date_availability: date_avl,
			verbatim_translation_languages: verb_trans_langs, 
			likes_question_translation: likes_q_trans,
			story_question_translation: story_q_trans,
			long_question_translation: long_q_trans,
			verbatim_translation_languages: verb_trans_langs,
			questions: {
				brand_questions: brand_q,
				short_questions: short_q,
				like_questions : likes_q,
				story_questions: story_q,
				long_questions : long_q,
			}
		};
		return formArray;
    };

    var renderCellTabs = function(){
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


    var retainFormData = function(index) {
		$(".pt-verbatim-translation-languages input").prop("checked", false);
		$(".pt-verbatim-translation-languages input").attr("disabled", false);    	

    	var data = formData[index];
    	var prev_source_lang = "#pt-language-"+getSourceLang().toLowerCase();
    	$(prev_source_lang).prop("checked", false);
    	var source_lang = "#pt-language-"+data.source_language.toLowerCase();
		var disabled_lang = "#pt-verbatim-translation-language-"+data.source_language.toLowerCase();
		//alert(source_lang);
		$(source_lang).prop("checked", true);
		$(disabled_lang).attr("disabled", true);
		
    	$("#sample-size").val(data.sample_size);
		$("#brand-question").val(data.questions.brand_questions);
		$("#one-word-question").val(data.questions.short_questions);
		$("#feeling-likes-question").val(data.questions.like_questions);
		$("#story-question").val(data.questions.story_questions);
		$("#long-questions").val(data.questions.long_questions);
		if(data.date_availability != undefined) {
			$('#datepicker').datepicker("setDate", data.date_availability);
		}

		$("#verbatim-translation-long-questions").val(data.long_question_translation);
		$("#verbatim-translation-story-questions").val(data.story_question_translation);
		$("#verbatim-translation-feeling-likes-questions").val(data.likes_question_translation);

		for(var i = 0; i<data.verbatim_translation_languages.length; i++) {
			$("#pt-verbatim-translation-language-"
				+data.verbatim_translation_languages[i].toLowerCase()).prop("checked", true);
		}

		if(data.previous_codebook.uses) {
			$("#codebook-create-new").prop("checked", false);
			$("#codebook-use-previous").prop("checked", true);
			
			$(".pt-codebooks-content").animate({ margin : '20% auto'})
			$(".pt-codebook-use-previous-content").slideDown();
			$(".pt-codebook-use-previous-content input[type='radio']").prop("checked", false);
			if(data.previous_codebook.from == "cell"){
				$("#codebook-job-number-combobox").hide();
				$("#codebook-from-other-cell").prop("checked", true);
				$("#codebook-cell-number-combobox").show();
			} else {
				$("#codebook-cell-number-combobox").hide();
				$("#codebook-from-previous-job").prop("checked", true);
				$("#codebook-job-number-combobox").show();
			}
		} else {
			$("#codebook-create-new").prop("checked", true);
			$("#codebook-use-previous").prop("checked", false);
			$('.pt-codebooks-content').animate({ margin : '40% auto'})
			$('.pt-codebook-use-previous-content').slideUp();
		}
    };

    $('#cells-number').change(renderCellTabs);

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

        	var data = saveDataFromCurrentForm();
        	var new_number = parseInt(this.id.substring(this.id.indexOf('_')+1));

			if($('.pt-options-tab-active')[0] != undefined) {
	            var cell_number = parseInt($('.pt-options-tab-active')[0].id.substring(this.id.indexOf('_')+1));
	        	saveToBuffer(cell_number, data);
	        } else {
            	saveToBuffer(new_number, data);
	        }

            var prev_top = $('.pt-options-tab-active').css("top");
            
            if(cell_number != new_number) {
	        	$('.pt-options-tab-active').css("top", parseInt(prev_top)+20+"px");;
	            $('.pt-options-tab-active').removeClass('pt-options-tab-active');
	            
	            prev_top = $(this).css("top");
	    		$(this).css("top", parseInt(prev_top)-10+"px");
	            $(this).addClass('pt-options-tab-active');
	            $('.pt-inner-circle').addClass('pt-inner-circle-show');
	           	$('.pt-outher-circle').toggleClass('pt-outher-circle-hover');
	            $('.pt-outher-circle').addClass('pt-outher-circle-active');
				$('#datepicker tr td').removeClass('ui-datepicker-current-day');

	            $('.pt-verbatim-translation-languages input').prop("checked", false);
	            if(formData[new_number] != undefined)
	            	retainFormData(new_number, data);
	        }
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
				$('.pt-codebook-use-previous-content').slideUp();
			}
		}    
    )

    $("#perform-calculations").click(
    	function() {
    		//var formArray = saveDataFromCurrentForm();
    		var data = saveDataFromCurrentForm();
    		var cell_number = parseInt($('.pt-options-tab-active')[0].id.substring(this.id.indexOf('_')+1));
	        saveToBuffer(cell_number, data);
    		var cell_amount = $("#cells-number")[0].valueAsNumber;

    		$(".pt-result-cost p").text("€"+calculator.formatCurrency(calculator.countCodingCost(formData, cell_amount).total));
    		$(".pt-result-timing p").text(calculator.timeCalculation(formData, cell_amount).total);
    		
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


    // this sections sets defaults values (renders initial amount of cells, checks checkboxes etc)
    $('#pt-language-english').prop('checked', true);
    renderCellTabs();

    $('#codebook-create-new').prop('checked', true);
    $('#codebook-from-previous-job').prop('checked', true);
    $('.ui-datepicker-today').removeClass('ui-datepicker-current-day');
});

