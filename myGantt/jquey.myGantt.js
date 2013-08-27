(function ($, undefined) {
	
	"use strict";

	$.fn.myGantt = function (options) {
		//Default settings
		var settings = {
			source: null,
			months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			dow: ["S", "M", "T", "W", "T", "F", "S"]
		};
		//line settings
		var lineOptions = {lsize: 1, lcolor: "#9999ff", lstyle: "solid"};

		/**
		* Extend options with default values
		*/
		if (options) {
			$.extend(settings, options);
		}

		var core = {
			create: function (element) {
				// Initialize data with a json object or fetch via an xhr
				// request depending on 'settings.source'
				if (typeof settings.source !== "string") {
					element.myGantt.data = settings.source;
					core.init(element);
				} else {
					$.getJSON(settings.source, function (jsData) {
						element.myGantt.data = jsData;
						core.init(element);
					});
				}
			},

			init: function (element) {
				helpers.getDaySize(element);
				helpers.getRect(element);
				this.render(element);
			},

			render: function(element){			
				var lP = this.leftPanel(element);
				element.append(lP);
				var rP = this.rightPanel(element)
				element.append(rP);
				rP.on('scroll', function () {
    				lP.scrollTop($(this).scrollTop());
				});
				this.drawLinks(element);

			},

			leftPanel: function(element){
				var lP = $("<div>").addClass("myGantt-rightPannel");
				lP.css({
					height: element.myGantt.height + "px",
					width: Math.ceil(element.myGantt.width/3) - 1 + "px",
					position: "relative",
					float: "left",
					overflow:"hidden",
					"overflow-x":"scroll"
				});

				var spacer = $("<div>");
				lP.append(spacer);

				$.each(element.myGantt.data, function(index, value) {
					var title = $("<div>");
					title.attr( "id", "myGanttName-"+value.id).addClass( "myGant-row row " + helpers.oddClass(index) ).css({overflow:"hidden"});
					var text = $("<span>");
					text.html(value.name);
					title.append(text);
					lP.append(title);
				});
				return lP;
			},

			rightPanel: function(element){
				helpers.getDatesRange(element);
				this.drawRightHeader(element);
				var rP = $("<div>").addClass("myGantt-leftPannel");
				rP.css({
					height: element.myGantt.height + "px",
					width: Math.ceil(element.myGantt.width/3) * 2 + "px",
					float: "right",
					overflow:"scroll"
				});
				this.drawNodes(element, rP);
				$.each(element.myGantt.data, function(index, value) {
					var title = $("<div>");
					title.attr( "id", "myGanttRow-"+value.id).addClass("myGant-row dayGrid " + helpers.oddClass(index)).css({width: helpers.diffDates(element.myGantt.maxDate,element.myGantt.minDate) * 24 + 25 + "px"});
					rP.append(title);
				});
				return rP;
			},

			drawNodes: function(element, rP){
				helpers.getNodesPosition(element);
				var links = $("<div>");
				links.addClass("myGantt-Links").css({position:"relative", float:"right", top:0,width:"100%",height:"100%"});
				rP.append(links);

				$.each(element.myGantt.data, function(index, value) {
					var node = $("<div>");
					var startPosition = helpers.diffDates(element.myGantt.minDate, value.start) * element.myGantt.daySettings.width + element.myGantt.daySettings.width / 4;
					var endPosition = helpers.diffDates(value.start, value.end) * element.myGantt.daySettings.width + element.myGantt.daySettings.width / 2;
					node.attr( "id", "myGanttNode-"+value.id).addClass("myGantt-node").css({
						position:"absolute",
						top: value.position.top + (element.myGantt.daySettings.height/2 - element.myGantt.barHeight/2) +"px", 
						left: startPosition +"px",
						width: endPosition + "px",
						height: element.myGantt.barHeight + "px"
					});
					links.append(node);
				});
			},

			drawLinks: function(element){
				$.each(element.myGantt.data, function(index, value) {
					if( typeof value.children != "undefined"){
						$.each(value.children, function(idx, node){
							var lineThis = $.extend(true, lineOptions);
							lineThis = $.extend(lineThis, node.line);
							core.drawLink($("#myGanttNode-"+value.id), $("#myGanttNode-"+node.id), null, element, lineThis);
						});
					};
				});				
			},

			drawRightHeader: function(element){
				var dates = helpers.DateRange(element.myGantt.minDate, element.myGantt.maxDate)
			},

			/**************************************
			+ DRAW LINKS
			***************************************/
			drawLink: function (from, to, type, myGantt, line) {
				/*
				  Copyright (c) 2012-2013 Open Lab
				  Written by Roberto Bicchierai and Silvia Chelazzi http://roberto.open-lab.com
				  Permission is hereby granted, free of charge, to any person obtaining
				  a copy of this software and associated documentation files (the
				  "Software"), to deal in the Software without restriction, including
				  without limitation the rights to use, copy, modify, merge, publish,
				  distribute, sublicense, and/or sell copies of the Software, and to
				  permit persons to whom the Software is furnished to do so, subject to
				  the following conditions:

				  The above copyright notice and this permission notice shall be
				  included in all copies or substantial portions of the Software.

				  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
				  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
				  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
				  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
				  LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
				  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
				  WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
				*/
				/*
					MODIFIED BY MikeRoguez
				*/
				var peduncolusSize = 10;

				/**
				* A representation of a Horizontal line
				*/
				function HLine(width, top, left, line) {
					var hl = $("<div>").addClass("myGantt-link-lines");
					hl.css({
						"border-width": line.lsize+"px 0px 0px",
						"border-style": line.lstyle,
						"border-color": line.lcolor,
						left: left,
						width: width,
						top: top - line.lsize / 2,
						position: "absolute"
					});
					return hl;
				};


				/**
				* A representation of a Vertical line
				*/
				function VLine(height, top, left, line) {
					var vl = $("<div>").addClass("myGantt-link-lines");
					vl.css({
						height: height,
						left:left - line.lsize / 2,
						"border-width": "0px 0px 0px "+line.lsize+"px",
						"border-style": line.lstyle,
						"border-color": line.lcolor,						
						top: top,
						position: "absolute"
					});
					return vl;
				};				

				/**
				* Given an item, extract its rendered position
				* width and height into a structure.
				*/
				function buildRect(item) {
					var rect = item.position();
					rect.width = item.width();
					rect.height = item.height();

					return rect;
				}

				/**
				* The default rendering method, which paints a start to end dependency.
				*
				* @see buildRect
				*/
				function drawStartToEnd(rectFrom, rectTo, peduncolusSize, line) {
					var left, top;

					var ndo = $("<div>").attr({
						from: from.attr("id"),
						to: to.attr("id")
					});

					var currentX = rectFrom.left + rectFrom.width;
					var currentY = rectFrom.height / 2 + rectFrom.top;

					var useThreeLine = (currentX + 2 * peduncolusSize) < rectTo.left;

					if (!useThreeLine) {
						// L1
						if (peduncolusSize > 0) {
							var l1 = new HLine(peduncolusSize, currentY, currentX, line);
							currentX = currentX + peduncolusSize;
							ndo.append(l1);
						}

						// L2
						var l2_4size = ((rectTo.top + rectTo.height / 2) - (rectFrom.top + rectFrom.height / 2)) / 2;
						var l2;
						if (l2_4size < 0) {
							l2 = new VLine(-l2_4size, currentY + l2_4size, currentX, line);
						} else {
							l2 = new VLine(l2_4size, currentY, currentX, line);
						}
						currentY = currentY + l2_4size;
						ndo.append(l2);

						// L3
						var l3size = rectFrom.left + rectFrom.width + peduncolusSize - (rectTo.left - peduncolusSize);
						currentX = currentX - l3size;
						var l3 = new HLine(l3size, currentY, currentX, line);
						ndo.append(l3);

						// L4
						var l4;
						if (l2_4size < 0) {
							l4 = new VLine(-l2_4size, currentY + l2_4size, currentX, line);
						} else {
							l4 = new VLine(l2_4size, currentY, currentX, line);
						}
						ndo.append(l4);

						currentY = currentY + l2_4size;

						// L5
						if (peduncolusSize > 0) {
							var l5 = new HLine(peduncolusSize, currentY, currentX, line, line);
							currentX = currentX + peduncolusSize;
							ndo.append(l5);
						}
					} else {
						//L1
						var l1_3Size = (rectTo.left - currentX) / 2;
						var l1 = new HLine(l1_3Size, currentY, currentX, line);
						currentX = currentX + l1_3Size;
						ndo.append(l1);

						//L2
						var l2Size = ((rectTo.top + rectTo.height / 2) - (rectFrom.top + rectFrom.height / 2));
						var l2;
						if (l2Size < 0) {
							l2 = new VLine(-l2Size, currentY + l2Size, currentX, line);
						} else {
							l2 = new VLine(l2Size, currentY, currentX, line);
						}
						ndo.append(l2);
						currentY = currentY + l2Size;

						//L3
						var l3 = new HLine(l1_3Size, currentY, currentX, line);
						currentX = currentX + l1_3Size;
						ndo.append(l3);
					}

					//arrow
					var arr = $("<div>").addClass("myGantt-link-lines-arrow").css({
						position: 'absolute',
						top: rectTo.top + rectTo.height / 2 - 5,
						left: rectTo.left - 5,
						width:"5px",
						height:"10px"
					});

					ndo.append(arr);

					return ndo;
				}

				/**
				* A rendering method which paints a start to start dependency.
				*
				* @see buildRect
				*/
				function drawStartToStart(rectFrom, rectTo, peduncolusSize, line) {
					var left, top;

					var ndo = $("<div>").attr({
						from: from.id,
						to: to.id
					});

					var currentX = rectFrom.left;
					var currentY = rectFrom.height / 2 + rectFrom.top;

					var useThreeLine = (currentX + 2 * peduncolusSize) < rectTo.left;

					if (!useThreeLine) {
						// L1
						if (peduncolusSize > 0) {
							var l1 = new HLine(peduncolusSize, currentY, currentX - peduncolusSize, line);
							currentX = currentX - peduncolusSize;
							ndo.append(l1);
						}

						// L2
						var l2_4size = ((rectTo.top + rectTo.height / 2) - (rectFrom.top + rectFrom.height / 2)) / 2;
						var l2;
						if (l2_4size < 0) {
							l2 = new VLine(-l2_4size, currentY + l2_4size, currentX, line);
						} else {
							l2 = new VLine(l2_4size, currentY, currentX, line);
						}
						currentY = currentY + l2_4size;

						ndo.append(l2);

						// L3
						var l3size = (rectFrom.left - peduncolusSize) - (rectTo.left - peduncolusSize);
						currentX = currentX - l3size;
						var l3 = new HLine(l3size, currentY, currentX, line);
						ndo.append(l3);

						// L4
						var l4;
						if (l2_4size < 0) {
							l4 = new VLine(-l2_4size, currentY + l2_4size, currentX, line);
						} else {
							l4 = new VLine(l2_4size, currentY, currentX, line);
						}
						ndo.append(l4);

						currentY = currentY + l2_4size;

						// L5
						if (peduncolusSize > 0) {
							var l5 = new HLine(peduncolusSize, currentY, currentX, line);
							currentX = currentX + peduncolusSize;
							ndo.append(l5);
						}
					} else {
						//L1

						var l1 = new HLine(peduncolusSize, currentY, currentX - peduncolusSize, line);
						currentX = currentX - peduncolusSize;
						ndo.append(l1);

						//L2
						var l2Size = ((rectTo.top + rectTo.height / 2) - (rectFrom.top + rectFrom.height / 2));
						var l2;
						if (l2Size < 0) {
							l2 = new VLine(-l2Size, currentY + l2Size, currentX, line);
						} else {
							l2 = new VLine(l2Size, currentY, currentX, line);
						}
						ndo.append(l2);

						currentY = currentY + l2Size;

						//L3

						var l3 = new HLine(peduncolusSize + (rectTo.left - rectFrom.left), currentY, currentX, line);
						currentX = currentX + peduncolusSize + (rectTo.left - rectFrom.left);
						ndo.append(l3);
					}

					//arrow
					var arr = $("<div>").addClass("myGantt-link-lines-arrow").css({
						position: 'absolute',
						top: rectTo.top + rectTo.height / 2 - 5,
						left: rectTo.left - 5,
						width:"5px",
						height:"10px"
					});

					ndo.append(arr);

					return ndo;
				}

				var rectFrom = buildRect(from);
				var rectTo = buildRect(to);

				// Dispatch to the correct renderer
				if (type == 'start-to-start') {
					myGantt.find(".myGantt-Links").append(
						drawStartToStart(rectFrom, rectTo, peduncolusSize, line)
					);
				} else {
					myGantt.find(".myGantt-Links").append(
						drawStartToEnd(rectFrom, rectTo, peduncolusSize, line)
					);
				}
			} // END drawLink
		}

		
		var helpers = {
			getRect: function (element) {				
				element.myGantt.position = element.position();
				element.myGantt.width = element.width();
				element.myGantt.height = element.height();
			},

			getNodesPosition: function(element){
				$.each(element.myGantt.data, function(index, value) {
					var title = element.find("#myGanttName-"+value.id);
					element.myGantt.data[index].position = title.position();
				});
			},

			getDaySize: function(element){
				var testDayDiv = $("<div>").addClass("myGant-row day").css({visible:"none"});
				element.append(testDayDiv);
				element.myGantt.daySettings = {};
				element.myGantt.daySettings.height = testDayDiv.height();
				element.myGantt.daySettings.width = testDayDiv.width();
				testDayDiv.remove();
				element.myGantt.barHeight = element.myGantt.daySettings.height / 6 * 3; 
			}, 

			getDatesRange: function(element){
				element.myGantt.minDate = new Date();
				element.myGantt.maxDate = element.myGantt.minDate;
				$.each(element.myGantt.data, function(index, value) {
					element.myGantt.data[index].start = helpers.parseDate(value.start);
					element.myGantt.data[index].end = helpers.parseDate(value.end);
					if(element.myGantt.data[index].end  > element.myGantt.maxDate) element.myGantt.maxDate = element.myGantt.data[index].end;
					if(element.myGantt.data[index].start  < element.myGantt.minDate) element.myGantt.minDate = element.myGantt.data[index].start;
				});	
			}, 

			parseDate: function(date){
				var parts = date.split('-');
				// new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
				return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
			}, 

			diffDates: function(firstDate, secondDate){
				var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
				return Math.ceil(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
			}, 

			oddClass: function(data){
				return (((data%2 == 0)) ? " " : " odd");
			},

			DateRange: function (from, to) {
				var current = new Date(from.getTime());
				var end = new Date(to.getTime()); // <- never used?
				var ret = [];
				var i = 0;
				do {
					ret[i++] = new Date(current.getTime());
					current.setDate(current.getDate() + 1);
				} while (current.getTime() <= to.getTime());
				return ret;
            }
		}

		this.each(function () {
			var $this = $(this);
			$this.myGantt = {};
			$this.myGantt.data = null;
			core.create($this);
		});

		
	};
})(jQuery);