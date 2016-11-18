/***
 *
 * rubberband.js
 * rubber band selection routines
 * adapted from http://home.earthlink.net/~wzd3/rubberband.html
 *
 * requires gr.js
 ***/

var gr = new Graphics("canvas");
var c = null;

// setup mouse capturing
//
// http://www.breakingpar.com/bkp/home.nsf/Doc?OpenNavigator&U=87256B14007C5C6A87256B4B0005BFA6
// Set Netscape up to run the "captureMousePosition" function whenever
// the mouse is moved. For Internet Explorer and Netscape 6, you can capture
// the movement a little easier.

if (document.layers) { // Netscape
    document.captureEvents(Event.MOUSEMOVE);
    document.onmousemove = captureMousePosition;
} else if (document.all) { // Internet Explorer
    document.onmousemove = captureMousePosition;
} else if (document.getElementById) { // Netcsape 6
    document.onmousemove = captureMousePosition;
}

// Global variables
var xMousePos = 0; // Horizontal position of the mouse on the screen
var yMousePos = 0; // Vertical position of the mouse on the screen

function captureMousePosition(e) {
  if (document.layers) {
    // When the page scrolls in Netscape, the event's mouse position
    // reflects the absolute position on the screen. innerHight/Width
    // is the position from the top/left of the screen that the user is
    // looking at. pageX/YOffset is the amount that the user has
    // scrolled into the page. So the values will be in relation to
    // each other as the total offsets into the page, no matter if
    // the user has scrolled or not.
    xMousePos = e.pageX;
    yMousePos = e.pageY;
  } else if (document.all) {
    // When the page scrolls in IE, the event's mouse position
    // reflects the position from the top/left of the screen the
    // user is looking at. scrollLeft/Top is the amount the user
    // has scrolled into the page. clientWidth/Height is the height/
    // width of the current page the user is looking at. So, to be
    // consistent with Netscape (above), add the scroll offsets to
    // both so we end up with an absolute value on the page, no
    // matter if the user has scrolled or not.
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
    xMousePos = window.event.x + scrollLeft;
    yMousePos = window.event.y + scrollTop;
  } else if (document.getElementById) {
    // Netscape 6 behaves the same as Netscape 4 in this regard
    xMousePos = e.pageX;
    yMousePos = e.pageY;
  }
}

var divX1;
var divX2;
var divY1;
var divY2;
var drawing = false;
var startX = 0;
var startY = 0;
var p = null;
var a = 0;

function startLine(){
  var canvas = document.getElementById('canvas');
  divX1 = canvas.offsetLeft;
  divY1 = canvas.offsetTop;
  divX2 = divX1 + canvas.offsetWidth;
  divY2 = divY1 + canvas.offsetHeight;
  startX= (xMousePos-divX1);
  startY= (yMousePos-divY1);
  drawing = true;
  drawBand();
}

function stopLine(){
  drawing = false;
}

function drawBand()
{
  // leave band alone if out of range
  if (xMousePos < divX1 || xMousePos > divX2 || yMousePos < divY1 || yMousePos > divY2){
    window.setTimeout("drawBand();", 10);
    return;
  }

  // don't redraw band if mouse is up
  if (drawing == false)
    return;

  // remove previous band
  if (p)
    gr.removeShape(p);

  gr.penColor = "#FF4040";

  // compute the exact rectangle from start point to mouse point
  var x1 = startX;
  var x2 = xMousePos - divX1;
  var y1 = startY;
  var y2 = yMousePos - divY1;

  if (document.forms[0].selectable_square_size == undefined)
	var selectable_square_size = 10;
  else
	var selectable_square_size = parseInt(document.forms[0].selectable_square_size.value);

  // adjust so x1, y1 is UL corner
  var temp;
  var swap_x = false;
  if (x2 < x1) { temp = x1; x1 = x2; x2 = temp; swap_x = true; }
  var swap_y = false;
  if (y2 < y1) { temp = y1; y1 = y2; y2 = temp; swap_y = true; }

  // now adjust it to cover whole 10x10 blocks
  x1 = Math.floor(x1 / selectable_square_size) * selectable_square_size;
  y1 = Math.floor(y1 / selectable_square_size) * selectable_square_size;
  x2 = Math.ceil(x2 / selectable_square_size) * selectable_square_size;
  if (x2 == x1) x2 += selectable_square_size;
  if (x2 > divX2 - divX1) { x1 -= selectable_square_size; x2 -= selectable_square_size; }
  y2 = Math.ceil(y2 / selectable_square_size) * selectable_square_size;
  if (y2 == y1) y2 += selectable_square_size;
  if (y2 > divY2 - divY1) { y1 -= selectable_square_size; y2 -= selectable_square_size; }

  // compute region width, height
  var w = x2 - x1;
  var h = y2 - y1;

  var f = document.forms[0];
  var pixels_text = 'pixels';

  if (f) {
    // constrain region to max_w, max_h limits
    if (f.max_w && f.max_w.value > 0)
      w = Math.min(w, Math.ceil(f.max_w.value / selectable_square_size) * selectable_square_size);
    if (f.max_h && f.max_h.value > 0)
      h = Math.min(h, Math.ceil(f.max_h.value / selectable_square_size) * selectable_square_size);

    // maximum free sqare
    if (f.free_paid != undefined && f.free_paid.value == 'free'){
      max_sqare = parseInt(f.free_square.value);
      if (max_sqare < w*h) {
        w = parseInt(f.w.value);
        h = parseInt(f.h.value);
      }

    }

    // make sure anchor point does not move
    if (swap_x) x1 = x2 - w;
    if (swap_y) y1 = y2 - h;

    // set form values
    f.x.value = x1
    f.y.value = y1
    f.w.value = w
    f.h.value = h

    if (f.pixels_text)
      pixels_text = f.pixels_text.value;
  }

  // update selection description
  var sel = document.getElementById('selection');
  if (sel) {
    var siz = w * h;
    siz = siz.toString();
    var amt = '';
    if (f) {
      if (f.thousands_separator) {
        while (siz.match(/\d\d\d\d$/))
          siz = siz.replace(/(\d)(\d\d\d)$/, '$1 $2');
        siz = siz.replace(/ /g, f.thousands_separator.value);
      }
//

      if (f.pixel_price != undefined && f.pixel_price.value > 0) {
        if (f.free_paid != undefined && f.free_paid.value == 'free')
                square = 0;
        else
                square =  w * h;
        amt = square * f.pixel_price.value;
        amt = amt.toFixed(2);
     /*   if (f.decimal_point)
          amt = amt.replace(/\./g, f.decimal_point.value);*/
        if (f.thousands_separator) {
          while (amt.match(/\d\d\d\d\D/))
            amt = amt.replace(/(\d)(\d\d\d\D.*)/, '$1 $2');
          amt = amt.replace(/ /g, f.thousands_separator.value);
        }
        if (f.currency_symbol)
          amt = f.currency_symbol.value + amt;
        amt = ', ' + amt;
      }
    }
    var html = '(' + w + ' x ' + h + '), ' + siz + ' ' + pixels_text + amt;
    sel.innerHTML = html;
  }

  p = gr.drawRectangle(x1, y1, w, h);
  window.setTimeout("drawBand();", 10);
}

function moveCanvas(to_id)
{
  var to = document.getElementById(to_id);
  var canvas = document.getElementById('canvas');
  var pos = getPos(to);
  canvas.style.left = pos.x + 'px';
  canvas.style.top = pos.y + 'px';
  canvas.style.visibility = 'visible';
}

// get absolute position of element
// from http://www.alphafilter.com/?inc=article&aid=30
function getPos(el) {
  var p = YAHOO.util.Dom.getXY(el);
  var pos = new Object;
  pos.x = p[0];
  pos.y = p[1];
  return pos;
}
