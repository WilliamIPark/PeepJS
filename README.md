![alt tag](https://raw.githubusercontent.com/williamipark/PeepJS/master/images/peepjs.png)
-----------------
PeepJS is a simple node module to turn a URL into a screenshot, and allows the generation of thumbnails. It is currently an early version but it does work - more flexibility will come. It uses ES6 Promises to create an asynchronous request.

I created this as I required this functionality in another project, and had planned to use an API at first. However, I decided to create this myself to avoid paying a monthly API fee. It was also good practice in uncharted areas of javascript for me.

## Prerequisites
C++11 compatible compiler such as gcc 4.8+, clang 3.0+ or MSVC 2013+

[node-gyp](https://github.com/nodejs/node-gyp#installation)

[PhantomJS](http://phantomjs.org/)

# Installation

Install via npm.
```
$ npm install PeepJS
```

# Usage / Example
```javascript
//Require the module and create an instance of the Peep class.
var Peep = require('PeepJS');
var peeper = new Peep();

//Use the takeScreenshot method to grab a screenshot.
peeper.takeScreenshot("http://google.com", "./output/", ".gif")
  .then(screenshot => {
    //Screenshot is an object with path to screenshot and thumbnail
    console.log(screenshot);
  });
```

## Class: Peep
### `new Peep()`
Creates a new Peep instance.

### `Peep.takeScreenshot(url, output_dir, filetype)`

`url` String - Make sure to include the `http://` For example: `http://google.com`.

`output_dir` String - Make sure to include a `/` after the directory name. For example: `./output/` 

`filetype` String - Use one of: `.png` `.jpg` `.gif`

Returns a promise with error handling at `.catch()` and when successful an object containing paths to the screenshot and thumbnail at `.then()`. For example:

```
{
    fullsize: './output/full_google.com.png',
    thumb: './output/thumb_google.com.png'
}
```

### Notes (Important!)

- This is an early version, and therefore not the most flexible, however, it is very easy to jump into `peepjs.js` to edit.
- Screenshots are saved using the url as part of the filename, prefixed with either `fullsize_` or `thumb_`.
- Screenshots from the same domain will currently overwrite. This means `fullsize_google.com.png` would get overwrote by a  `http://google.com/images` screenshot request.


