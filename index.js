const express = require('express')
const bodyParser = require('body-parser');

module.exports = class {
	
	constructor() {
		
		this.services = {};
		
		this.controllers = {};
		
		this.app = express();
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: true }));

	}
	
	expose(name, reference) {
		this.services[name] = reference;
	}
	
	module(module) {
		let args = module.toString()
			.replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg,'')
			.match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1]
			.split(/,/)
			.filter((v,k) => k > 0)
			.map((arg) => { 
				let serviceName = arg.replace(/^\$/, "");
				return (serviceName in this.services) ? this.services[serviceName] : null;
			});
			
		args.unshift(this);
		
		module.apply(null, args);
	}
	
	get(route, callback) {
		this.app.get(route, callback);
	}
	
	post(route, callback) {
		this.app.post(route, callback);
	}

	put(route, callback) {
		this.app.put(route, callback);
	}

	delete(route, callback) {
		this.app.delete(route, callback);
	}	
	
	listen(port, callback) {
		this.app.listen(port, callback);
	}
}