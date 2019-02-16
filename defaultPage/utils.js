var self = module.exports = {
    format: function (mainClass, data) {
        var res = { main: {} };
        for (var label in data) {
            var className = label.split("_")[0];
            var labelData = label.substring(label.indexOf('_') + 1);
            if (className == mainClass) {
                res.main[labelData] = data[label];
            } else {
                if (!res.hasOwnProperty(className)) {
                    res[className] = {};
                }
                res[className][labelData] = data[label];
            }
        }
        return res;
    }
}