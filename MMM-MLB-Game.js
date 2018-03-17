/*
 * Module: MMM-MLB-Game
 *
 * Author: Lukeas14
 */
Module.register("MMM-MLB-Game", {

	defaults: {
		teams: [119],
		updateInterval: 30000, //30 seconds
	},

	getScripts: function() {
		return ["moment.js"]
	},

	getStyles: function() {
		return ["MMM-MLB.css"];
	},


	start: function(){
		Log.info("Starting MLB Game module...");

		this.gamesInProgress = false;
		this.games = {};

		this.updateGames();
	},

	scheduleUpdate: function() {
		var self = this;
		this.updateGames();
		setInterval(function(){
			self.updateGames()
		}, this.config.updateInterval);
	},

	updateGames: function() {
		for(var i=0; i < this.config.teams.length; i++) {
			var teamId = this.config.teams[i];
			this.sendSocketNotification('GET_TEAM_SCHEDULE', teamId);
		}
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification === 'TEAM_SCHEDULE_RESULTS') {
			this.processSchedule(payload);
		}
	},

	processSchedule: function(schedule) {
		this.gamesInProgress = (schedule["totalGamesInProgress"] > 0) ? true : false;
		if (!this.gamesInProgress) return;

		for (i=0; i < schedule.dates.length; i++) {
			var date = schedule.dates[i];
				for (i=0; i < date.games; i++) {
					var game = date.games[i];

					if (!(game.gamePk in this.games)) {
						this.games[game.gamePk] = {};
					}

					this.games[game.gamePk] = game;
				}
		}
	},

	getDom: {

	},


});