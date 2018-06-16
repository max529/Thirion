const fs = require('fs');

module.exports = {
    getAPI: function (path) {
        var pathConfig = path + "project.config.json";
        var config = JSON.parse(fs.readFileSync(pathConfig, 'utf8'));
        if (config["apiSettings"]) {
            return config.apiSettings;
        } else {
            return {};
        }
    },
    saveAPI: function (data, path) {
        var pathConfig = path + "project.config.json";

        var config = JSON.parse(fs.readFileSync(pathConfig, 'utf8'));
        config["apiSettings"] = data;
        fs.writeFileSync(pathConfig, JSON.stringify(config));
    }
}