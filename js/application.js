$(function() {
	prettyPrint();

	var data = {
		source:[
			{id:1, name:"tarea 1", children:[{id:2, line:{lcolor:"green", lstyle:"dashed"}}, {id:5, line:{lcolor:"red", lstyle:"dotted"}}]},
			{id:2, name:"tarea 2", children:[{id:4}]},
			{id:3, name:"tarea 3"},
			{id:4, name:"tarea 4", children:[{id:5, line:{lcolor:"gray", lstyle:"dotted"}}]},
			{id:5, name:"tarea 5"}
		]
	}

	$("#myGantt").myGantt(data);
});