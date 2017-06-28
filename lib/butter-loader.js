
var PouchDb = require("pouchdb");
var fs = require("fs");
var mkdirp = require("mkdirp");
var path = require("path");
var spawn = require("child_process").spawnSync;

class ButterLoader{
  constructor({connectionString, id}){
    this.db = new PouchDb(connectionString);
    this.id = id;
  }

  async loadDocument(){
    var doc = await this.db.get(this.id);
    var {dependencies, dataConfigObject, dataService} = doc;
    await new Promise((res, rej) => {
      mkdirp(path.join(process.cwd(), "butter_modules", this.id), function(err){
        if(err){
          return rej(err);
        }
        res();
      })
    });

    for(var i in dependencies){
      spawn("npm", ["install", "--save", dependencies[i]]);
    }

    fs.writeFileSync(path.join(process.cwd(), "butter_modules", this.id, "data-config.json"), JSON.stringify(dataConfigObject, null, 2));
    fs.writeFileSync(path.join(process.cwd(),  "butter_modules", this.id, "data-service.js"), dataService);

    console.log("Load completed");
  }
}

module.exports = ButterLoader;
