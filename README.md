myGantt
=======

Create dynamic Gantt graph

![Sample myGantt](https://raw.github.com/mikeroguez/myGantt/master/css/imgs/gantt.png)

Dependencies
------------
The plugin depends on the following libraries:

- jQuery 1.4 or higher

Documentation
-------------
```
$(function() {

	var data = {
		source:[
			{id:1, name:"tarea 1", start:"2013-08-1", end:"2013-08-2",  children:[{id:2, line:{lcolor:"green", lstyle:"dashed"}}, {id:5, line:{lcolor:"red", lstyle:"dotted"}}]},
			{id:2, name:"tarea 2", start:"2013-08-3", end:"2013-08-6", children:[{id:4}]},
			{id:3, name:"tarea 3", start:"2013-08-5", end:"2013-08-9", children:[{id:6}]},
			{id:4, name:"tarea 4", start:"2013-08-8", end:"2013-08-8", children:[{id:5, line:{lcolor:"gray", lstyle:"dotted"}}]},
			{id:5, name:"tarea 5", start:"2013-08-10", end:"2013-08-13"},
			{id:6, name:"tarea 6 de Mike", start:"2013-08-12", end:"2013-8-20"}
		]
	}

	$("#myGantt").myGantt(data);
});
```

Licence
-------

[MIT License!](https://raw.github.com/mikeroguez/myGantt/master/LICENSE)
