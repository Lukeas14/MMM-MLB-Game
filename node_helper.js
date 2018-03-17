const NodeHelper = require('node_helper');
const request = require('request');
const moment = require('moment');



module.exports = function(){

	var mlbAPI = {
			host: 'http://statsapi.mlb.com/api/v1/',
			schedule: 'schedule'
		},
		sportId = 1, //MLB
		gameTypes = [
			"S", //spring training
			"R", //regular season
			"A", //all star
			"P", //playoffs
			"E", //exhibition
		];

	return NodeHelper.create({

		getSchedule: function(teamIds) {
			var url = mlbAPI.host + mlbAPI.schedule + '?sportId=' + sportId + '&gameTypes=' + gameTypes.join(",") + '&teamId=' + teamIds.join(",");
			request({
				url: url,
				method: 'GET'
			}, (error, response, body) => {
				if (!error && response.statusCode == 200) {
					var results = JSON.parse(body);
					this.sendSocketNotification("SCHEDULE_RESULTS", results);
				}
			});
		},

		start: function() {
			console.log("MLB Game module started!");
		},

		socketNotificationReceived: function(notification, payload) {
			if (notification === 'GET_SCHEDULE') {
				this.getSchedule(payload);
			}
		}

	});
}