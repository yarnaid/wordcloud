var calculator = {
	pricing_levels : {
		1: 0.2,
		2: 0.16,
		3: 0.12,
		4: 1
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
	countCodingCost : function(data) {
		
		var A = this.language_rates[data.source_language];
		var B = data.sample_size;
		var C = this.previous_codebook_rate[data.previous_codebook.uses];
		var H = data.cell_number;
		var D1 = this.questions_categories.D1 * data.questions.brand_questions;
		var D2 = this.questions_categories.D2 * data.questions.short_questions;
		var D3 = this.questions_categories.D3 * data.questions.like_questions;
		var D5 = this.questions_categories.D5 * data.questions.brand_questions;
		var D6 = this.questions_categories.D6 * data.questions.brand_questions;
		var J = this.pricing_levels[1];

		return (A*B*C)*(D1*1+D2*1.5+D3*3+D5*8+D6*12)*J;  
	},

	/* (A*B*C)*(D1*1+D2*1.5+D3*3+D4*4+D5*8+D6*12)*Ht*9.5
	 * A - source language
	 * B - sample size
	 * C - new or previous codebook
	 * Ht - for numbers of cell
	 */
	timeCalculation : function(data) {
		var A = this.language_rates[data.source_language];
		var B = data.sample_size;
		var C = this.previous_codebook_rate[data.previous_codebook.uses];
		var Ht = this.timing_costs[data.cells_number];
		var D1 = this.questions_categories.D1 * data.questions.brand_questions;
		var D2 = this.questions_categories.D2 * data.questions.short_questions;
		var D3 = this.questions_categories.D3 * data.questions.like_questions;
		var D4 = this.questions_categories.D3 * data.questions.like_questions;
		var D5 = this.questions_categories.D5 * data.questions.brand_questions;
		var D6 = this.questions_categories.D6 * data.questions.brand_questions;


		return (A*B*C)*(D1*1+D2*1.5+D3*3+D4*4+D5*8+D6*12)*Ht*9.5;
	}
}

function format_time(seconds) {
	var hour_count = seconds/3600;
	var days = hour_count/24;
	var hours_left = hour_count-days*24
	return days+" days "+hour_count+" hours";
}