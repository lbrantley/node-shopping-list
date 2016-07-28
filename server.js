var express = require('express');
var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.delete = function(id) {
	
	var item;

	for (i = 0; i < this.items.length; i++ ){
		if (this.items[i].id == id) {
			item = this.items[i];
			this.items.splice(i, 1);
			break;	
		}
	}

	return item;
};

Storage.prototype.edit = function(id, name) {
    
    var item;

    for (i = 0; i < this.items.length; i++) {        
        if (this.items[i].id == id) {
        	this.items[i].name = name;
            item = this.items[i];
            break;
        }
    }

    if (!item){
    	item = {name: name, id: id};
    	this.items.push(item);
    }

    return item;
};

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

//Routes
app.get('/items', function(req, res) {
    res.json(storage.items);
});

app.post('/items', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    var item = storage.add(req.body.name);
    res.status(201).json(item);
});

app.delete('/items/:id', function(req, res) {
	var item = storage.delete(req.params.id);
    if (!item) {
        return res.sendStatus(404);
    }
    res.status(200).json(item);
});

app.put('/items/:id', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    var item = storage.edit(req.params.id, req.body.name);
    if (!item) {
        return res.sendStatus(404);
    }
    res.status(200).json(item);
});

app.listen(process.env.PORT || 8080);