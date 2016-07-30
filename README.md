![alt tag](https://raw.githubusercontent.com/williamipark/PeepJS/master/images/peepjs.png)
-----------------
PeepJS is a simple node module to turn a URL into a screenshot, and allows the generation of thumbnails. It is currently an early version but it does work - more flexibility will come. It uses ES6 Promises to create an asynchronous request.

I created this as I required this functionality in another project, and I thought it would be a good learning opportunity to create the functionality myself to get a feel for how modules are made. It also beats paying monthly for an API to do the work! 

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
### `new Peep({options})`
Creates a new Peep instance. *All options are currently optional.*

`show` Boolean - Whether or not the electron window used to take the screenshot appears visually. Default is `false`.

`loud` Boolean - Debug/Dev option. Enables console logging for Peep. Defaults to `false` for no logging.

`width` Integer - Full screenshot's width in pixels. Default is `800`.

`height` Integer - Full screenshot's height in pixels. Default is `600`.

`useContentSize` Boolean - Boolean - The width and height would be used as web page's size, which means the actual window's size will include window frame's size and be slightly larger. Default is `false`.

`enableLargerThanScreen` Boolean - Enable the window to be resized larger than screen. Default is `false`.

`zoomFactor` Number - The default zoom factor of the page, 2.0 is `200%`. Default is `0.75` Worth adjusting if can't fit content in screenshot.

`showImages` Boolean - Whether images should show in the screenshots. Default is `true`.

`showScrollbars` Boolean - Whether there should be scrollbars in the screenshot. Default is `false`.

`centered` Boolean - Horizontally center the screenshot if the page does not fit. Default is `false`.

`fullsizeOnly` Boolean - Only output a fullsize image. Default is `false`. **Do not use with `thumbnailOnly`**.

`thumbnailOnly` Boolean - Only output a thumbnail image. Default is `false`. Still temporarily creates a fullsize image, but will be removed.

`fullsizePrefix` String - Change the prefix at the start of the output filename. Example: `newprefix_google.com.png`. Default is `full_`. Can be used to put output in a further subdirectory. Example: `fullsize/full_`. **Recommended:** Check notes section below.

`thumbnailPrefix` String - Change the prefix at the start of the output filename. Example: `newprefix_google.com.png`. Default is `thumb_`. Can be used to put output in a further subdirectory. Example: `thumbnails/thumb_`. **Recommended:** Check notes section below.

`thumbSize` Number - The factor at which your thumbnail will be scaled down to, `0.25` is `25%`. Default is `0.25`. 

`thumbWidth` Integer - Exact width of thumbnail output in pixels. Overwrites `thumbSize` when considering width. Falls back to `thumbSize`.

`thumbHeight` Integer - Exact height of thumbnail output in pixels. Overwrites `thumbSize` when considering height. Falls back to `thumbSize`. 

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

**- Make sure your output directory already exists! This is important! Same goes for if you use `fullsizePrefix` or `thumbnailPrefix` to make usage of subdirectories - the subdirectories must already exist!**
- Screenshots are saved using the url as part of the filename, prefixed with either `full_` or `thumb_`.
- Screenshots from the same domain will currently overwrite. This means `full_google.com.png` would get overwrote by a  `http://google.com/images` screenshot request.


