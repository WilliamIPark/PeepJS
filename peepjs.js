// Create Screenshots and Thumbnails from URLS.
// Useful for preview shots.
// Sets an object with the location of the screenshot files @ this.screenshot

var Nightmare = require('nightmare');
var sharp = require('sharp');

module.exports = class {
  //Constructor Method
  constructor() {
    console.log('[PEEPJS] STARTED');
    this.nightmare = Nightmare({
      show: false
    });

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

      let output = `${directory}full_${this.fname}${type}`;
      console.log(`[PEEPJS] TRYING: ${output}`);

      //Use nightmare instance to attempt screenshot on url.
      this.nightmare
        .goto(url)
        .evaluate(() => {
          //Hides scrollbars, and scrolls to horizontal center of the page.
          document.documentElement.style.overflow = 'hidden';
          document.body.scroll = "no";
          //document.body.scrollLeft = (document.body.scrollWidth - document.body.clientWidth) / 2
        })
        .screenshot(output)
        .end()
        .then(() => {
          console.log(`[PEEPJS] SUCCESS: ${output}`);
          this.screenshot.fullsize = output;
          this.createThumbnail().then(() => {
            resolve(this.screenshot);
          })
          .catch((err) => {
            console.error(err);
          });
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
      let input = `${this.directory}full_${this.fname}${this.ftype}`;
      let output = `${this.directory}thumb_${this.fname}${this.ftype}`;
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
      });
    });
  }

}
