const Peep = require('./peepjs');

const ss = new Peep({
  //zoomFactor: 0.75,
  //showScrollbars: true,
  //fullsizeOnly: true,
  //thumbnailOnly: true,
  //fullsizePrefix: "full-",
  //thumbnailPrefix: "thumb-",
  //useContentSize: true,
  //width: 1000,
  //height: 500,
  //thumbWidth: 800,
  //thumbSize: 0.25,
  //showImages: false
  loud: true
});

ss.takeScreenshot("http://google.com", "./test/", ".png")
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
