var calculator = {
	month_names: [
		"January",
		"February", 
		"March", 
		"April", 
		"May", 
		"June",
	  	"July",
	  	"August", 
	  	"September", 
	  	"October", 
	  	"November", 
	  	"December"
	],

	verbatim_extractions : {
		G2: 1.5,
		G3: 3,
		G4: 4,
		G5: 8,
		G6: 12,
	},

	pricing_levels : {
		1: 0.2,
		2: 0.16,
		3: 0.12,
		4: 0.1
	},

	timing_costs : {
		1:1,
		2:1,
		3:1.5,
		4:1.5,
		5:2,
		6:2,
		7:2.5,
		8:2.5,
		9:2.5,
	},

	language_rates : {
		French : 1,
		English : 1,
		German : 1,
		Spanish : 1,
		Cantonese : 1.5,
		Mandarin : 1.5,
		Italian : 1,
		NL: 1.2,
		Portuguese: 1.2
	}, 

	questions_categories : {
		D1: 1,
		D2: 1.5,
		D3: 3,
		D4: 4,
		D5: 8,
		D6: 12
	},

	previous_codebook_rate : {
		true: 0.75,
		false: 1,
	},

	/*
	 * (A*B*C*H)*(D1*1+D2*1.5+D3*3+D5*8+D6*12)*J
	 * J - pricing level
	 * A - source language
	 * B - sample size
	 * C - new or previous codebook
	 * H - number of cells
	 * D1 - brand questions
	 * D2 - one word
	 * D3 - likes
	 * D5 - story
	 * D6 - long
	 */
	countCodingCost : function(data,cell_amount) {
		var total_sum = 0;
		var sum_for_separate_cell = {};
		var foreach = {}

		for(var i=1; i<=cell_amount; i++) {
			var A = this.language_rates[data[i].source_language];
			var B = data[i].sample_size;
			var C = this.previous_codebook_rate[data[i].previous_codebook.uses];
			var J = this.pricing_levels[data.level];

			var D1 = (A*B*C*J)*this.questions_categories.D1 * data[i].questions.brand_questions;
			var D2 = (A*B*C*J)*this.questions_categories.D2 * data[i].questions.short_questions;
			var D3 = (A*B*C*J)*this.questions_categories.D3 * data[i].questions.like_questions;
			var D5 = (A*B*C*J)*this.questions_categories.D5 * data[i].questions.story_questions;
			var D6 = (A*B*C*J)*this.questions_categories.D6 * data[i].questions.long_questions;
			var cell_cost = (D1+D2+D3+D5+D6);
			var cell_name = "Cell "+i;

			foreach[i] = {
				"brand": D1,
				"story": D5,
				"short": D2,
				"long" : D6,
				"likes": D3 
			};

			sum_for_separate_cell[cell_name] = cell_cost;

			total_sum += cell_cost;
		}
		
		var verbatimTranslationCost = this.computeVerbatimTranslationCosts(data, cell_amount);
		var codebookTranslationCost = this.computeCodebookTranslationCosts(data, cell_amount);
		
		return {
			total : total_sum,
			translation_cost: verbatimTranslationCost.total+codebookTranslationCost.total,
			separate : sum_for_separate_cell,
			for_each_cat : foreach,
			verbatim_translation: verbatimTranslationCost,
			codebook_translation: codebookTranslationCost,
		};  
	},

	/* (A*B*C)*(D1*1+D2*1.5+D3*3+D4*4+D5*8+D6*12)*Ht*9.5
	 * A - source language
	 * B - sample size
	 * C - new or previous codebook
	 * Ht - for numbers of cell
	 */
	timeCalculation : function(data, cell_amount) {
		var total_sum = 0;
		var sum_for_separate_cell = {};

		var translationTime = this.computeVerbatimTranslationTime(data, cell_amount);
		var codebookTranslationCost = this.computeCodebookTranslationTime(data, cell_amount);
		
		for(var i=1; i<=cell_amount; i++) {

			var A = this.language_rates[data[i].source_language];
			var B = data[i].sample_size;
			var C = this.previous_codebook_rate[data[i].previous_codebook.uses];
			var Ht = this.timing_costs[cell_amount];

			var D1 = (A*B*C)*Ht*9.5*this.questions_categories.D1 * data[i].questions.brand_questions;
			var D2 = (A*B*C)*Ht*9.5*this.questions_categories.D2 * data[i].questions.short_questions;
			var D3 = (A*B*C)*Ht*9.5*this.questions_categories.D3 * data[i].questions.like_questions;
			var D4 = 0;//this.questions_categories.D3 * data[i].questions._questions;
			var D5 = (A*B*C)*Ht*9.5*this.questions_categories.D5 * data[i].questions.story_questions;
			var D6 = (A*B*C)*Ht*9.5*this.questions_categories.D6 * data[i].questions.long_questions;

			var cell_cost = (D1+D2+D3+D4+D5+D6);
			var cell_name = "Cell "+i;

			if(translationTime.separate[cell_name] != undefined)
				cell_cost += translationTime.separate[cell_name];

			if(codebookTranslationCost.separate[cell_name] != undefined)
				cell_cost += codebookTranslationCost.separate[cell_name];

			sum_for_separate_cell[cell_name] = cell_cost;

			total_sum += cell_cost;
		}

		return {
			total : total_sum+translationTime.total+codebookTranslationCost.total,
			separate : sum_for_separate_cell,
			separate_for_translation : translationTime.separate,
			separate_for_codebook : codebookTranslationCost.separate,
		};  
	},

	/*
	 * (A*E*H)*(D1*1+D2*1.5+D3*3+D4*4+D5*8+D6*12)*(C/10)*J
	 */
	computeCodebookTranslationCosts : function(data, cell_amount) {
		var total_sum = 0;
		var sum_for_separate_cell = {};
		var foreach = {};

		for(var i=1; i<=cell_amount; i++) {

			var A = this.language_rates[data[i].source_language];
			var E = 0;
			for(var j=0; j<data[i].codebook_translation_languages.length; j++) {
				E += this.language_rates[data[i].codebook_translation_languages[j]];
			}
			var B = data[i].sample_size;
			var J = this.pricing_levels[data.level];
			
			var H = this.timing_costs[cell_amount];
			var D1 = (A*E*H)*(B/10)*J*this.questions_categories.D1 * data[i].questions.brand_questions;
			var D2 = (A*E*H)*(B/10)*J*this.questions_categories.D2 * data[i].questions.short_questions;
			var D3 = (A*E*H)*(B/10)*J*this.questions_categories.D3 * data[i].questions.like_questions;
			var D4 = 0;//this.questions_categories.D3 * data[i].questions._questions;
			var D5 = (A*E*H)*(B/10)*J*this.questions_categories.D5 * data[i].questions.story_questions;
			var D6 = (A*E*H)*(B/10)*J*this.questions_categories.D6 * data[i].questions.long_questions;

			var cell_cost = (D1+D2+D3+D4+D5+D6);
			var cell_name = "Cell "+i;

			foreach[i] = {
				"brand" : D1,
				"short" : D2,
				"likes" : D3,
				"story" : D5,
				"long": D6,
			}
			sum_for_separate_cell[cell_name] = cell_cost;

			total_sum += cell_cost;
		}

		return {
			total : total_sum,
			for_each_cat : foreach,
			separate : sum_for_separate_cell,
		};  
	},

	/*
	 * (A*E)*(D1*1+D2*1.5+D3*3+D4*4+D5*8+D6*12)*(C/10)*Ht*9.5
	 */	
	computeCodebookTranslationTime : function(data, cell_amount) {
		var total_sum = 0;
		var sum_for_separate_cell = {};

		for(var i=1; i<=cell_amount; i++) {

			var A = this.language_rates[data[i].source_language];
			var E = 0;
			for(var j=0; j<data[i].codebook_translation_languages.length; j++) {
				E += this.language_rates[data[i].codebook_translation_languages[j]];
			}
			var C = this.previous_codebook_rate[data[i].previous_codebook.uses];
			var Ht = this.timing_costs[data[i].cells_number];
			
			var D1 = this.questions_categories.D1 * data[i].questions.brand_questions;
			var D2 = this.questions_categories.D2 * data[i].questions.short_questions;
			var D3 = this.questions_categories.D3 * data[i].questions.like_questions;
			var D4 = 0;//this.questions_categories.D3 * data[i].questions._questions;
			var D5 = this.questions_categories.D5 * data[i].questions.story_questions;
			var D6 = this.questions_categories.D6 * data[i].questions.long_questions;
		
			var cell_cost = 0;
			cell_cost = (A*E)*(D1+D2+D3+D4+D5+D6)*(C/10)*Ht*9.5;
			var cell_name = "Cell "+i;

			sum_for_separate_cell[cell_name] = cell_cost;

			total_sum += cell_cost;
		}

		return {
			total : total_sum,
			separate : sum_for_separate_cell
		};  
	},

	/*
	 * (A*F)*(G6*12+G3*3+G4*4+G5*8)*2*J
	 * F - rate for language
	 * G6 - for story questions
	 * G3 - for likes
	 * G4 - for twitter
	 * G5 - long 
	 */
	computeVerbatimTranslationCosts: function(data, cell_amount) {
		var totalCount = 0;
		var perCell = {};
		var foreach = {};
		
		for(var i=1; i<=cell_amount; i++) {
			var A = this.language_rates[data[i].source_language];
			var F = 0;
			for(var j=0; j<data[i].verbatim_translation_languages.length; j++) {
				F += this.language_rates[data[i].verbatim_translation_languages[j]];
			}

			var J = this.pricing_levels[data.level];
			var G6 = (A*F)*2*J*this.verbatim_extractions.G6 * data[i].verbatims_translation.long_question_translation;
			var G3 = (A*F)*2*J*this.verbatim_extractions.G3 * data[i].verbatims_translation.likes_question_translation;
			var G5 = (A*F)*2*J*this.verbatim_extractions.G5 * data[i].verbatims_translation.story_question_translation;

			var cell_count = (G6+G3+G5);
			totalCount += cell_count;

			foreach[i] = {
				"long": G5,
				"likes": G3,
				"story": G6
			}
			perCell["Cell "+i] = cell_count;
		}

		return {
			total: totalCount,
			for_each_cat: foreach,
			separate: perCell
		}
	},

	/*
	 * (A*F)*(G6*1.5+G3*3+G4*4+G5*8)*2*Ht*9.5
	 * F - rate for language
	 * G6 - for long questions
	 * G3 - for likes
	 * G4 - for twitter
	 * G5 - long 
	 * Ht - for numbers of cell
	 */
	computeVerbatimTranslationTime : function(data, cell_amount) {
		var totalCount = 0;
		var perCell = {};
		for(var i=1; i<=cell_amount; i++) {
			var A = this.language_rates[data[i].source_language];
			var F = 0;
			for(var j=0; j<data[i].verbatim_translation_languages.length; j++) {
				F += this.language_rates[data[i].verbatim_translation_languages[j]];
			}

			var G6 = this.verbatim_extractions.G6 * data[i].verbatims_translation.story_question_translation;
			var G3 = this.verbatim_extractions.G3 * data[i].verbatims_translation.likes_question_translation;
			var G5 = this.verbatim_extractions.G3 * data[i].verbatims_translation.story_question_translation;
			var Ht = this.timing_costs[data[i].cells_number];

			var cell_count = (A*F)*(G6+G3+G5)*2*Ht*9.5;
			totalCount += cell_count;

			perCell["Cell "+i] = cell_count;
		}

		return {
			total: totalCount,
			separate: perCell
		}
	},

	getDataDeliveryDate: function(data, timings, cell_amount) {

		var latest = 0;
		var separate = {}

		for(var i=1; i<=cell_amount; i++) {
			var date = data[i].date_availability;
			var cell_name = "Cell "+i;
			if(date != undefined) {
				var time = date.getTime();
				if(data[i].am_or_pm == "PM")
					time += 60*60*13*1000;
				if (time>latest)
					latest = time;
				date = new Date(time);
				
				var lastDate = new Date(date.getTime()+timings.separate[cell_name]*1000);
				var am_pm = (date.getUTCHours()>13 ? "PM" : "AM");
				
				separate[cell_name] = [];
				separate[cell_name].push(data[i].am_or_pm +" "+date.getDate()+" "+
					this.month_names[date.getMonth()]+" "+date.getFullYear());
				
				var am_pm = (lastDate.getUTCHours()>13)? "PM" : "AM";
				separate[cell_name].push(am_pm +" "+lastDate.getDate()+" "+
					this.month_names[lastDate.getMonth()]+" "+lastDate.getFullYear());
			}
		}
		if(latest!=0) {
			var lastDate = new Date(latest+timings.total*1000);
			var am_pm = ((lastDate.getUTCHours()>13)? "PM" : "AM");

			return {
				total: am_pm +" "+lastDate.getDate()+" "+this.month_names[lastDate.getMonth()]+" "+lastDate.getFullYear(),
				separate: separate
			}
		} else 
			return { 
				total : "",
				separate: separate
			}
	},

	formatCurrency : function(str) {
		return str.toFixed(2).replace(/./g, function(c, i, a) {
		    return i && c !== "." && ((a.length - i) % 3 === 0) ? '\'' + c : c;
		});
	},

	formatTime : function(seconds) {
		var secondsInDay = 60*60*24;
		var fullDays = Math.floor(seconds/secondsInDay);
		var left = seconds - fullDays*secondsInDay;
		if(left - secondsInDay/2>0) {
			fullDays++;
			return fullDays+" days";
		} else 
			return fullDays+" ½ days";
	}
}
