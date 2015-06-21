$(document).ready(function() {
	var formData = {}
    var lastOpened = '';
    var isIdentical = false;
    var lastOpenedSelector = '';
	var diff = {
		4: "65px",
		3: "35px",
		2: "18px",
		1: "5px",
		0: "0px",
	};

    var previousSelectedButton = null;

    var loadStudyTypes = function() {
    	var toRender = '';
    	for(var i=0; i<stubs.study_types.length; i++) {
    		toRender += "<option>"+stubs.study_types[i].name+"</options>"
    	}

    	$('#study-type').append(toRender);
    }

	var getSourceLang = function() {
		var checked_radio = 
					$("input[name='pt-language-choose']:checked")[0].id;

		var source_lang = $("label[for='"+checked_radio+"']").text();

		return source_lang
    };

    var saveToBuffer = function(cellIndex, data) {
    	formData[cellIndex] = data;
    }; 
   	
    var fillTablesWithData = function(data, cell_amount) {
    	$(".pt-summary-table-usual-row").remove();
    	$(".pt-summary-table-summary-row").remove();
    	var sumForEachCategory = {
    		"brand": 0,
    		"short": 0,
    		"story": 0,
    		"likes": 0,
    		"long" : 0
    	};
    	var toAdd = "";
    	for(var i=1; i<=cell_amount; i++){
    		var cellName = "Cell "+i;
    		var str = "<tr class='pt-summary-table-usual-row'>"+
    					  "<td><p>"+cellName+"</p></td>"+
	    				  "<td><p>"+data.for_each_cat[i]["brand"]+" €</p></td>"+
	    				  "<td><p>"+data.for_each_cat[i]["short"]+" €</p></td>"+
	    				  "<td><p>"+data.for_each_cat[i]["likes"]+" €</p></td>"+
	    				  "<td><p>"+data.for_each_cat[i]["story"]+" €</p></td>"+
	    				  "<td><p>"+data.for_each_cat[i]["long"]+" €</p></td>"+
    					  "<td><p>"+data.separate[cellName]+" €</p></td>"+
    				  "</tr>"
    		toAdd += str;

    		sumForEachCategory["brand"] += data.for_each_cat[i]["brand"];
    		sumForEachCategory["short"] += data.for_each_cat[i]["short"];
    		sumForEachCategory["likes"] += data.for_each_cat[i]["likes"];
    		sumForEachCategory["story"] += data.for_each_cat[i]["story"];
    		sumForEachCategory["long"] += data.for_each_cat[i]["long"];

    	}
    	toAdd += "<tr class='pt-summary-table-summary-row'>"+
    				"<td><p>total</p></td>"+
    				"<td><p>"+sumForEachCategory["brand"]+" €</p></td>"+
    				"<td><p>"+sumForEachCategory["short"]+" €</p></td>"+
    				"<td><p>"+sumForEachCategory["likes"]+" €</p></td>"+
    				"<td><p>"+sumForEachCategory["story"]+" €</p></td>"+
    				"<td><p>"+sumForEachCategory["long"]+" €</p></td>"+
    				"<td><p>"+data.total+" €</p></td>"+
    			"</tr>"

    	$("#summary-costs-table .pt-summary-table-header-row").after(toAdd);

    	if(data.translation_cost == 0) {
    		$(".pt-result-cost-translation-info").hide();
    	} else {
    		$("#summary-translation-costs-table pt-summary-table-usual-row").remove();
			$("#summary-translation-costs-table pt-summary-table-summary-row").remove();
	    	var sumForEachCategory = {
	    		"brand": 0,
	    		"short": 0,
	    		"story": 0,
	    		"likes": 0,
	    		"long" : 0
	    	};
			var toAdd = "";
			
			for(var i=1; i<=cell_amount; i++) {
				var cellName = "Cell "+i;
    			var str = 
	    				  "<tr class='pt-summary-table-usual-row'>"+
	    					  "<td><p>"+cellName+"</p></td>"+
		    				  "<td><p>"+(data.codebook_translation.for_each_cat[i]["brand"]).toFixed(2)+" €</p></td>"+
		    				  "<td><p>"+data.codebook_translation.for_each_cat[i]["short"].toFixed(2)+" €</p></td>"+
		    				  "<td><p>"+(data.codebook_translation.for_each_cat[i]["likes"]+data.verbatim_translation.for_each_cat[i]["likes"]).toFixed(2)+" €</p></td>"+
		    				  "<td><p>"+(data.codebook_translation.for_each_cat[i]["story"]+data.verbatim_translation.for_each_cat[i]["story"]).toFixed(2)+" €</p></td>"+
		    				  "<td><p>"+(data.codebook_translation.for_each_cat[i]["long"]+data.verbatim_translation.for_each_cat[i]["long"]).toFixed(2)+" €</p></td>"+
	    					  "<td><p>"+(data.codebook_translation.separate["Cell "+i]+data.verbatim_translation.separate["Cell "+i]).toFixed(2)+"€</p></td>"+
	    				  "</tr>"
    			toAdd += str;

				sumForEachCategory["brand"] += data.codebook_translation.for_each_cat[i]["brand"];
	    		sumForEachCategory["short"] += data.codebook_translation.for_each_cat[i]["short"];
	    		sumForEachCategory["likes"] += (data.codebook_translation.for_each_cat[i]["likes"]+data.verbatim_translation.for_each_cat[i]["likes"]);
	    		sumForEachCategory["story"] += (data.codebook_translation.for_each_cat[i]["story"]+data.verbatim_translation.for_each_cat[i]["story"]);
	    		sumForEachCategory["long"] += (data.codebook_translation.for_each_cat[i]["long"]+data.verbatim_translation.for_each_cat[i]["long"]);
			}

			var total =sumForEachCategory["brand"]+
						sumForEachCategory["short"]+
						sumForEachCategory["likes"]+
						sumForEachCategory["story"]+
						sumForEachCategory["long"];
			toAdd += 
				"<tr class='pt-summary-table-summary-row'>"+
    				"<td><p>total</p></td>"+
    				"<td><p>"+sumForEachCategory["brand"].toFixed(2)+" €</p></td>"+
    				"<td><p>"+sumForEachCategory["short"].toFixed(2)+" €</p></td>"+
    				"<td><p>"+sumForEachCategory["likes"].toFixed(2)+" €</p></td>"+
    				"<td><p>"+sumForEachCategory["story"].toFixed(2)+" €</p></td>"+
    				"<td><p>"+sumForEachCategory["long"].toFixed(2)+" €</p></td>"+
    				"<td><p>"+(data.verbatim_translation.total+data.codebook_translation.total).toFixed(2)+" €</p></td>"+
    			"</tr>"
			$("#summary-translation-costs-table .pt-summary-table-header-row").after(toAdd);			

    		$(".pt-result-cost-translation-info").show();
    	}
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

		var translation_arr = function(prefix, source_lang) {
			var arr = $(prefix+" input");
			var result = [];
			for (var i = 0; i < arr.length; i++) {
				var lang = $('label[for="'+ arr[i].id+'"]').text();
				if(arr[i].checked && lang != source_lang)
					result.push(lang);
			}

			return result;
		} 

		var am_pm = $("input[name='date-availability-choose']:checked")[0].id;
		if(am_pm == 'date-availability-am')
			am_pm = "AM";
		else 
			am_pm = "PM";

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
		var verb_trans_langs = translation_arr(".pt-verbatim-translation-languages", source_lang);
		var cb_trans_langs = translation_arr(".pt-codebook-translation-content", source_lang);
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
			codebook_translation_languages: cb_trans_langs,
			verbatims_translation: {
				likes_question_translation: likes_q_trans,
				story_question_translation: story_q_trans,
				long_question_translation: long_q_trans,
			},
			verbatim_translation_languages: verb_trans_langs,
			am_or_pm: am_pm,
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

    var renderIdenticalCellTabs = function(){
		var diff = {
			4: "55px",
			3: "25px",
			2: "8px",
			1: "-5px",
			0: "-10px",
		}

		$('.pt-options-list li').remove();
		var number_of_cells = $('#cells-number')[0].valueAsNumber;
		var width = number_of_cells * 47;
		var percents_per_cell = 100.0/number_of_cells;

		var mid = Math.floor(number_of_cells/2)+1;
		
		if(number_of_cells == 1)
			$("#identical-cells-field").hide();
		else 
			$("#identical-cells-field").show();

		if(number_of_cells%2==0)
			mid = mid-1;

		$('.pt-options-wrapper').css("width", width+"px");
		$('.pt-options-list').css("width", width+"px");
		for(var i=1; i<=number_of_cells; i++)
			if(i==1) {
				$('.pt-options-list').append(
					"<li id='cell_"+i
					+"' class='pt-options-tab pt-options-identical-tabs' style='left:"+percents_per_cell*(i-1)+"%;top:"+(parseInt(diff[Math.abs(mid-i)])-10)+"px;'><a href='#'>"+i+"</a></li>");
			} else {
				$('.pt-options-list').append(
					"<li id='cell_"+i
					+"' class='pt-options-tab pt-options-identical-tabs' style='left:"+percents_per_cell*(i-1)+"%;top:"+diff[Math.abs(mid-i)]+";'><a href='#'>"+i+"</a></li>");
			}
		$( '#cell_1' ).addClass('pt-options-tab-active')
	};

    var renderCellTabs = function(){
    	if(!isIdentical) {
			$('.pt-options-list li').remove();
			var number_of_cells = $('#cells-number')[0].valueAsNumber;
			var width = number_of_cells * 47;
			var percents_per_cell = 100.0/number_of_cells;

			var mid = Math.floor(number_of_cells/2)+1;
			
			if(number_of_cells == 1)
				$("#identical-cells-field").hide();
			else 
				$("#identical-cells-field").show();

			if(number_of_cells%2==0)
				mid = mid-1;

			$('.pt-options-wrapper').css("width", width+"px");
			$('.pt-options-list').css("width", width+"px");
			for(var i=1; i<=number_of_cells; i++)
				if(i==1) {
					$('.pt-options-list').append(
						"<li id='cell_"+i
						+"' class='pt-options-tab' style='left:"+percents_per_cell*(i-1)+"%;top:"+(parseInt(diff[Math.abs(mid-i)])-20)+"px;'><a href='#'>"+i+"</a></li>");
				} else {
					$('.pt-options-list').append(
						"<li id='cell_"+i
						+"' class='pt-options-tab pt-unvisited-tab' style='left:"+percents_per_cell*(i-1)+"%;top:"+diff[Math.abs(mid-i)]+";'><a href='#'>"+i+"</a></li>");
				}
			$( '#cell_1' ).addClass('pt-options-tab-active')
		}
	}

    var retainFormData = function(index) {
		$(".pt-verbatim-translation-languages input").prop("checked", false);
		$(".pt-verbatim-translation-languages input").attr("disabled", false);    	
		
		$(".pt-codebook-translation-content input").prop("checked", false);
		$(".pt-codebook-translation-content input").attr("disabled", false);    	

    	var data = formData[index];
    	var prev_source_lang = "#pt-language-"+getSourceLang().toLowerCase();
    	$(prev_source_lang).prop("checked", false);
    	var source_lang = "#pt-language-"+data.source_language.toLowerCase();
		var disabled_lang_1 = "#pt-verbatim-translation-language-"+data.source_language.toLowerCase();
		var disabled_lang_2 = "#pt-codebook-translation-language-"+data.source_language.toLowerCase();
		
		$(source_lang).prop("checked", true);
		
		$(disabled_lang_1).attr("disabled", true);
		$(disabled_lang_2).attr("disabled", true);
		
    	$("#sample-size").val(data.sample_size);
		$("#brand-question").val(data.questions.brand_questions);
		$("#one-word-question").val(data.questions.short_questions);
		$("#feeling-likes-question").val(data.questions.like_questions);
		$("#story-question").val(data.questions.story_questions);
		$("#long-questions").val(data.questions.long_questions);
		if(data.date_availability != undefined) {
			$('#datepicker').datepicker("setDate", data.date_availability);

			var checkboxId = "#date-availability-"+data.am_or_pm.toLowerCase();
			$(checkboxId).prop("checked", true);
		}


		$("#verbatim-translation-long-questions").val(data.verbatims_translation.long_question_translation);
		$("#verbatim-translation-story-questions").val(data.verbatims_translation.story_question_translation);
		$("#verbatim-translation-feeling-likes-questions").val(data.verbatims_translation.likes_question_translation);

		for(var i = 0; i<data.verbatim_translation_languages.length; i++) {
			$("#pt-verbatim-translation-language-"
				+data.verbatim_translation_languages[i].toLowerCase()).prop("checked", true);
		}

		for(var i = 0; i<data.codebook_translation_languages.length; i++) {
			$("#pt-codebook-translation-language-"
				+data.codebook_translation_languages[i].toLowerCase()).prop("checked", true);
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

    var fillTimingsTable = function(data, cell_amount) {
    	$("#timing-table .pt-summary-table-usual-row").remove();
    	$("#timing-table .pt-summary-table-summary-row").remove();

    	var toAdd = "";
    	for(var i=1; i<=cell_amount; i++) {
    		var cellName = "Cell "+i;
    		toAdd +=
    			"<tr class='pt-summary-table-usual-row'>"+
    				"<td><p>"+cellName+"</p></td>"+
    				"<td><p>"+calculator.formatTime(data.separate[cellName])+"</p></td>"+
    			"</tr>"
    	}

    	$("#timing-table .pt-summary-table-header-row").after(toAdd);
    }

    var fillDataDeliveryTable = function(data, cell_amount) {
    	$("#data-delivery-table .pt-summary-table-usual-row").remove();
    	$("#data-delivery-table .pt-summary-table-summary-row").remove();

    	var toAdd = "";

		for(var i=1; i<=cell_amount; i++) {
    		var cellName = "Cell "+i;
    		if(data.separate[cellName] != undefined)
	    		toAdd +=
	    			"<tr class='pt-summary-table-usual-row'>"+
	    				"<td><p>"+cellName+"</p></td>"+
	    				"<td><p>"+(data.separate[cellName][0])+"</p></td>"+
		  				"<td><p>"+(data.separate[cellName][1])+"</p></td>"
	    			"</tr>"
    	}
    	$('#data-delivery-table .pt-summary-table-header-row').after(toAdd)
    }

    $('#cells-number').change(function() {
    	var cell_number = parseInt($('.pt-options-tab-active')[0].id.substring($('.pt-options-tab-active')[0].id.indexOf('_')+1));

	    if(cell_number==NaN) return;
		
		var data = saveDataFromCurrentForm();
		alert
    	saveToBuffer(cell_number, data);

    	if(!isIdentical) {
    		renderCellTabs();
    	}
    	else {
    		renderIdenticalCellTabs();
    	}
    	retainFormData(1);
    });

    $('.pt-options-wrapper').on("mouseover",'.pt-options-tab',
    	function() {
    		var prev_top = $(this).css("top");
			
			if(this.className.indexOf('pt-options-tab-active')==-1) {
	    		//$(this).animate({top: parseInt(prev_top)-10+"px"});
	    		$(this).css("top", parseInt(prev_top)-10+"px");
	    		$('.pt-outher-circle').toggleClass('pt-outher-circle-hover');
	    		$('.pt-inner-circle').toggleClass('pt-inner-circle-hover');
    		}
    	}
    );

    $('.pt-options-wrapper').on("mouseout",'.pt-options-tab',
    	function() {
    		var prev_top = $(this).css("top");
    		if(this.className.indexOf('pt-options-tab-active')==-1) {
	    		//$(this).animate({top: parseInt(prev_top)+10+"px"});
	    		$(this).css("top", parseInt(prev_top)+10+"px");
	    		$('.pt-outher-circle').toggleClass('pt-outher-circle-hover');
	    		$('.pt-inner-circle').toggleClass('pt-inner-circle-hover');
	    	}
    	}
    );

    $('.pt-options-wrapper').on("click",'.pt-options-tab',
        function() {

			if($('.pt-options-tab-active')[0] != undefined ) {
	 	       	var cell_number = parseInt($('.pt-options-tab-active')[0].id.substring(this.id.indexOf('_')+1));

	 	       	if(cell_number==NaN) return;
        		var data = saveDataFromCurrentForm();
	        	saveToBuffer(cell_number, data);

	        	var new_number = parseInt(this.id.substring(this.id.indexOf('_')+1));
	            var prev_top = $('.pt-options-tab-active').css("top");
	            
	            if(cell_number == new_number) {
	            	return;
	            } else {
		        	$('.pt-options-tab-active').css("top", parseInt(prev_top)+20+"px");;
		            $('.pt-options-tab-active').removeClass('pt-options-tab-active');
		        }
		    } 
            prev_top = $(this).css("top");
    		$(this).css("top", parseInt(prev_top)-10+"px");
            $(this).addClass('pt-options-tab-active');
            $(this).removeClass('pt-unvisited-tab');
            $('.pt-inner-circle').toggleClass('pt-inner-circle-hover');
            $('.pt-inner-circle').addClass('pt-inner-circle-active');
           	$('.pt-outher-circle').toggleClass('pt-outher-circle-hover');
            $('.pt-outher-circle').addClass('pt-outher-circle-active');
			$('#datepicker tr td').removeClass('ui-datepicker-current-day');

            $('.pt-verbatim-translation-languages input').prop("checked", false);
            if(formData[new_number] != undefined) {
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
            $(".pt-pricing-level-popup").fadeIn(200);
            var width = $(".pt-pricing-level-popup-content").css("width");
            $("#level-pricings-pin").css("left", parseInt(width)/2+"px");
        },
        function() {
            $(this)
                .css('border', '2px solid #AAA');
            $(".pt-pricing-level-popup").fadeOut(200);
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

    $("input[name='identical-cells']").change(
    	function() {
    		var checkedId = this.id;
    		isIdentical = (checkedId == "identical-cells-yes") ? true: false;
    		if(isIdentical) {
    			var data = saveDataFromCurrentForm();
    		
    			renderIdenticalCellTabs();

    			for(var i = 1; i<=$("#cells-number")[0].valueAsNumber; i++)
    				saveToBuffer(i, data);
    		}
    		else renderCellTabs();
    	}
    );

    $("#perform-calculations").click(
    	function() {
    		var data = saveDataFromCurrentForm();
    		var arr = $('.pt-options-tab-active');
    		
    		if(arr.length!=0) {
    			var activeCellString = arr[0].id;
    			var cell_number = parseInt(activeCellString.substring(activeCellString.indexOf("_")+1));

	        	saveToBuffer(cell_number, data);
	        }
    		/*
    		 *	Getting level stub
    		 */

    		var level = $("#level-stub").val();
    		level = parseInt(level.substring(level.lastIndexOf(' ')));
    		formData['level'] = level;

    		var cell_amount = $("#cells-number")[0].valueAsNumber;
    		var timestamp = calculator.timeCalculation(formData, cell_amount);
    		var outputData = calculator.countCodingCost(formData, cell_amount);
    		var dataDeliveryData = calculator.getDataDeliveryDate(formData, timestamp, cell_amount);
    		
    		$(".pt-result-cost p").text("€"+calculator.formatCurrency(outputData.total+outputData.translation_cost));
    		$(".pt-result-timing p").text(calculator.formatTime(timestamp.total));
    		$(".pt-result-data-delivery p").text(dataDeliveryData.total);


    		fillTablesWithData(outputData, cell_amount);
    		fillTimingsTable(timestamp, cell_amount);
    		fillDataDeliveryTable(dataDeliveryData, cell_amount);

    		$(lastOpened).fadeOut();
    		$(".buttons-wrapper").fadeOut();
    		$(".pt-results-wrapper").fadeIn();
    	}
    )

    $("input[name='pt-language-choose']").change(
    	function() {
    		$(".pt-verbatim-translation-languages input[type='checkbox']").removeAttr("disabled");
    		$(".pt-codebook-translation-content input[type='checkbox']").removeAttr("disabled");
    		var source_lang = getSourceLang();

    		var checkboxId = source_lang.toLowerCase();

    		$('#pt-codebook-translation-language-'+checkboxId).attr("disabled", true)
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

    $('#confirm-button').click(
    	function() {
	    	$( "#confirm-order-dialog" ).dialog('open');
    	}
    );

    $('#save-button').click(
    	function() {
    		$("#save-order-dialog").dialog("open");
    	}
    );

    $('#contact-button').click(
    	function() {
    		$('#contact-dialog').dialog("open");
    	}
    );

    $("#datepicker").datepicker({
        firstDay: 1,
        buttonImageOnly: true,
        showOtherMonths: true,
        selectOtherMonths: true,
    });

    $(".pt-result-cost, .pt-result-timing, .pt-result-data-delivery").hover(
    	function() {
    		$('.'+this.className+'-popup').fadeIn(200);
    		var height = $('.'+this.className+'-popup-content').css("height");
    		$('.'+this.className+'-popup-content').css("top", -(parseInt(height)/2-35))
    	},
    	function() {
    		$('.'+this.className+'-popup').fadeOut(200);
    	}
    );

    $("#study-type").on('change', function() {
    	var selectedIndex = $('#study-type')[0].selectedIndex;
    	var studyType = stubs.study_types[selectedIndex];

    	var propMap = {
    		likes: ["#feeling-likes-question",'like_questions'],
    		one_word: ["#one-word-question",'short_questions'],
    		story: ["#story-question","story_questions"]
    	}
    	$(".pt-questions-content input").val(0);

    	var questions = studyType.properties.questions
    	for(var key in questions){
    		if(questions.hasOwnProperty(key)) {
    			$(propMap[key][0]).val(questions[key]);
    		}
    	}

    	data = saveDataFromCurrentForm();

		for(var i = 1; i<=$("#cells-number")[0].valueAsNumber; i++) {
			formData[i].questions = data.questions;
			formData[i].sample_size = data.sample_size;
		}
    })

    $( "#confirm-order-dialog" ).dialog({
    	modal: true,
    	draggable: false,
    	dialogClass: "order-dialog",
    	autoOpen: false,
    	width: 500,
    	buttons : [
    		{
    			text: "Ok",
    			id: "button-confirm-confirm-project",
			    click: function() {
		        	$( this ).dialog( "close" );
		      	}
    		},
    		{
    			text: "Cancel",
    			id: "button-cancel-confirm-project",
    			click: function() {
		        	$( this ).dialog( "close" );
		      	}
    		}
    	]
    });

    $( '#save-order-dialog' ).dialog({
    	modal: true,
    	draggable: false,
    	dialogClass: "order-dialog",
    	autoOpen: false,
    	width: 500,
    	buttons : [
    		{
    			text: "Ok",
    			id: "button-ok-save-project",
    			click: function() {
		        	$( this ).dialog( "close" );
		      	}
    		},
    		{
    			text: "Cancel",
    			id: "button-cancel-save-project",
    			click: function() {
		        	$( this ).dialog( "close" );
		      	}
    		}
    	]
    });

    $( '#contact-dialog' ).dialog({
    	modal: true,
    	draggable: false,
    	dialogClass: "order-dialog",
    	autoOpen: false,
    	width: 500,
    	buttons : [
    		{
    			text: "Ok",
    			id: "button-ok-contact",
    			click: function() {
		        	$( this ).dialog( "close" );
		      	}
    		},
    		{
    			text: "Cancel",
    			id: "button-ok-contact",
    			click: function() {
		        	$( this ).dialog( "close" );
		      	}
    		}
    	]
    });

	var unvisitedBlinker = setInterval(function() { 
		$('.pt-unvisited-tab').animate({opacity:0.6},750);
		$('.pt-unvisited-tab').animate({opacity:1},750);
	}, 1500);

    // this sections sets defaults values (renders initial amount of cells, checks checkboxes etc)
	$('#pt-codebook-translation-language-english').prop('disabled', true);
	$('#pt-verbatim-translation-language-english').prop('disabled', true);

	//$('pt-r')
    renderCellTabs();
    loadStudyTypes();

    $('#codebook-create-new').prop('checked', true);
    $('#codebook-from-previous-job').prop('checked', true);
    $('.ui-datepicker-today').removeClass('ui-datepicker-current-day');
    $( '#cell_1' ).addClass('pt-options-tab-active')
    $('.pt-results-wrapper').hide();

    $('#pt-language-english').prop('checked', true);
    $('.pt-inner-circle').addClass('pt-inner-circle-active');
    $('.pt-outher-circle').addClass('pt-outher-circle-active');
});

