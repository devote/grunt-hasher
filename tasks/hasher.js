/*!
 * hasher plugin for Grunt - v0.1.0
 *
 * Copyright 2011-2014, Dmitrii Pakhtinov ( spb.piksel@gmail.com )
 *
 * http://spb-piksel.ru/
 *
 * MIT licenses: http://www.opensource.org/licenses/mit-license.php
 *
 * Update: 2014-04-12 22:03
 */
module.exports = function(grunt) {
  "use strict";

  var fs = require("fs");
  var path = require("path");
  var crypto = require("crypto");

  function applyFormat(text, hash, src, basename, ext) {
    return text.replace(/\{HASH\}/ig, hash).replace(/\{SRC\}/ig, src).replace(/\{BASENAME\}/ig, basename).replace(/\{EXT\}/ig, ext);
  };

  function unixify(path) {
    return path.split("\\").join("/");
  };

  function writeFile(dest, content, options, src) {
    grunt.file.write(dest, content, {encoding: options.encoding});
    if ((src && options.mode === true) || (options.mode !== true && options.mode !== false)) {
      fs.chmodSync(dest, (options.mode === true) ? fs.lstatSync(src).mode : options.mode);
    }
  };

  grunt.registerMultiTask("hasher", "Create hashes for files", function() {
    var options = this.options({
        mode: false,
        algorithm: "md5",
        outputMode: "text",
        outputDigest: "hex",
        outputTextFormat: "{HASH} *{SRC}",
        outputFilenameFormat: "{BASENAME}.{HASH}{EXT}",
        encoding: grunt.file.defaultEncoding,
        hashLength: null,
        hashFunction: function(source, algorithm, outputDigest, encoding) {
          var hash = crypto.createHash(algorithm);
          hash.update(source, encoding);
          return outputDigest && outputDigest !== 'none' ? hash.digest(outputDigest) : hash;
        }
    });

    var maps = {};
    var isOutJson = options.outputMode.toLowerCase() === 'json';

    this.files.forEach(function(file) {

      var dest = unixify(file.dest);
      var isDestDir = dest.substr(dest.length - 1, 1) === "/" || grunt.file.isDir(dest);
      var isDestFile = !isDestDir && grunt.file.isFile(dest);
      var destExt = isDestDir ? "" : path.extname(dest);
      var destBasename = isDestDir ? "" : path.basename(dest, destExt);
      var newFile = destBasename + destExt;

      dest = path.dirname(file.dest);

      file.src.forEach(function(src) {
        var src = unixify(src);
        var source = grunt.file.read(src, {encoding: options.encoding});
        var hash = options.hashFunction(source, options.algorithm, options.outputDigest, options.encoding);
        var ext = path.extname(src);
        var basename = path.basename(src, ext);

        dest = unixify(dest && dest !== "." ? dest : path.dirname(src));

        if (options.hashLength) {
          hash = hash.substr(0, options.hashLength);
        }

        if (isDestDir) {
          writeFile(path.join(dest, applyFormat(options.outputFilenameFormat, hash, src, basename, ext)), source, options, src);
        } else if (destBasename === "*") {
          file = unixify(path.join(dest, basename + destExt));
          writeFile(file, applyFormat(options.outputTextFormat, hash, src, basename, ext), options, src);
        } else {
          file = unixify(path.join(dest, destBasename + destExt));
          if (typeof maps[file] === "undefined") {
            maps[file] = grunt.file.exists(file) ? (isOutJson ? grunt.file.readJSON(file) : "") : (isOutJson ? {} : "");
          }
          if (isOutJson) {
            maps[file][unixify(path.join(path.dirname(src), basename + ext))] = hash;
          } else {
            maps[file] += applyFormat(options.outputTextFormat, hash, src, basename, ext) + "\n";
          }
        }
      });
    });

    for(var key in maps) {
      if (maps.hasOwnProperty(key)) {
        writeFile(key, isOutJson ? JSON.stringify(maps[key], null, "  ") : maps[key], options);
      }
    }
  });
};
