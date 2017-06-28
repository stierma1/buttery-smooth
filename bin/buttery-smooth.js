#!/usr/bin/env node

var program = require("commander");
var ButterLoader = require("../lib/butter-loader");
var ButterUploader = require("../lib/butter-uploader");

function list(val) {
  return val.split(',');
}

program
  .version(require("../package.json").version)
  .option("-c, --connectionString [connString]", "ConnectionString that will be used to connect to couchdb")
  .option('-a, --action [action]', 'download or upload', "download")
  .option('-i, --id [id]', 'Id for downloading or uploading')
  .option('-r, --dataRoute [dRoute]', 'Data Route to be uploading')
  .option('-o, --dataObjectPath [dOPath]', 'Path to data object that will be uploaded')
  .option('-s, --dataServicePath [dSPath]', 'Path to Data Service that will be uploaded')
  .option('-d, --dependencies <deps>', 'list of dependencies (comma seperated)', list)
  .parse(process.argv);

if(program.action !== "download" && program.action !== "upload"){
  throw new Error("Action must be either download or upload");
}
if(program.id === "" || !program.id){
  throw new Error("Id must not be empty");
}
if(program.connectionString === "" || !program.connectionString){
  throw new Error("ConnectionString must not be empty")
}
if(program.action === "download"){
  var bl = new ButterLoader({connectionString:program.connectionString, id:program.id});
  bl.loadDocument();
} else {
  var bu = new ButterUploader({connectionString:program.connectionString,
    id:program.id,
    dataRoute:program.dataRoute,
    pathToDataObject:program.dataObjectPath,
    pathToDataService:program.dataServicePath,
    dependencies:program.dependencies
  });
  bu.upload();
}
