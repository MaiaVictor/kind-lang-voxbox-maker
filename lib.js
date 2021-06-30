const fs = require('fs');
const path = require("path");
const jimp = require('jimp');

// Return the formated pixel for the image
// - image: a path to a image
// - return: a format like 
//   {
//     pixels: [{index: 1, x: 1, y: 1, color: { r: 255, g: 255, b: 255, a: 255}}, ...]
//     width: 16, 
//     height: 16
//   }
// read_image: (path: String) -> IO<Image>
async function read_image(image_path){
  function read_pixel(jimp_image, x, y){
      var pixel_color = jimp.intToRGBA(jimp_image.getPixelColour(x, y));
      var pixel_idx   = jimp_image.getPixelIndex(x, y)/4;
      var pixel = {"index": pixel_idx, "x": x, "y": y, color: pixel_color};
      return pixel;
  }
  return await jimp.read(image_path)
    .then(image => {
      var height = image.getHeight();
      var width  = image.getWidth();
      var pixels = [];
      for(y = 0; y < height; y++){
        for(x = 0; x < width; x++){
          var pixel_info = read_pixel(image, x, y);
          pixels.push(pixel_info);
        }
      }
      return {pixels, width, height};
    })
    .catch(err => {
      throw err;
    });
}


// image_to_hex: String -> Image -> VoxboxHexString
function image_to_hex(image_info, z_index = 0, z_scale = false) {
  var pixels = image_info.pixels;
  var width  = image_info.width;
  var height = image_info.height;
  // For each pixel, use 6 bytes to write the info
  var b = new Buffer.alloc(pixels.length * 6);
  var c = 0;
  for(var i = 0; i < pixels.length; i++){
    var pixel = pixels[i];
    if (pixel.color.a !== 0) { // not transparent
      b[c*6]   = pixel.x + (128 - (width / 2));
      b[c*6+1] = pixel.y + (128 - (height / 2));
      b[c*6+2] = z_index + (z_scale ? (height - pixel.y - 1) : 0); // z
      b[c*6+3] = pixel.color.r;
      b[c*6+4] = pixel.color.g;
      b[c*6+5] = pixel.color.b;
      c++;
    }
  }
  return b.slice(0, c * 6).toString("hex");
}

module.exports = {read_image, image_to_hex};
