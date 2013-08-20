(function ($, undefined) {
	
	"use strict";

	$.fn.myGantt = function (options) {
		var scales = ["hours", "days", "weeks", "months"];
		//Default settings
		var settings = {
			source: null,
			months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			dow: ["S", "M", "T", "W", "T", "F", "S"]
		};
		/**
		* Extend options with default values
		*/
		if (options) {
			$.extend(settings, options);
		}

		var core = {

			mifuncion: function(element){
				alert(element);
			},

            create: function (element) {
                // Initialize data with a json object or fetch via an xhr
                // request depending on `settings.source`
                if (typeof settings.source !== "string") {
                    element.data = settings.source;
                    core.init(element);
                } else {
                    $.getJSON(settings.source, function (jsData) {
                        element.data = jsData;
                        core.init(element);
                    });
                }

            },

            init: function (element) {
            	// To init and call "render" methos (not done)
            }

		}

 		this.each(function () {
            this.data = null;
            core.create(this);
        });		
    };

})(jQuery);