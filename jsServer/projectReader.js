module.exports = {
	readProjectInfo : function(path){
		const fs = require('fs');

		var cont = JSON.parse(fs.readFileSync(path+"project.config.json"));
		return cont;
	}
}