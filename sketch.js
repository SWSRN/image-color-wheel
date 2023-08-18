// folder p5js_color_wheel_clean_2023-06-23
// index.html
// sketch.js
//
// Tanya Riseman 2023
//
// RBG color wheel analysis inspired by
// https://fstoppers.com/education/art-and-science-photography-color-theory-411739
// https://fstoppers.com/profile/192990/articles Brent Daniel
//
// Zone analysis inspired by Ansel Adams
//
// More references in code


const ProgramDescription = 'Color Wheel analysis and Zone analysis of image files';

//let isMobile = true;  // we decided to the same canvas for all devices

let originalimg;
let img;
let clippedimg;
haveCopiedOriginalImg = false;  // only do once.

let file_name = '';

let hueHistogram;
let hueHistogramRYB;
let maxHueBin = 24;
let hueBinSize = 15; 

let sumHueBins = 0;
let whiteBins = 0;
let grayBins = 0;
let blackBins = 0;
let hueBins = 0;

let sumHueBinsRYB = 0;
let whiteBinsRYB = 0;
let grayBinsRYB = 0;
let blackBinRYBs = 0;
let hueBinsRYB = 0;

let hue2RYB;
let num2RYB;
let numhRYB;
let hueHisto2RYB;

let hueRYBtable;
let hueRGBtable;  
let normWeight;
let weightRYBtable;


//let debugThis = false;
//let debugxycanvas = false;

var canvasWidth 
var canvasHeight

var xmargin 
var ymargin 


var xoffset_refresh
var xoffset_zoneCheck 
var xoffset_browse 
var xoffset_textbox 
var xoffset_button 
var xoffset_slider 
var yheight_inputs  //  different for desktop and mobile
var yloc_buttons  
var yloc_savebutton 
var xloc_savebutton 
var yloc_endHTML
var xoffset_radio;
let woffset_radio;

var yheight_image 
var yheight_hueHisto 
var xwidth_hueHisto
var yheight_wheel 
var yheight_wheel_scheme
var xwidth_zone 
var yheight_zone 
var ystart_image 

//gray scale (Zone system) look up table stuff:
let ZoneLookUpTable;
let midRangeLookUpTable;
let numZone; //numZone[ZoneLookUpTable[lRGB]]]++;
let numZoneRYB; //numZone[ZoneLookUpTable[lRYB]]]++;
let rangeBottom;
let rangeMid;
let rangeTop;


let radioZones;

// state variables that we are going to use to see 
// if need to update imaages on canvas. 
// and histograms and color wheels on canvas.
let previouscheckboxColorClips = 'false';

let previousblacktextBox = '0';  // the text boxes get updated with the slider position, so only need one
let previouswhitetextBox = '100';
let previousgraytextBox = '0';
let previousRadioZoneValue = 'Original';
let previousInputFileName = '';

 

function initSpacingLocations(){

// Cool way to determine if using mobile or desktop/laptop/tablet
// But decided to use the same canvas for both. 
 // if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i)) {
 // //  isMobile = true;
 // } else {
 // //  isMobile = false;
 // } 
 
  canvasWidth = 600;
  canvasHeight = 900;

  xmargin = 20;
  ymargin = 12;

  xoffset_zoneCheck = xmargin;
  xoffset_browse = xmargin + 60; 
  xoffset_radio = xmargin;
  woffset_radio = xmargin + 60; 
  xoffset_textbox = xmargin;
  xoffset_button = xmargin + 50;
  xoffset_slider = xmargin + 175; 
  
  yheight_inputs = 30;  // different for desktop and mobile
  yloc_buttons  = ymargin + 1*yheight_inputs;
  yloc_savebutton  = yloc_buttons;
  xloc_savebutton = xmargin; 
  yloc_endHTML = ymargin + 6.5*yheight_inputs

  yheight_image = 325;
  yheight_hueHisto = 120; 
 
  xwidth_hueHisto = 300;
  yheight_wheel = 150;
  yheight_wheel_scheme = 32; 
  xwidth_zone = 250;
  yheight_zone = yheight_hueHisto;
  ystart_image = yloc_endHTML + 1.0 * yheight_inputs;

} // ============== initSpacingLocations ==============


//// from https://openprocessing.org/sketch/790331/  does not work
//function createMetaTag() {
//	let meta = createElement('meta');
//	meta.attribute('name', 'viewport');
//	meta.attribute('content', 'user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1,width=device-width,height=device-height');
//
//	let head = select('head');
//	meta.parent(head);
//}  //======= createMetaTag ========/




function printHelp() {
// text placement is in absolute coordinates. Only appears when the URL is first opened.
  fill('black');  // black
  strokeWeight(0);
  textSize(18);
  textAlign(LEFT, BOTTOM)
  text(ProgramDescription, (xmargin), (0.5*ymargin + 0.5*yheight_inputs));
  fill('black');  // black
  textSize(12);
  textAlign(CENTER)
  text('Copyright 2023 Tanya Riseman', canvasWidth/2, (canvasHeight) );
  textAlign(LEFT, BOTTOM)
   
  fill('black');  // black
  textSize(18);
  text('Which image file types are supported depends on your browser/device.' , 
    (xmargin), (ymargin +round(7.8*yheight_inputs )) );  
  text('JPG and PNG are generally supported. In some cases, HEIC and WEBP.' , 
    (xmargin), (ymargin +round(8.8*yheight_inputs )) );  
  text(' ', (xmargin), (ymargin +round(9.8*yheight_inputs )));
  text('To get started with Color Wheel Analysis, feel free not to use the sliders.', 
    (xmargin), (ymargin +round(10.8*yheight_inputs )));
  
  text('Click on "Gray Zones" to get Ansel Adams Zone results.',  
      (xmargin), (ymargin +round(12.8*yheight_inputs )));
  text('Note: B&W is not perceptually corrected so yellows will seem dark.',  
      (xmargin), (ymargin +round(13.8*yheight_inputs )));
     
  text('Click on "RGB Zones" to see which areas correspond in RGB wheel.',  
      (xmargin), (ymargin +round(15.8*yheight_inputs )));
  text('Click on "RYG Zones" to see which areas correspond in RYB wheel.',  
      (xmargin), (ymargin +round(16.8*yheight_inputs )));

  text('"Ignored Blacks" shown in black or blue depending on "Color Clips". ', 
      (xmargin), (ymargin +round(18.8*yheight_inputs )));
  text('"Ignored Whites" shown in white or red.', 
      (xmargin), (ymargin +round(19.8*yheight_inputs )));
  text('Ignored low saturation pixels (grays) shown in gray or green.', 
     (xmargin), (ymargin +round(20.8*yheight_inputs )));
     
  text('Does the RGB or RYB color wheel follow a scheme on the right?',  
     (xmargin), (ymargin +round(22.8*yheight_inputs )));
  text('Note: Mixing complementary colors should produce a pure gray.',  
     (xmargin), (ymargin +round(23.8*yheight_inputs )));
  text('Works in RGB. Not quite in RYB.',  
     (xmargin), (ymargin +round(24.8*yheight_inputs )));
  text('Note: Placing saturated complementary colors next to each other',  
     (xmargin), (ymargin +round(25.8*yheight_inputs )));
  text('will visually pop and vibrate. More so with RGB than RYB.',  
     (xmargin), (ymargin +round(26.8*yheight_inputs )));
  text('On touch screens, tap instead of drag sliders to avoid scrolling.',  
     (xmargin), (ymargin +round(27.8*yheight_inputs )));
  textSize(14);
  text('www.ssccphotography.org\/explore-the-color-wheel-and-color-harmony-of-your-image\/',(xmargin), 
      (ymargin +round(28.8*yheight_inputs )));
  textSize(18);
 
 

} //========== printHelp ===========


function setup() {
  //debugThis = 1;

   // doesn't work in browser or mobile.
  // createMetaTag();
  // createCanvas(window.innerWidth, window.innerHeight);

  //fs = fullscreen(); // see if this helps mobile case.
  //console.log(' fullscreen = ', fs);
  //if ( !fs) fullscreen( !fs);
  //console.log(' fullscreen = ', fs);
  
  hueHistogram = new Array(maxHueBin);
  hueHistogramRYB = new Array(maxHueBin);
  for (i = 0; i < maxHueBin; i++) {
    hueHistogram[i] = 0;
    hueHistogramRYB[i] = 0;
  }

  
  makeLookUpTableHuergb2ryb();
  
  initSpacingLocations();

  // This is supposed to keep mobile screen from moving around when 
  // dragging the sliders. But doesn't compile.
  // https://kirkdev.blogspot.com/2020/10/prevent-browser-scrolling-while-drawing.html  doesn't work
  //createCanvas(canvasWidth, canvasHeight).parent("canvasParent").id("drawingCanvas");
  //stopTouchScrolling(document.getElementById('drawingCanvas'));

  createCanvas(canvasWidth, canvasHeight);
 
  background('white'); // white. If not set, it will default to alpha transparency.

  printHelp();
  
  fill(0, 0, 100);  // black
 
  savebutton = createButton('Save');
  savebutton.position(xloc_savebutton, yloc_savebutton);
  savebutton.mousePressed(savebutton_pressed);

  radioZones = createRadio();
  radioZones.option('Original');
  radioZones.option('Gray Zones');
  radioZones.option('RGB Zones');
  radioZones.option('RYB Zones');
  radioZones.selected('Original');
  radioZones.style('width', woffset_radio);
  radioZones.position(xoffset_radio, ymargin + 2.0*yheight_inputs)

  checkboxColorClips = createCheckbox('Color Clips', false);
  checkboxColorClips.changed(checkColorClipsAnalysis);
  checkboxColorClips.position(xoffset_radio + 375,  ymargin + 2.0*yheight_inputs)

  selectFileButton = createFileInput(handleFile);
  selectFileButton.position(xoffset_browse, yloc_buttons); // load file button location
  selectFileButton.mousePressed(draw);
 

  // buttons, textbox and sliders copied from https://editor.p5js.org/jhedberg/sketches/rk8ydh6s7
  blacktextBox = createInput('');
  blacktextBox.position(xoffset_textbox, ymargin + 3*yheight_inputs)
  //blacktextBox.position(xoffset_textbox, ymargin + 2.5*yheight_inputs)
  blacktextBox.size(50)

  whitetextBox = createInput('');
  whitetextBox.position(xoffset_textbox, 2*ymargin + 4*yheight_inputs)
  //whitetextBox.position(xoffset_textbox, 2*ymargin + 3.5*yheight_inputs)
  whitetextBox.size(50)

  graytextBox = createInput('');
  graytextBox.position(xoffset_textbox, 3*ymargin + 5*yheight_inputs)
  //graytextBox.position(xoffset_textbox, 3*ymargin + 4.5*yheight_inputs)
  graytextBox.size(50)

  blackslider = createSlider(0, 49, 0, 1);
  blackslider.position(xoffset_slider, ymargin + 3*yheight_inputs);
  //blackslider.position(xoffset_slider, ymargin + 2.5*yheight_inputs);
  blackslider.style('width', '300px');
                
  whiteslider = createSlider(50, 100, 100, 1);
  whiteslider.position(xoffset_slider, 2*ymargin + 4*yheight_inputs);
  //whiteslider.position(xoffset_slider, 2*ymargin + 3.5*yheight_inputs);
  whiteslider.style('width', '300px');
 
  grayslider = createSlider(0, 100, 0, 1);  // 0 none, 100 whole image converted to gray scale
  grayslider.position(xoffset_slider, 3*ymargin + 5*yheight_inputs);
 // grayslider.position(xoffset_slider, 3*ymargin + 4.5*yheight_inputs);
  grayslider.style('width', '300px');

  blackbutton = createButton('Ignore blacks');
  blackbutton.position(blacktextBox.x + blacktextBox.width+xmargin, blacktextBox.y);
  blackbutton.mousePressed(blackupdateValue);
  blackbutton.style('background-color', 'lightskyblue');  // blue
  blackbutton.style('color', 'black');  // text
  //the textbox starts with the slider value

  blacktextBox.value(str(blackslider.value()));  // adding str() didn't make any difference
  blackslider.input(blacksliderChange); // update the text box
  
  
  whitebutton = createButton('Ignore whites');
  whitebutton.position(whitetextBox.x + whitetextBox.width+xmargin, whitetextBox.y);
  whitebutton.mousePressed(whiteupdateValue);
  whitebutton.style('background-color', 'pink');  // red
  whitebutton.style('color', 'black');  // text
 
  whitetextBox.value(str(whiteslider.value()));
  whiteslider.input(whitesliderChange); // update the text box
 
  graybutton = createButton('Desaturation');
  graybutton.position(graytextBox.x + graytextBox.width+xmargin, graytextBox.y);
  graybutton.mousePressed(grayupdateValue);
  graybutton.style('background-color', 'lightGreen');  
  //blackbutton.style('background-color', 'lightGray');  
  graybutton.style('color', 'black');  // text
 
  //the textbox starts with the slider value
  graytextBox.value(str(grayslider.value()));
  grayslider.input(graysliderChange); // update the text box
 
  colorMode(HSL);  //  colorMode(HSB, 360.0, 100.0, 100.0); 

  ZoneLookUpTable = new Array(101);
  midRangeLookUpTable = new Array(101);

  numZone = new Array(5);  
  numZoneRYB = new Array(5);  
  rangeBottom = new Array(5);
  rangeMid= new Array(5);
  rangeTop = new Array(5);

  initZoneLookUpTable_linear();
   
  frameRate(5);   // Want 5-10. default is 60 frames per second seems faster than needed.

}  //=============== setup ========================


function stateNeedsUpdating() {

  stateNeedsUpdatingSliders = ( previousblacktextBox != blacktextBox.value() ||
    previouswhitetextBox != whitetextBox.value() || 
    previousgraytextBox != graytextBox.value()  || (previousInputFileName != file_name) ||
    previousRadioZoneValue != radioZones.value() ||
    previouscheckboxColorClips!= checkboxColorClips.value() );

  previousRadioZoneValue = radioZones.value(); 


  if ( stateNeedsUpdatingSliders && ! (radioZones.value() == 'Gray Zones')) {
    graybutton.style('background-color', 'lightGreen'); 
    graybutton.html('Desaturated');
  } else {
    graybutton.style('background-color', 'white');  
    graybutton.html('Not Used');
  }

  return stateNeedsUpdatingSliders;
} // ============= stateChange ==============


function savebutton_pressed() {
  
  push();
        
  strarray = [radioZones.value(),  str(file_name)];
  newname = join(strarray, '_');
  
  fill('black');  // black
  textSize(18);

  text(newname, (xmargin), (ymargin +round(1.8*yheight_inputs )));  
  
  strarray = ['Selected image type = ', radioZones.value()];
  GUIinfo = join(strarray, '');
  text(GUIinfo, (xmargin), (ymargin +round(2.8*yheight_inputs ))); 

  strarray = ['"Ignore Blacks" value (0-49) ', str(blackslider.value())];
  GUIinfo = join(strarray, '');
  text(GUIinfo, (xmargin), (ymargin +round(3.8*yheight_inputs ))); 
 
  strarray = ['"Ignore whites" value (50-100) ', str(whiteslider.value())];
  //strarray = ['White point value (50-100) ', str(whiteslider.value())];
  GUIinfo = join(strarray, '');
  text(GUIinfo, (xmargin), (ymargin +round(4.8*yheight_inputs ))); 
 
  strarray = ['Gray desaturation value (0-100) ', str(grayslider.value())];
  GUIinfo = join(strarray, '');
  text(GUIinfo, (xmargin), (ymargin +round(5.8*yheight_inputs ))); 
  
  saveCanvas( newname);
  //console.log('savebutton_pressed after saveCanvas');

  fill('white'); // Hack to clear text after file saved, Clear didn't work.

  text(newname, (xmargin), (ymargin +round(1.8*yheight_inputs )));  

  strarray = ['Selected image type = ', radioZones.value()];
  GUIinfo = join(strarray, '');
  text(GUIinfo, (xmargin), (ymargin +round(2.8*yheight_inputs ))); 

  strarray = ['"Ignore Blacks" value (0-49) ', str(blackslider.value())];
  GUIinfo = join(strarray, '');
  text(GUIinfo, (xmargin), (ymargin +round(238*yheight_inputs ))); 
  
  strarray = ['"Ignore whites" value (50-100) ', str(whiteslider.value())];
  GUIinfo = join(strarray, '');
  text(GUIinfo, (xmargin), (ymargin +round(4.8*yheight_inputs ))); 
  
  strarray = ['Gray desaturation value (0-100) ', str(grayslider.value())];
  GUIinfo = join(strarray, '');
  text(GUIinfo, (xmargin), (ymargin +round(5.8*yheight_inputs ))); 
   
 pop();
 
} // ============ savebutton_pressed ================

function blacksliderChange(){ // adding str() didn't make any difference
  //if the slider is changed, update the textbox
  blacktextBox.value(str(blackslider.value()));
} // =========== blacksliderChange ==============

function whitesliderChange(){
  //if the slider is changed, update the textbox
  whitetextBox.value(str(whiteslider.value()));
} // =========== whitesliderChange =============

function graysliderChange(){
  //if the slider is changed, update the textbox
  graytextBox.value(str(grayslider.value()));
} //============ graysliderChange =============

function blackupdateValue(){
  if (blacktextBox.value() < 0) blacktextBox.value(0);
  if (blacktextBox.value() > 49) blacktextBox.value(49);
  //if the textbox is updated, update the slider
  blackslider.value(blacktextBox.value())
} //============ blackupdateValue =============

function whiteupdateValue(){
  if (whitetextBox.value() < 50) whitetextBox.value(50);
  if (whitetextBox.value() > 100) whitetextBox.value(100);
 //if the textbox is updated, update the slider
  whiteslider.value(whitetextBox.value())
} //============= whiteupdateValue( ==============

function grayupdateValue(){
  if (graytextBox.value() < 0) graytextBox.value(0);
  if (graytextBox.value() > 100) graytextBox.value(100);
   //if the textbox is updated, update the slider
  grayslider.value(graytextBox.value())
}

function checkColorClipsAnalysis() {
} 

// Looks promising but doesn't work. DON'T DELETE
//function stopTouchScrolling(mycanvas){
//  // https://kirkdev.blogspot.com/2020/10/prevent-browser-scrolling-while-drawing.html
//  // Prevent scrolling when touching the canvas (for mobile). Does not seem to work.
//  document.body.addEventListener("touchstart", function (e) {
//      if (e.target == mycanvas) {
//          e.preventDefault();
//      }
//  }, { passive: false });
//  document.body.addEventListener("touchend", function (e) {
//      if (e.target == mycanvas) {
//          e.preventDefault();
//      }
//  }, { passive: false });
//  document.body.addEventListener("touchmove", function (e) {
//      if (e.target == mycanvas) {
//          e.preventDefault();
//      }
//  }, { passive: false });
//
//}// ============= stopTouchScrolling =================
  

function draw()  {  //================================
 
  repeatNumber = 1; 
  repeatN = repeatNumber

  //haveCopiedOriginalImg 
  while ((repeatN >= 1) ) {

    // do two loops becase the handlefile() is a bit asynchronous and image might not be loaded yes.
    repeatN = repeatN -1;  
          
    if (originalimg && ((originalimg.width > 1) && (originalimg.height > 1) && stateNeedsUpdating())) {
    
      clear(); // remove previous image and canvas contents
      push();  // save the state
      push();  // save the state yes twice
  
      background('white'); 

      fill('Black'); 
      textSize(18);
      textAlign(LEFT, BOTTOM)
      text(ProgramDescription, (xmargin), (0.5*ymargin + 0.5*yheight_inputs));
  
      fill('black'); 
      textSize(12);
      textAlign(CENTER)
      text('Copyright 2023 Tanya Riseman', canvasWidth/2, (canvasHeight) );
      textAlign(LEFT, BOTTOM);
      
      fill('black'); 

      translate(xmargin, ystart_image); 
    
      // orignalimg is full sized and is copy into img each call to draw()  when stateNeedsUpdating()
      //  Only need when file_name changes.
      // img is small and is used to copy into clippedimg each call to draw() when stateNeedsUpdating()
      if ( ! haveCopiedOriginalImg  || ( previousInputFileName != file_name)) {
        ytarget = yheight_image;
        xtarget = round(float(originalimg.width * ytarget)/float(originalimg.height));
        img = createImage(xtarget, ytarget);
      
        img.copy(originalimg, 0, 0, originalimg.width, originalimg.height, 0,0, img.width, img.height);
        img.loadPixels();
        haveCopiedOriginalImg = true;
      }
  
      // this is our modifed small copy, each time refreshed.
      clippedimg = createImage(xtarget, ytarget);
      clippedimg.copy(img, 0, 0, img.width, img.height, 0,0, clippedimg.width, clippedimg.height);
      
      createHueHistogram(xwidth_hueHisto, yheight_hueHisto);

      translate(-xmargin, 0);  // have image start on left edge.
      if ((max(hueHistogram) == 0) && (radioZones.value() != 'Gray Zones')) { 
        // Image is in B&W, so show original.
        image(img, 0, 0, width, yheight_image, 0,0, clippedimg.width, clippedimg.height, CONTAIN, LEFT);
      } else {
        image(clippedimg, 0, 0, width, yheight_image, 0,0, clippedimg.width, clippedimg.height, CONTAIN, LEFT);
      }
      translate(xmargin, 0);
    
      
      translate(0, yheight_image + yheight_hueHisto + ymargin); 
     
      if ( (radioZones.value() == 'Gray Zones')) {
        drawZones( xwidth_zone, yheight_zone );
      }

      if (radioZones.value() == 'Gray Zones') {  
        fill('black'); 
        strokeWeight(0);
        textSize(18);
        text('Ansel Adams zone system', 0, + 1.5*yheight_inputs);
        text('Showing only 5 zones due to limitations of JPG and PNG 8-bit storage.', 0, + 3.0*yheight_inputs);
        text('The histogram has a spacing of one stop.', 0, + 4.0*yheight_inputs);
        text('For best results, set "Ignore Blacks" to 0 and "Ignore Whites" to 100.', 0, + 5.0*yheight_inputs);
        text('Note: B&W is not perceptually corrected so yellows will seem dark.',  0, + 6.0*yheight_inputs);

      } else {
        fill('black');  
        strokeWeight(0);
       
        fill(0, 100, 0);  //black
        strokeWeight(0);
        textSize(16);
        text('Modern Red Green Blue light', 0,  -0.5 * yheight_wheel - 0.5*ymargin);
       
        translate(width*0.25 -0.5*xmargin, 0.5 * yheight_wheel - ymargin);  // hack
        drawColorWheel(1.8*yheight_wheel );  

        fill(0, 100, 0);  //black
        strokeWeight(0);
        textSize(16);
        text('Traditional Red Yellow Blue Black paint', -xmargin + width/2,  -1.0 * yheight_wheel - 0.5*ymargin);
          
        translate(width*0.5, 0);
        drawColorWheelRYB(1.8*yheight_wheel );  // place holder until make drawRYBcolorWheel() 
        translate(-width*0.5, 0.0);  
       
      } // if (checkboxZone.checked() ) 
      
      
      pop();  // restore the state. Now at (0,0) top of the canvas
      
      if ( ! (radioZones.value() == 'Gray Zones') ) {  
      //if ( !checkboxZone.checked() ) {  
      
        translate(canvasWidth - 1.3*yheight_wheel_scheme,  ymargin + 1.0*yheight_inputs); //- 3*yheight_inputs + 0.25/4.0*yheight_wheel);
        drawWheelScheme(yheight_wheel_scheme, [1,0,0, 0,0,0, 0,0,0, 0,0,0], 'Monochromatic');
      
        translate(0, 2.5*yheight_wheel_scheme);
        drawWheelScheme(yheight_wheel_scheme, [1,0,0, 0,0,0, 1,0,0, 0,0,0], 'Complementary');

        translate(0, 2.5*yheight_wheel_scheme);
        drawWheelScheme(yheight_wheel_scheme, [1,1,0, 0,0,0, 0,0,0, 0,0,1],'Analogous');

        translate(0, 2.5*yheight_wheel_scheme);
        drawWheelScheme(yheight_wheel_scheme, [1,1,0, 0,0,0, 1,0,0, 0,0,1],'Comp-Analg');


        translate(0, 2.5*yheight_wheel_scheme);
        drawWheelScheme(yheight_wheel_scheme, [1,0,0, 0,1,0, 0,0,1, 0,0,0], 'Triad');

        translate(0, 2.5*yheight_wheel_scheme);
        drawWheelScheme(yheight_wheel_scheme, [1,0,0, 1,0,0, 1,0,0, 1,0,0],'Square');

        translate(0, 2.5*yheight_wheel_scheme);
        drawWheelScheme(yheight_wheel_scheme, [1,1,1, 0,0,0, 0,0,0, 1,1,1],'Half Shell');

      }  // if (!checkboxZone.checked() )
      
      //drawWheelScheme(yheight_wheel/4, [1,0,0, 0,0,0, 0,0,0, 0,0,0], 'Monochromatic');

      pop();  // restore the state. Now at top of canvas (0,0)
  
    } else {
      
    } // if (originalimg && ((originalimg.width > 1) && ...
  
  }  //white repeat numer loop
   
}  //========== draw ===============


function pickNormForBothwheels() {
  yMaxRGB = max(hueHistogram);
  yMaxRYB = max(hueHistogramRYB);

  return max(yMaxRGB, yMaxRYB)  
}  //============== pickNormForBothwheels ==========


function drawColorWheel(yyheight_wheel ){
  // draw in circle with arcs (color wheel). Origin is in the center. 

  y2 = yyheight_wheel; 
   yradius = y2 /(2.0*1.2);

 
  if ((max(hueHistogram) == 0) ) {    //Skip if black and white.
    strokeWeight(0);
    stroke(0);
    fill('black')  // red text with no black stroke
    textSize(18);
   
    textAlign(CENTER, CENTER);
    text('This image is in Black and White.',  0, 0);
    text('So no color wheel.',  0, 1*yheight_inputs);
   
  } else {  
    yMax = pickNormForBothwheels();  //max(hueHistogram);
    yMaxsqrt = sqrt(yMax);
    //yMaxsqrt = sqrt(max(hueHistogram));
    angleMode(DEGREES);
    colorMode(HSL);
 
    rotate(-90);  // want red at the top
    y1max = yradius;
  
     for (x = 0; x < maxHueBin; x++) {
     
      index = hueHistogram[x];
      y1sqrt = int(map(sqrt(index), 0, yMaxsqrt, 0, 2*yradius));    
      lineColor = x * hueBinSize;

      // don't need this gratuitous circle
      strokeWeight(1);
      stroke(0,0,100);
      fill(lineColor, 0, 75)  // light gray background with black stroke
       arc(0, 0, 2*yradius, 2*yradius, 
         round(x* hueBinSize -float(hueBinSize)/2.0), round(x* hueBinSize + float(hueBinSize)/2.0), PIE);

      strokeWeight(1);
      stroke(0);
      fill(lineColor, 100, 50) // colored pie sections with black stroke
       arc(0, 0, y1sqrt, y1sqrt, round(x* hueBinSize -float(hueBinSize)/2.0), round(x* hueBinSize + float(hueBinSize)/2.0), PIE);
    
      stroke(lineColor);
      fill(lineColor, 100, 50);  // numbers in degrees colored
      rotate(+90);   // want text horizontal
      textAlign(CENTER, CENTER);
      textSize(16);
      text(lineColor, sin(lineColor)*(yradius)*1.12, -1*cos(lineColor)*(yradius)*1.12 );
      rotate(-90);  // want red at the top
     
    }
    rotate(90);  // return 0 degrees to x axis so that translate works as expected in next subroutine drawColorWhiteGrayBlackWheel

  }
      
}  //==========  drawColorWheel ======================================



function drawColorWheelRYB(yyheight_wheel ){
  // draw in circle with arcs (color wheel). Origin is in the center. 
  temp = new Array(maxHueBin);

  y2 = yyheight_wheel; 
  yradius = y2 /(2.0*1.2);

 
  if ((max(hueHistogramRYB) == 0) ) {    //Skip if black and white.
    strokeWeight(0);
    stroke(0);
    fill('black')  // red text with no black stroke
    textSize(18);
   
    textAlign(CENTER, CENTER);
    text('This image is in Black and White.',  0, 0);
    text('So no color wheel.',  0, 1*yheight_inputs);
   
  } else { // normWeight
    //for (x = 0; x < maxHueBin; x++) {
    //  temp[x] = hueHistogramRYB[x] * normWeight[x];
    //}
    //yMax = max(temp);
    //yMaxsqrt = sqrt(max(temp));
    yMax = pickNormForBothwheels();  // max(hueHistogramRYB );
    yMaxsqrt = sqrt(yMax);
    angleMode(DEGREES);
    colorMode(HSL);
 
    rotate(-90);  // want red at the top
    y1max = yradius;
  
     for (x = 0; x < maxHueBin; x++) {
     
      //index = hueHistogramRYB[x] * normWeight[x];
      index = hueHistogramRYB[x];
      y1sqrt = int(map(sqrt(index), 0, yMaxsqrt, 0, 2*yradius));    
      //lineColor = hueRGBtable[x * hueBinSize];
      lineColor = hueRYBtable[x * hueBinSize];

      strokeWeight(1);
      stroke(0,0,100);
      fill(lineColor, 0, 75)  // light gray background with black stroke
       arc(0, 0, 2*yradius, 2*yradius, 
         round(x* hueBinSize -float(hueBinSize)/2.0), 
         round(x* hueBinSize + float(hueBinSize)/2.0), PIE);

      strokeWeight(1);
      stroke(0);
      fill(lineColor, 100, 50) // colored pie sections with black stroke
       arc(0, 0, y1sqrt, y1sqrt, round(x* hueBinSize -float(hueBinSize)/2.0),
        round(x* hueBinSize + float(hueBinSize)/2.0), PIE);
    
      stroke(lineColor);
      fill(lineColor, 100, 50);  // numbers in degrees colored
      rotate(+90);   // want text horizontal
      textAlign(CENTER, CENTER);
      textSize(16);
      text( (x * hueBinSize), sin(x * hueBinSize)*(yradius)*1.12, 
        -1*cos(x * hueBinSize)*(yradius)*1.12 );
     // text(lineColor, sin(lineColor)*(yradius)*1.12, -1*cos(lineColor)*(yradius)*1.12 );
      rotate(-90);  // want red at the top
     
    }
    rotate(90);  // return 0 degrees to x axis so that translate works as expected in next subroutine drawColorWhiteGrayBlackWheel

  }
      
}  //==========  drawColorWheelRYB ======================================






function  drawWheelScheme(yyheight_wheel, whichWedge, labelStr){
  // draw in circle with arcs (color wheel). Origin is in the center. 
  // whichWedge is an array of length 12, with values 1 (true) and 0 (false)
  schemeBinSize = 30; // 12*30 = 360

  yradius = 2.0*yyheight_wheel/(2.0*1.10); //fudge

  
  angleMode(DEGREES);
  colorMode(HSL);
  rotate(-90);  // want red at the top
  
  stroke(0,0,100); // white 
  strokeWeight(1);
  for (x = 0; x < 12; x++) {
     if (whichWedge[x]) {
      fill(0, 0, 25);  // light gray background with white stroke
    } else {
      fill(0, 0, 75);  // dark gray background with white stroke
    }
    arc(0, 0, 2*yradius, 2*yradius, 
       round(x* schemeBinSize -float(schemeBinSize)/2.0), round(x* schemeBinSize + float(schemeBinSize)/2.0), PIE);
     
 }
   
  rotate(90);  // return 0 degrees to x axis so that translate works as expected in next subroutine drawColorWhiteGrayBlackWheel
 
  textAlign(CENTER, BOTTOM);
  textSize(12);
  fill('black');
  text(labelStr, 0, 1.3*yyheight_wheel) ;
 
}  //==========  drawWheelScheme ======================================


function createHueHistogram() {
  debugThis = 0;

  var ischeckboxColorClips;
  var isRadioGrayZone;
  var isRadioRGBZone;
  var isRadioRYBZone;
  

  whiteBins = 0;
  grayBins = 0;
  blackBins = 0;
  hueBins = 0;
  whiteBinsRYB = 0;
  grayBinsRYB = 0;
  blackBinsRYB = 0;
  hueBinsRYB = 0;
  
   
  for (i = 0; i < 5; i++) {
    numZone[i] = 0;
    numZoneRYB[i] = 0;
  }  

  clippedimg.loadPixels();
  //clippedimgRYB.loadPixels();

  for (i = 0; i < maxHueBin; i++) {
    hueHistogram[i] = 0;
    hueHistogramRYB[i] = 0;
  }

  if (radioZones.value()  == 'Gray Zones') {
    isRadioGrayZone = true;
  } else if (radioZones.value()  == 'RGB Zones') {
    isRadioRGBZone = true;
  } else if (radioZones.value()  == 'RYB Zones') {
    isRadioRYBZone = true;
  } 
  
  ischeckboxColorClips = checkboxColorClips.checked();
  if (ischeckboxColorClips) {
    clipBlack = [0, 0, 255];  // blue
    clipWhite = [255, 0, 0];  // red
    clipGray = [0, 255, 0];  // green
  } else {
    clipBlack = [0, 0, 0];  
    clipWhite = [255, 255, 255];  
    clipGray = [128, 128, 128]; 
   }
 
  all = 0;
  allRYB = 0;
  for (var x = 0; x < img.width; x++) {
    for (var y = 0; y < img.height; y++) {
      loc = 4 * (y * img.width + x);  
      colorMode(RGB);  //temprarily switch because pixels() are always RGB
      cRGB = color(img.pixels[loc], img.pixels[loc+1], img.pixels[loc+2]);
      hRGB = abs(round(hue(cRGB)));  //don't want -0
      if (hRGB == 360) hRGB = 0;
      sRGB = abs(round(saturation(cRGB)) );
      lRGB = abs(round(lightness(cRGB)) ); 
      lRGB_100 =  abs(round(lightness(cRGB) )); // 0-100
      lRGB_255 =  abs(round(lightness(cRGB) * 255.0/100.0 )); // 0-255
   
      // Prep for alternative RYB color wheel
      hRYB = hueRGBtable[hRGB];  //Note: inverse of  hueRYBtable[hRGB]
      
      colorMode(HSL);
   
       // hueRGB 0-360.0 
       if (hRGB == 0) {
        whichHueBin = 0;
      } else {
        whichHueBin= abs(round( float(hRGB) / float(hueBinSize) ));
      }
      if (hRYB == 0) {
        whichHueBinRYB = 0;
      } else {
        whichHueBinRYB = abs(round( float(hRYB) / float(hueBinSize) ));
      }
       
      if (whichHueBin == maxHueBin) { // wrap around circle
        whichHueBin = 0;
      }
      if (whichHueBinRYB == maxHueBin) { // wrap around circle
        whichHueBinRYB = 0;
      }
     
      all++;
      allRYB++;

      //Use black/white/gray slider values for both RGB and RYB color wheels
      let isWhite = ( (round(lRGB) >= whiteslider.value()) ); // || (sRGB == 100) ); //lRGB 50-100
      let isBlack = ( (round(lRGB) <= blackslider.value()) ); // &&  !(sRGB == 100) );  // lRBG 0-49
      if ((round(lRGB) == 0) && (round(sRGB) == 0)) isBlack = true; 
      if ((round(lRGB) == 100) && (round(sRGB) == 0)) isWhite = true; 
      isGray = ( (!isWhite) && (!isBlack) && (round(sRGB) <= grayslider.value())  ); //sRGB 0-100 0 is gray scale, 100 is fully saturated
    
      // Maybe a bit of a fudge using the RGB black/whites/grays on the RYB wheel.
      // Off hand, don't have way to calculate the luminosity and saturation for RYB.
      let isWhiteRYB = isWhite;
      let isBlackRYB = isBlack;
      let isWGrayRYB = isGray;
      
      numZone[ZoneLookUpTable[lRGB_100]]++;  // for gray scale zone system 0-100

      if ( isBlack) {
        blackBins++;
        clippedimg.pixels[loc] = clipBlack[0];
        clippedimg.pixels[loc+1] = clipBlack[1];
        clippedimg.pixels[loc+2] = clipBlack[2];

      } else if ( isWhite) {
        whiteBins++
        clippedimg.pixels[loc] = clipWhite[0];
        clippedimg.pixels[loc+1] = clipWhite[1]; 
        clippedimg.pixels[loc+2] = clipWhite[2];

      } else if ( isGray  && !isRadioGrayZone )  {
      //} else if ( isGray )  {
        grayBins++
        clippedimg.pixels[loc] = clipGray[0];
        clippedimg.pixels[loc+1] = clipGray[1];
        clippedimg.pixels[loc+2] = clipGray[2];

      } else {

        if (isRadioGrayZone ) { // Ansel Adam's zone system
          grayBins++
          grayBand = abs(round(midRangeLookUpTable[lRGB_100] * 255./100.));
          clippedimg.pixels[loc] = grayBand;  // convert to zoned gray scale 
          clippedimg.pixels[loc+1]  = grayBand; 
          clippedimg.pixels[loc+2] =  grayBand;  

        } else { // not isRadioGrayZone 
          hueBins++;
          hueHistogram[whichHueBin]++
          hueBinsRYB++;
          hueHistogramRYB[whichHueBinRYB]++
          if (isRadioRGBZone ) {  // Red Green Blue  color wheel histogram
            tempc = color(whichHueBin*hueBinSize, 100, 50);
            clippedimg.pixels[loc] = tempc._getRed();  
            clippedimg.pixels[loc+1]  = tempc._getGreen(); 
            clippedimg.pixels[loc+2] =  tempc._getBlue();  

          } else if (isRadioRYBZone ) {  // Red Yellow Blue  color wheel histogram
            tempc = color(hueRYBtable[whichHueBinRYB*hueBinSize], 100, 50); 
            clippedimg.pixels[loc] = tempc._getRed();  
            clippedimg.pixels[loc+1]  = tempc._getGreen(); 
            clippedimg.pixels[loc+2] =  tempc._getBlue();  
          }
        }  // not isRadioGrayZone 

       
      }

    }  //for (var y = 0; y < img.height; y++)
  }  // for (var x = 0; x < img.width; x++) 

  clippedimg.updatePixels();
 
}  //=========== createHueHistogram =================== 



function drawZones( xwidth, yheight) { 
  // Ansel Adam's zone system, but only 5 zones due to limiations of 8-bit jpg and png
  
  yMax = max(numZone);
  
  if (yMax > 0) {
    for (i = 0; i < 5; i++) {  
      grayColor = rangeMid[i]; // 0-100
      
      xpos = round(float(rangeBottom[i])*xwidth/100.0); // remember xmargin;
      y2 =  round( float(yheight * numZone[i]) / float(yMax) );
      xbinsize = round( float(rangeTop[i] - rangeBottom[i])*xwidth/100.0);  // 0 - 100 converted to fraction
      xbottomPos = round(rangeBottom[i]*xwidth/100.0);  //
      xmidPos = round(rangeMid[i]*xwidth/100.0);  //
      xtopPos = round(rangeTop[i]*xwidth/100.0);  //
      
      strokeWeight(0);
      fill(grayColor);  // gray shade
      rect(xbottomPos, 0, xbinsize, -y2);
      
      stroke('orange');  // line for center of bin
      strokeWeight(3);
      line((xmidPos), 0, (xmidPos), -y2);
      
    } // for (i = 0; i < 5; i++) 

    stroke(240, 100, 50);  // blue line for ignore black range
    translate(0, 5);  //xcanvas =+ 0; ycanvas =+3; // a cheat
    strokeWeight(5);
    line(0, 0, round(xwidth* ( blackslider.value())/100.0 ), 0);

    stroke(0, 100, 50);  // red line for ignore white range
    strokeWeight(5);
    line(xwidth, 0, round(xwidth* whiteslider.value()/100.0 ), 0);
    translate(0, -5);  //xcanvas =+ 0; ycanvas =+ -3; 
   
    // next put text label mid gray 18% gray
  } else {  // should never get here.
    textSize(18);
    text('This image is in color', 0, -3*ymargin);
    text('There are no pure Blacks or Whites.', 0, 0);
    text('There are no pure grays.', 0, 3*ymargin);
  }

} //==================== drawZones =================



function initZoneLookUpTable_linear() {
  // This is for processed JPG, PGN, HEIC files- 
  // they have had Gamma correction upon processing from RAW files, 
  // Using range 0-100 from values of lRGB luminance
  //
  //https://en.wikipedia.org/wiki/File:Linear_Distribution_versus_Gamma_Corrected_Distribution.png
  //says that jpeg compensates using ganna correcting and the result is linear. Whatever. 0-255 bits.is 5 stops.
  // I read elsewhere it was 5.25 stops, but close enough and easier to calculate. Very naive anyway.
  // But lHGB is 0-100, so keep that and devide by 5 to get 20 (or 19 bins if use 5.24 stops) values per bin. 
  // Add the extra one to black.

  const zoneBlacks = 0; // -2.0-ish to -1.5 Ev. Including pure black
  rangeBottom[zoneBlacks] = 0;
  rangeMid[zoneBlacks] = 10;
  rangeTop[zoneBlacks] = 20;
   
  const zoneneg1Ev = 1; // -1.5 to -0.5 Ev
  rangeBottom[zoneneg1Ev] = 21;
  rangeMid[zoneneg1Ev] = 30;
  rangeTop[zoneneg1Ev] = 40;
 
  const zone0Ev = 2; //  -0.5 to 0.5 Ev
  rangeBottom[zone0Ev] = 41;
  rangeMid[zone0Ev] = 50;  // middle gray 18% gray
  rangeTop[zone0Ev] = 60;
 
  const zone1Ev = 3; //  0.5 to 1.5 Ev
  rangeBottom[zone1Ev] = 61;
  rangeMid[zone1Ev] = 70;
  rangeTop[zone1Ev] = 80;
 
  const zoneWhites = 4; // 1.5 to 2.5-ish Ev. Including pure white.
  rangeBottom[zoneWhites] = 81;
  rangeMid[zoneWhites] = 90;
  rangeTop[zoneWhites] = 100;
     
  for (i = rangeBottom[zoneBlacks]; (i <= rangeTop[zoneBlacks]); i++) {
    ZoneLookUpTable[i] = zoneBlacks;
    midRangeLookUpTable[i] = rangeMid[zoneBlacks];
  }
  for (i = rangeBottom[zoneneg1Ev]; (i <= rangeTop[zoneneg1Ev]); i++) {
    // for (i = 0; ((i >= rangeBottom[zoneneg1Ev]) && (i <= rangeTop[zoneneg1Ev]) ); i++)  {
    ZoneLookUpTable[i] = zoneneg1Ev;
    midRangeLookUpTable[i] = rangeMid[zoneneg1Ev];
 
  }
  for (i = rangeBottom[zone0Ev]; (i <= rangeTop[zone0Ev]); i++) {
   // for (i = 0; ((i >= rangeBottom[zone0Ev]) && (i <= rangeTop[zoneB0Ev]) ); i++)  {
    ZoneLookUpTable[i] = zone0Ev;
    midRangeLookUpTable[i] = rangeMid[zone0Ev];
  }
  for (i = rangeBottom[zone1Ev]; (i <= rangeTop[zone1Ev]); i++) {
  //  for (i = 0; ((i >= rangeBottom[zone1Ev]) && (i <= rangeTop[zone1Ev]) ); i++)  {
    ZoneLookUpTable[i] =  zone1Ev;
    midRangeLookUpTable[i] = rangeMid[zone1Ev];
  }
  for (i = rangeBottom[zoneWhites]; (i <= rangeTop[zoneWhites]); i++) {
    // for (i = 0; ((i >= rangeBottom[zoneWhites]) && (i <= rangeTop[zoneWhites]) ) ; i++) {
    ZoneLookUpTable[i] = zoneWhites;
    midRangeLookUpTable[i] = rangeMid[zoneWhites];
  }
    
} // ========= initZoneLookUpTable_linear =================


// Looks very useful but not used. DON'T DELETE
//function rgb2ryb( RGBarray){  
//// input [r,y,b] values for single color with values 0-1, 0-1, 0-1. Convert if appears to be values 0-255, 0-255, 0-255
////  based on https://rdrr.io/cran/PBSmapping/src/R/extraFuns.r
////## RGB2RYB------------------------------2021-01-06
////##  Convert RGB colours to RYB colours.
////##  Algorithm based on Sugita and Takahashi (2015,2017)
////## [http://nishitalab.org/user/UEI/publication/Sugita_IWAIT2015.pdf]
////## [https://danielhaim.com/research/downloads/Computational%20RYB%20Color%20Model%20and%20its%20Applications.pdf]
//
// debugThis = 1;
//
//  if ( (RGBarray[0] > 1) ||  (RGBarray[1] > 1) ||  (RGBarray[2] > 1) ) {
//    RGBarray[0] = abs(float(RGBarray[0]) /255.0);
//    RGBarray[1] = abs(float(RGBarray[1]) /255.0);
//    RGBarray[2] = abs(float(RGBarray[2]) /255.0);
//  }
//  
//  Rrgb = RGBarray[0];
//	Grgb = RGBarray[1];
//	Brgb = RGBarray[2];
//
//
//  //## Remove whiteness
//	//Iw = 0.0  //pmin(R.rgb,G.rgb,B.rgb)
//	Iw = min([Rrgb,Grgb,Brgb]);
//	//Iw = pmin(Rrgb,Grgb,Brgb)
//	rrgb = Rrgb - Iw;
//	grgb = Grgb - Iw;
//	brgb = Brgb - Iw;
//  //if (debugThis) console.log('rgb2ryb IW rrgb, grgb, brgb', Iw, rrgb, grgb, brgb);
// 
//  //if (debugThis) console.log('rgb2ryb rrgb, grgb, brgb=', rrgb, grgb, brgb);
// 
//  //## Calculate ryb values
//	rryb = rrgb - min(rrgb,grgb);
//	yryb = 0.5 * (grgb + min(rrgb,grgb));
//	bryb = 0.5 * (brgb + grgb - min(rrgb,grgb));
// 
//  //## Normalise (p=prime symbol)
//	//n = 1;
//  n = abs(max([rryb,yryb,bryb]) / max([rrgb,grgb,brgb]));
//  if (n == 0.0) n = 1.0;
//  rpryb = rryb / n;
//	ypryb = yryb / n;
//	bpryb = bryb / n;
// 
////## Add black component for subtractive color mixing
//	Ib   = min([1-Rrgb,1-Grgb,1-Brgb]);
//	Rryb = rpryb + Ib;
//	Yryb = ypryb + Ib;
//	Bryb = bpryb + Ib;
//	RYB   =  [Rryb, Yryb, Bryb]; //cbind(red=R.ryb, yellow=Y.ryb, blue=B.ryb)
//
// 
//	return(RYB);
//	
//} // ---------- rgb2ryb ------------

// Looks very useful but not used. DON'T DELETE
////# RYB2RGB------------------------------2021-01-06
//// input [r,g,b] values for single color with values 0-1, 0-1, 0-1. Convert if appears to be values 0-255, 0-255, 0-255
////  based on https://rdrr.io/cran/PBSmapping/src/R/extraFuns.r
////##  Convert RYB colours to RGB colours.
////##  Algorithm based on Sugita and Takahashi (2015,2017)
////## [http://nishitalab.org/user/UEI/publication/Sugita_IWAIT2015.pdf]
////## [https://danielhaim.com/research/downloads/Computational%20RYB%20Color%20Model%20and%20its%20Applications.pdf]
////## ---------------------------------------------RH
//function ryb2rgb(RYBarray)
//{
//	//if (is.null(dim(RYBmat))) if (length(RYBmat)>2) RYBmat<-matrix(RYBmat, ncol=3,byrow=TRUE)
//	//if (nrow(RYBmat)==3 && ncol(RYBmat)!=3) RYBmat = t(RYBmat)
//	//## Re-scale to 1
//	
//  if ( (RYBarray[0] > 1) ||  (RYBarray[1] > 1) ||  (RYBarray[2] > 1) ) {
//    RYBarray[0] = abs(float(RYBarray[0]) /255.0);
//    RYBarray[1] = abs(float(RYBarray[1]) /255.0);
//    RGYBarray[2] = abs(float(RYBarray[2]) /255.0);
//  }
//
//	//## Deconstruct to vectors
//	Rryb = RYBarray[1];
//	Yryb = RYBarray[2];
//	Bryb = RYBarray[3];
//	//## Remove black 
//	Ib   = min([Rryb,Yryb,Bryb]);
//	rryb = Rryb - Ib;
//	yryb = Yryb - Ib;
//	bryb = Bryb - Ib;
//	//## Calculate rgb values
//	rrgb = rryb + yryb - min(yryb,bryb);
//	grgb = yryb + min(yryb,bryb);
//	brgb = 2 * (bryb - min(yryb,bryb));
//	//## Normalise (p=prime symbol)
//	n = max([rrgb,grgb,brgb]) / max([rryb,yryb,bryb]);
//	if (n==0) n= 1; // ## for cases when n=0
//	
//	rprgb = rrgb / n;
//	gprgb = grgb / n;
//	bprgb = brgb / n;
//	//## Add white component
//	Iw   = min([1-Rryb, 1-Yryb, 1-Bryb]);
//	Rrgb = rprgb + Iw;
//	Grgb = gprgb + Iw;
//	Brgb = bprgb + Iw;
//	RGB   = [Rrgb, Grgb, Brgb];
//	return(RGB);
//}
//// ##~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~RYB2RGB


function makeLookUpTableHuergb2ryb() {
  // based on https://sighack.com/post/procedural-color-algorithms-hsb-vs-ryb

  hueRYBtable = new Array(360);
  hueRGBtable = new Array(360); // inverse lookup table
  
  // start with brute force lookup table every 15 degrees then interpolate
  hueRGBShorttable = [0, 15, 30, 45, 60, 75, 
            90, 105, 120, 135, 150, 165, 
            180,195, 210, 225, 240, 255, 
            270, 285, 300, 315, 330, 345, 
            360];
  sameHueInRYBShorttable = [ 0, 8, 17, 26, 34, 41,
                        48, 54, 60, 81, 103, 123,
                      138, 155, 171, 187, 204, 209, 
                      234, 251, 268, 282, 298, 329,
                    0];

  for ( ihue =0; ihue < 360; ihue++) { // sample RGB/RYB hues every 1 degree
    for ( i = 0; i < hueRGBShorttable.length - 1; i++) {
      x0 = float(hueRGBShorttable[i]);
      x1 = float(hueRGBShorttable[i + 1]);
      y0 = float(sameHueInRYBShorttable[i]);
      y1 = float(sameHueInRYBShorttable[i + 1]);

      /* Ensure that y1 > y0 */
      if (y1 < y0) y1 += 360;
      if (x1 < x0) x1 += 360;
  
     /* If hue lies between y0 and y1, do linear mapping */
      if (ihue >= x0 && ihue < x1) {  // ihue is in RGB
        hueRYB = map(ihue, x0, x1, y0, y1)  
        hueRYBtable[ihue] = abs(round(hueRYB));
        if (hueRYBtable[ihue] > 360)  hueRYBtable[ihue] = hueRYBtable[ihue] -360;
      }
      
      // make the inverse table
      if (ihue >= y0 && ihue < y1) {  // ihue is in RYB
        hueRGB = map(ihue, y0, y1, x0, x1)  
        hueRGBtable[ihue] = abs(round(hueRGB));
        if (hueRGBtable[ihue] > 360)  hueRGBtable[ihue] = hueRGBtable[ihue] -360;
      }  

    }
  }
                   
  
} // ----------- makeLookUpTableHuergb2ryb ============

function handleFile(file)  {  
  
  if (file.type === 'image') {
   
    textSize(16);
    fill(0, 100, 50);

    originalimg = loadImage(file.data);  // this is our fresh, unchanged small copy
    //img.loadPixels(); // gets pixels from image only once. 
    originalimg.loadPixels();
    
    ytarget = yheight_image;
    xtarget = round(float(originalimg.width * ytarget)/float(originalimg.height));
   
    img = createImage(xtarget, ytarget);
    img.loadPixels();
    img.copy(originalimg, 0, 0, originalimg.width, originalimg.height, 0,0, img.width, img.height);
    
    // this is our modifed small copy, each time refreshed.
    clippedimg = createImage(xtarget, ytarget);
    clippedimg.copy(img, 0, 0, img.width, img.height, 0,0, clippedimg.width, clippedimg.height);
    
    file_name = file.name;
    
  } else {
    img = null;
  } 

}  //====== handleFile=========
