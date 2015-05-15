var express = require("express"),
	bodyParser = require("body-parser"),
	fs = require('fs'),
	app = express();

console.log(app);


var store = {
	home: {
		title: "Home page title",
		content: "Welcome to my new Express APPlication"
	},
	about: {
		title: "About Me",
		content: "My name is..."
	},
	contacts: {
		title: "Contact Me",
		content: "You can find me home"
	},
	todos: {
		title: "TODOs",
		content: "JustDoIt!"
	},
	weather: {
		title: "Weather",
		content: '\
				<div id="meteoprog_informer_standart" data-params="boy:Uman:500x100:white:48x50" ><a href="http://www.meteoprog.ua/en/">weather</a><br /><a href="http://www.meteoprog.ua/en/weather/Uman/">Weather in  Uman </a><br /></div><script src="http://www.meteoprog.ua/en/weather/informer/standart.js"></script>\
				<hr>\
				<div id="SinoptikInformer" style="width:350px;" class="SinoptikInformer type5"><div class="siHeader"><div class="siLh"><div class="siMh"><a onmousedown="siClickCount();" href="https://ua.sinoptik.ua/" target="_blank">Погода</a><a onmousedown="siClickCount();" class="siLogo" href="https://ua.sinoptik.ua/" target="_blank"> </a> <span id="siHeader"></span></div></div></div><div class="siBody"><table><tbody><tr><td class="siCityV" style="width:100%;"><div class="siCityName"><a onmousedown="siClickCount();" href="https://ua.sinoptik.ua/погода-умань" target="_blank">Погода в <span>Умані</span></a></div></tr><tr><td style="width:100%;"><div class="siCityV2"><div id="siCont0" class="siBodyContent"><div class="siLeft"><div class="siTerm"></div><div class="siT" id="siT0"></div><div id="weatherIco0"></div></div><div class="siInf"><p>вологість: <span id="vl0"></span></p><p>тиск: <span id="dav0"></span></p><p>вітер: <span id="wind0"></span></p></div></div></div></td></tr></tbody></table><div class="siLinks"><span><a onmousedown="siClickCount();" href="https://ua.sinoptik.ua/погода-кременчук" target="_blank">Погода у Кременчуці</a>&nbsp;</span><span><a onmousedown="siClickCount();" href="https://ua.sinoptik.ua/погода-мелітополь" target="_blank">Погода у Мелітополі</a>&nbsp;</span></div></div><div class="siFooter"><div class="siLf"><div class="siMf"></div></div></div></div><script type="text/javascript" charset="UTF-8" src="//sinoptik.ua/informers_js.php?title=4&amp;wind=2&amp;cities=303027480&amp;lang=ua"></script>\
			'
	},
	newtodo: {
		title: 'Add new TODO',
		content: 'enter information'
	}
},
todosFile = 'todos.txt',
keysStore = Object.keys(store),
todos = new Array();

fs.readFile(todosFile, function (err, data) {
  if (err) throw err;
  if(data.toString() != '') {
	  todos = JSON.parse(data);
  }
});

app.use(function(req, res, next) {
	console.log('%s %s', req.method, req.url);
	next()
});

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));


app.get('/todos', function(req, res) {
		data = store.todos;
		data.links = keysStore;
		data.current = 'todos';
		data.todos = todos;
		res.render('todos', data);
	});

app.route('/newtodo')
	.get(function(req, res) {
		data = store.newtodo;
		data.links = keysStore;
		data.current = 'newtodo';
		res.render('new', data);
	})
	.post(function(req, res) {
		data = req.body;
		if( data.title ) {
			todos.push(data.title);
		}
		fs.writeFile(todosFile, JSON.stringify(todos), function (err) {
		  if (err) throw err;
		  console.log('It\'s saved!');
		});
		res.redirect('/todos');
	});

app.route('/remove/:remove')
	.get(function(req, res) {
		var remove = req.params.remove;
		var index = todos.indexOf(remove);
		if (index > -1) {
		    todos.splice(index, 1);
		}
		fs.writeFile(todosFile, JSON.stringify(todos), function (err) {
		  if (err) throw err;
		  console.log('It\'s saved!');
		});
		data = store.newtodo;
		data.links = keysStore;
		data.current = 'newtodo';
		res.redirect('/todos');
	});

app.get('/:page?', function(req, res) {
	var page = req.params.page;
	if(!page) page = 'home';
	data = store[page];
	if(!data) {
		res.redirect('/');
	}
	data.links = keysStore;
	data.current = page;
	res.render('main', data);
});


var server = app.listen(2500, function(){
	console.log('listening on 2500');
})