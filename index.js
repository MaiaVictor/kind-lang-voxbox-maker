#!/usr/bin/env -S node

const fs = require("fs");
const lib = require("./lib.js");

if (!process.argv[2]) {
  console.log("Usage: klvm My.Name.Space [z_index] [z_scale]");
  console.log("Will convert all .png images to .kind terms.");
  console.log("Check https://github.com/maiavictor/kind-lang-voxbox-maker for more info.");
}

(async () => {
  var files = fs.readdirSync(".").filter(x => x.slice(-4) === ".png");
  var namespace = process.argv[2] || "VoxBox.Assets";
  var z_index = Number(process.argv[3] || "1");
  var z_scale = process.argv[4] === "scale";

  for (var file of files) {
    var nam = file.slice(0,-4).replace(/\-/,"_");
    var img = await lib.read_image("./" + file);
    var hex = lib.image_to_hex(img, z_index, z_scale);
    var txt = "";
    txt += namespace + "." + nam + ": VoxBox\n";
    txt += "  VoxBox.parse(\"" + hex + "\")\n";
    fs.writeFileSync(nam+".kind", txt);
  }
})();
