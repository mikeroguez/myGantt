$(function() {
	prettyPrint();

	var data = {
		source:[
			{id:1, name:"tarea 1", children:[2,5]},
			{id:2, name:"tarea 2", children:[4]},
			{id:3, name:"tarea 3"},
			{id:4, name:"tarea 4", children:[5]},
			{id:5, name:"tarea 5"}
		]
	}

	$("#myGantt").myGantt(data);
});