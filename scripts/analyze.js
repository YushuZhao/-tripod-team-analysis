const fs = require("fs");
const { showCompletionScript } = require("yargs");

const args = require("yargs/helpers").hideBin(process.argv);
const path = require("minimist")(args).path;

function readFileList(path, fileList) {
  const files = fs.readdirSync(path);
  files.forEach((item) => {
    const subPath = path + "/" + item;
    const stat = fs.statSync(subPath);
    if (stat.isDirectory()) {
      readFileList(subPath, fileList);
    } else {
      let content = fs.readFileSync(subPath);
      const lines = content.toString().split("\n").length - 1;

      let obj = {};
      obj.path = path;
      obj.filename = item;
      obj.lines = lines;
      obj.size = stat.size;
      fileList.push(obj);
    }
  });
}

let fileList = [];
readFileList(path, fileList);

fs.access("./result", fs.constants.F_OK, (err) => {
  if (err) {
    fs.mkdirSync("./result");
  }
  fs.writeFileSync("./result/analysis.json", JSON.stringify(fileList, null, 2));
});
