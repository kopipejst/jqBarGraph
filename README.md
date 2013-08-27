jqBarGraph
==========

jqBarGraph is easy-to-use jQuery plugin for displaying your data as bar graphs.

There is two type of data array for jqBarGraph. First is for simple bar graph type, and second is for multi and stacked bar type.

For simple bar graph type data for one bar should look like this: [value, label, color]. Label and color are optional. This is example for simple bar graph type:

	arrayOfData = new Array(
    	[10.3,'Jan','#f3f3f3'],
    	[15.2,'Feb','#f4f4f4'],
    	[13.1,'Mar','#cccccc'],
    	[16.3,'Apr','#333333'],
    	[14.5,'May','#666666']
	);

For multi and stacked type of graph you should send data in next format: [[value1, value2, value3, ..., valueN], label]. It should look similar to this:

	arrayOfData = new Array(
	    [[14,54,26],'2007'],
	    [[8,48,38],'2008'],
	    [[4,36,57],'2009']
	);

After you set your data array you just need to say in which div you want graph to be created. All you have to do is:

	$('#divForGraph').jqBarGraph({ data: arrayOfData });

The code above is enough to display your data as bar graph. But if you want to made your graph prettier you can achieve that with next set of parameters:

	data: arrayOfData, // array of data for your graph
	title: false, // title of your graph, accept HTML
	barSpace: 10, // this is default space between bars in pixels
	width: 400, // default width of your graph
	height: 200, //default height of your graph
	color: '#000000', // if you don't send colors for your data this will be default bars color
	colors: false, // array of colors that will be used for your bars and legends
	lbl: '', // if there is no label in your array
	sort: false, // sort your data before displaying graph, you can sort as 'asc' or 'desc'
	position: 'bottom', // position of your bars, can be 'bottom' or 'top'. 'top' doesn't work for multi type
	prefix: '', // text that will be shown before every label
	postfix: '', // text that will be shown after every label
	animate: true, // if you don't need animated appearance change to false
	speed: 2, // speed of animation in seconds
	legendWidth: 100, // width of your legend box
	legend: false, // if you want legend change to true
	legends: false, // array for legend. for simple graph type legend will be extracted from labels if you don't set this
	type: false, // for multi array data default graph type is stacked, you can change to 'multi' for multi bar type
	showValues: true, // you can use this for multi and stacked type and it will show values of every bar part
	showValuesColor: '#fff' // color of font for values
	valueStyle: null // a function which receives the value and returns whatever string it wants e.g. 1000 -> 1,000

More info at: <a href="http://www.workshop.rs/jqbargraph/">WORKSHOP</a>