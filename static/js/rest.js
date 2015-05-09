'use strict';

var Rest = function(){
	var self = this;
};


Rest.prototype.get_jobs = function() {
	var self = this;
	var jobs;
	$.ajax({
		async: false,
		url: '/data/jobs/?format=json',
		success: function(jobs_) {
			jobs = jobs_;
		}
	});
	return jobs;
};


Rest.prototype.get_last_job = function() {
    return _(this.get_jobs()).last();
};


Rest.prototype.get_questions = function(job_id) {
    var self = this;
    var questions;
    if (!job_id) {
        job_id = this.get_last_job().id;
    }
    $.ajax({
        async: false,
        url: '/data/questions/?format=json&parent=' + job_id,
        success: function(questions_) {
            questions = questions_;
        }
    });
    return questions;
};


Rest.prototype.get_last_question = function(job_id) {
    return _(this.get_questions(job_id)).last();
};


Rest.prototype.get_verbatim = function(code_id) {
    var self = this;
    var verbatims;
    $.ajax({
        async: false,
        url: '/data/verbatims/?format=json&parent=' + code_id,
        success: function(v) {
            verbatims = v;
        }
    });
    return verbatims;
};