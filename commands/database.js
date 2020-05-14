const database = require("../database.json");
const mysql = require("mysql");

module.exports.run = async (bot, message, args) => {
    //Make it so the bot doesnt crash if it has no connection
    try{
        var con = mysql.createConnection({
            host: database.host,
            user: database.user,
            password: database.password,
            database: database.database
        });
    
        con.connect(err => {
            if (err) throw err;
        });
    
        var user = message.guild.member(message.mentions.users.first());
        var nickname = args.join(' ').slice(22).trim();
    
        if (user && !nickname) {
            con.query(`SELECT nickname FROM data WHERE idUser = '${user.id}'`, (err, rows) => {
                if (err) throw err;
                if(rows[0] === undefined){
                    message.channel.send("No data has been found for this user!");
                } else {
                    message.channel.send(rows[0].nickname);
                }
            });
    
        } else if (user && nickname == "remove") {
    
            con.query(`DELETE FROM data WHERE idUser = '${user.id}'`, (err, rows) => {
                if (err) throw err;
            });
            message.channel.send("Deleted from database!");
    
        } else if (user && nickname) {
            con.query(`SELECT * FROM data WHERE idUser = '${user.id}'`, (err, rows) => {
                if (err) throw err;
    
                if (rows.length < 1) {
    
                    con.query(`INSERT INTO data (idUser,nickname) VALUES ("${user.id}", "${nickname}")`);
    
                } else {
    
                    con.query(`UPDATE data SET nickname = '${nickname}' WHERE idUser = '${user.id}'`);
    
                }
            });
        } else {
            con.query(`SELECT * FROM data`, (err, rows) => {
                if (err) throw err;
    
                if (rows.length > 0) {
                    for (var i = 0; i < rows.length; i++) {
                        var id = rows[i].idUser;
                        message.channel.send(message.guild.members.cache.get(id).user.username + " -> " + rows[i].nickname);
                    }
                }
            });
        }
    
    } catch(error){
        console.log(error);
    }
}

module.exports.help = {
    name: "database"
}