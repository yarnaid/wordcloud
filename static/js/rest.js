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