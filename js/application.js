$(function() {
	prettyPrint();

	var data = {
		source:[
			{id:1, name:"tarea 1", start:"2013-08-10",  children:[{id:2, line:{lcolor:"green", lstyle:"dashed"}}, {id:5, line:{lcolor:"red", lstyle:"dotted"}}]},
			{id:2, name:"tarea 2", start:"2013-08-12", children:[{id:4}]},
			{id:3, name:"tarea 3", start:"2013-08-20", children:[{id:6}]},
			{id:4, name:"tarea 4", start:"2013-08-25", children:[{id:5, line:{lcolor:"gray", lstyle:"dotted"}}]},
			{id:5, name:"tarea 5", start:"2013-08-26"},
			{id:6, name:"tarea 6 de Mike", start:"2013-09-30"}
		]
	}

	$("#myGantt").myGantt(data);
});