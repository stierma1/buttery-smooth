var PouchDb = require("pouchdb");
var fs = require("fs");
var mkdirp = require("mkdirp");
var path = require("path");
var spawn = require("child_process").spawnSync;

class ButterUploader{
  constructor({connectionString, id, pathToDataService, dataRoute, pathToDataObject, dependencies}){
    this.db = new PouchDb(connectionString);
    this.id = id;
    this.pathToDataService = pathToDataService;
    this.dataRoute = dataRoute;
    this.pathToDataObject = pathToDataObject;
    this.dependencies = dependencies;
  }

  async upload(){
    var doc = await (this.db.get(this.id).catch((err) => {}));
    var rev = doc && doc._rev;
    var dataConfigObject = {
      dataRoute:this.dataRoute,
      dataObject: JSON.parse(fs.readFileSync(path.join(process.cwd(), this.pathToDataObject), "utf8"))
    }

    var dataService = fs.readFileSync(path.join(process.cwd(), this.pathToDataService), "utf8");

    var doc = {_id:this.id, _rev:rev, dependencies:this.dependencies, dataConfigObject, dataService};

    await this.db.put(doc)

    console.log("Upload completed");
  }
}

module.exports = ButterUploader;
