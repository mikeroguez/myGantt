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
				// request depending on 'settings.source'
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
				this.render(element);
			},

			render: function(element){
				var myData = element.data;
				element = $(element);

				var links = $("<div>");
				links.addClass("myGantt-Links").css({position:"relative",top:0,width:"100%",height:"100%"});
				element.append(links);

				$.each(myData, function(index, value) {
					var node = $("<div>");
					node.attr( "id", "myGanttNode-"+value.id).addClass("myGantt-node").css({position:"absolute",top:(1 + Math.floor(Math.random() * 400))+"px", left:(1 + Math.floor(Math.random() * 400))+"px",width:"10px",height:"10px", border:"1px solid red"});
					links.append(node);
				});

				$.each(myData, function(index, value) {
					if( typeof value.children != "undefined"){
						$.each(value.children, function(idx, nodeId){
							core.drawLink($("#myGanttNode-"+value.id), $("#myGanttNode-"+nodeId), null, element);
						});
					};
				});				
			},

			/**************************************
			+ DRAW LINKS
			***************************************/
			drawLink: function (from, to, type, myGantt) {
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
					ADAPTED BY MikeRoguez
				*/
				var peduncolusSize = 10;
				var lineSize = 1;

				/**
				* A representation of a Horizontal line
				*/
				function HLine(width, top, left) {
					var hl = $("<div>").addClass("myGantt-link-lines");
					hl.css({
						"border-width": lineSize+"px 0px 0px",
						left: left,
						width: width,
						top: top - lineSize / 2,
						position: "absolute"
					});
					return hl;
				};


				/**
				* A representation of a Vertical line
				*/
				function VLine(height, top, left) {
					var vl = $("<div>").addClass("myGantt-link-lines");
					vl.css({
						height: height,
						left:left - lineSize / 2,
						"border-width": "0px 0px 0px "+lineSize+"px",
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
				function drawStartToEnd(rectFrom, rectTo, peduncolusSize) {
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
							var l1 = new HLine(peduncolusSize, currentY, currentX);
							currentX = currentX + peduncolusSize;
							ndo.append(l1);
						}

						// L2
						var l2_4size = ((rectTo.top + rectTo.height / 2) - (rectFrom.top + rectFrom.height / 2)) / 2;
						var l2;
						if (l2_4size < 0) {
							l2 = new VLine(-l2_4size, currentY + l2_4size, currentX);
						} else {
							l2 = new VLine(l2_4size, currentY, currentX);
						}
						currentY = currentY + l2_4size;
						ndo.append(l2);

						// L3
						var l3size = rectFrom.left + rectFrom.width + peduncolusSize - (rectTo.left - peduncolusSize);
						currentX = currentX - l3size;
						var l3 = new HLine(l3size, currentY, currentX);
						ndo.append(l3);

						// L4
						var l4;
						if (l2_4size < 0) {
							l4 = new VLine(-l2_4size, currentY + l2_4size, currentX);
						} else {
							l4 = new VLine(l2_4size, currentY, currentX);
						}
						ndo.append(l4);

						currentY = currentY + l2_4size;

						// L5
						if (peduncolusSize > 0) {
							var l5 = new HLine(peduncolusSize, currentY, currentX);
							currentX = currentX + peduncolusSize;
							ndo.append(l5);
						}
					} else {
						//L1
						var l1_3Size = (rectTo.left - currentX) / 2;
						var l1 = new HLine(l1_3Size, currentY, currentX);
						currentX = currentX + l1_3Size;
						ndo.append(l1);

						//L2
						var l2Size = ((rectTo.top + rectTo.height / 2) - (rectFrom.top + rectFrom.height / 2));
						var l2;
						if (l2Size < 0) {
							l2 = new VLine(-l2Size, currentY + l2Size, currentX);
						} else {
							l2 = new VLine(l2Size, currentY, currentX);
						}
						ndo.append(l2);
						currentY = currentY + l2Size;

						//L3
						var l3 = new HLine(l1_3Size, currentY, currentX);
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
				function drawStartToStart(rectFrom, rectTo, peduncolusSize) {
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
							var l1 = new HLine(peduncolusSize, currentY, currentX - peduncolusSize);
							currentX = currentX - peduncolusSize;
							ndo.append(l1);
						}

						// L2
						var l2_4size = ((rectTo.top + rectTo.height / 2) - (rectFrom.top + rectFrom.height / 2)) / 2;
						var l2;
						if (l2_4size < 0) {
							l2 = new VLine(-l2_4size, currentY + l2_4size, currentX);
						} else {
							l2 = new VLine(l2_4size, currentY, currentX);
						}
						currentY = currentY + l2_4size;

						ndo.append(l2);

						// L3
						var l3size = (rectFrom.left - peduncolusSize) - (rectTo.left - peduncolusSize);
						currentX = currentX - l3size;
						var l3 = new HLine(l3size, currentY, currentX);
						ndo.append(l3);

						// L4
						var l4;
						if (l2_4size < 0) {
							l4 = new VLine(-l2_4size, currentY + l2_4size, currentX);
						} else {
							l4 = new VLine(l2_4size, currentY, currentX);
						}
						ndo.append(l4);

						currentY = currentY + l2_4size;

						// L5
						if (peduncolusSize > 0) {
							var l5 = new HLine(peduncolusSize, currentY, currentX);
							currentX = currentX + peduncolusSize;
							ndo.append(l5);
						}
					} else {
						//L1

						var l1 = new HLine(peduncolusSize, currentY, currentX - peduncolusSize);
						currentX = currentX - peduncolusSize;
						ndo.append(l1);

						//L2
						var l2Size = ((rectTo.top + rectTo.height / 2) - (rectFrom.top + rectFrom.height / 2));
						var l2;
						if (l2Size < 0) {
							l2 = new VLine(-l2Size, currentY + l2Size, currentX);
						} else {
							l2 = new VLine(l2Size, currentY, currentX);
						}
						ndo.append(l2);

						currentY = currentY + l2Size;

						//L3

						var l3 = new HLine(peduncolusSize + (rectTo.left - rectFrom.left), currentY, currentX);
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
						drawStartToStart(rectFrom, rectTo, peduncolusSize)
					);
				} else {
					myGantt.find(".myGantt-Links").append(
						drawStartToEnd(rectFrom, rectTo, peduncolusSize)
					);
				}
			} // END drawLink
		}

		this.each(function () {
			this.data = null;
			core.create(this);
		});		
	};
})(jQuery);