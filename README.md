# grunt-hasher - Plugin for Grunt

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-hasher
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-hasher');
```


## The "hasher" task

### Overview
In your project's Gruntfile, add a section named `hasher` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
	hasher: {
		options: {
			// Task-specific options go here.
		},
		your_target: {
			// Target-specific file lists and/or options go here.
		}
	}
});
```

### Options

#### algorithm
Type: `String`
Default value: `"md5"`

A string value that is the type of hashing algorithm to use. Must be either "sha1" or "md5".

#### outputMode
Type: `String`
Default value: `"text"`

A string value that is the type of output data. Must be either "text" or "json".

#### outputDigest
Type: `String`
Default value: `"hex"`

A string value that is the type of output hash digits. Must be either "none" or "hex".

#### encoding
Type: `String`
Default value: `grunt.file.defaultEncoding`

The file encoding to read files with.

#### mode
Type: `Boolean` or `Number`
Default: `false`

Whether to copy or set the existing file permissions. Set to `true` to copy the existing file permissions. Or set to the mode, i.e.: `0644`, that copied files will be set to.

#### outputTextFormat
Type: `String`
Default value: `"{HASH} *{SRC}"`

...

#### outputFilenameFormat
Type: `String`
Default value: `"{BASENAME}.{HASH}{EXT}"`

...

#### hashLength
Type: `Number`
Default value: `null`

The number of characters from the beginning of the hash value to use. When set to undefined or null, all characters are used.

#### hashFunction
Type: `Function`
Default value: `internal function`

...

