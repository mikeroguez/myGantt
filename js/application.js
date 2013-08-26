$(function() {
	prettyPrint();

	var data = {
		source:[
			{id:1, name:"tarea 1", start:"2013-08-10", end:"2013-08-13",  children:[{id:2, line:{lcolor:"green", lstyle:"dashed"}}, {id:5, line:{lcolor:"red", lstyle:"dotted"}}]},
			{id:2, name:"tarea 2", start:"2013-08-12", end:"2013-08-15", children:[{id:4}]},
			{id:3, name:"tarea 3", start:"2013-08-20", end:"2013-08-28", children:[{id:6}]},
			{id:4, name:"tarea 4", start:"2013-08-25", end:"2013-08-31", children:[{id:5, line:{lcolor:"gray", lstyle:"dotted"}}]},
			{id:5, name:"tarea 5", start:"2013-08-26", end:"2013-08-30"},
			{id:6, name:"tarea 6 de Mike", start:"2013-09-30", end:"2013-10-10"}
		]
	}

	$("#myGantt").myGantt(data);
});