let fs = require('fs');

exports.writeToJsonDb = function(fileName, obj) {
    
    // write data to the json file
    fs.writeFileSync(`./jsonDb/${fileName}.json`, JSON.stringify(obj, null, 4), err => {
        if (err) throw err;
        console.log("Succesfully saved to [" + nameTrackerJson + "]!")
    });
}



