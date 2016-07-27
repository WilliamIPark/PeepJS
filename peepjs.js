// Create Screenshots and Thumbnails from URLS.
// Useful for preview shots.
// Sets an object with the location of the screenshot files @ this.screenshot

var Nightmare = require('nightmare');
var sharp = require('sharp');
var fs = require('fs');

module.exports = class {
  //Constructor Method
  constructor(options) {
    console.log('[PEEPJS] STARTED');

    this.nightmare = Nightmare({
      show: options.show || false,
      width: options.width || 800,
      height: options.height || 600,
      useContentSize: options.useContentSize || false,
      enableLargerThanScreen: options.enableLargerThanScreen || false,
      webPreferences: {
        zoomFactor: options.zoomFactor || 0.75,
        images: options.showImages === false ? false : true
      }
    });

    this.showScrollbars = options.showScrollbars || false;
    this.centered = options.centered || false;
    this.thumbnailOnly = options.thumbnailOnly || false;
    this.fullsizeOnly = options.fullsizeOnly || false;

    this.fullsizePrefix = options.fullsizePrefix || "full_";
    this.thumbnailPrefix = options.thumbnailPrefix || "thumb_";

    this.url = null;
    this.directory = null;
    this.ftype = null;

    this.screenshot = {fullsize: null, thumb: null};
  }

  takeScreenshot(url, directory, type) {

    return new Promise((resolve, reject) => {
      //Small method that splits up the URL to make it usable in a file name.
      let splitUrl = function(){
        let httpRemoved = url.split("//");
        let slashRemoved = httpRemoved[1].split("/");
        return slashRemoved[0];
      }
      //Set up variables.
      this.url = url;
      this.directory = directory;
      this.ftype = type;
      this.fname = splitUrl();

      let output = `${this.directory}${this.fullsizePrefix}${this.fname}${this.ftype}`;
      console.log(`[PEEPJS] TRYING: ${output}`);

      //Use nightmare instance to attempt screenshot on url.
      this.nightmare
        .goto(url)
        .evaluate((clientOptions) => {
          //Hides scrollbars
          if(!clientOptions.showScrollbars) {
            document.documentElement.style.overflow = 'hidden';
            document.body.scroll = "no";
          }
          //Hides scrolls to horizontal center of the page.
          if(clientOptions.centered) {
            document.body.scrollLeft = (document.body.scrollWidth - document.body.clientWidth) / 2
          }
        }, {
          //Pass these varaibles into the evaluate client
          showScrollbars: this.showScrollbars,
          centered: this.centered
        })
        .screenshot(output)
        .end()
        .then(() => {
          console.log(`[PEEPJS] SUCCESS: ${output}`);
          this.screenshot.fullsize = output;

          //Create the thumbnail
          if(!this.fullsizeOnly) {
            this.createThumbnail().then(() => {
              resolve(this.screenshot);
            })
            .catch((err) => {
              console.error(err);
            });
          } else {
            resolve(this.screenshot);
          }

        })
        .catch(function(err) {
          console.error(err);
          reject(err);
        });

    });
  }

  createThumbnail() {
    return new Promise((resolve, reject) => {
      //Set Up
      let input = `${this.directory}${this.fullsizePrefix}${this.fname}${this.ftype}`;
      let output = `${this.directory}${this.thumbnailPrefix}${this.fname}${this.ftype}`;
      console.log(`[PEEPJS] TRYING: ${output}`);

      //Use sharp to resize file.
      sharp(input)
      .resize(200, 150)
      .toFile(output, (err) => {
        if(err){
          console.log(err);
          reject(err);
        }
        console.log(`[PEEPJS] SUCCESS: ${output}`);
        this.screenshot.thumb = output;
        resolve();

        //If only the thumbnail is wanted, delete the fullsize.
        if(this.thumbnailOnly) {
          fs.unlink(input);
          this.screenshot.fullsize = null;
        }
      });
    });
  }

}
