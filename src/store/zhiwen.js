const canvass = document.createElement("canvas");
const webgl = canvass.getContext("webgl");
// console.log(webgl.getSupportedExtensions());
var UNMASKED_VENDOR_WEBGL = webgl.getExtension(
  "WEBGL_debug_renderer_info"
).UNMASKED_VENDOR_WEBGL;
var UNMASKED_RENDERER_WEBGL = webgl.getExtension(
  "WEBGL_debug_renderer_info"
).UNMASKED_RENDERER_WEBGL;
var a1 = webgl.getParameter(UNMASKED_VENDOR_WEBGL);

var a2 = webgl.getParameter(UNMASKED_RENDERER_WEBGL);
// console.log(
//   webgl.getExtension("WEBGL_debug_renderer_info").UNMASKED_VENDOR_WEBGL
// );
// console.log(
//   webgl.getExtension("WEBGL_debug_renderer_info").UNMASKED_RENDERER_WEBGL
// );
// console.log(a1);
// console.log(a2);
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
ctx.textBaseline = ["top"];
ctx.font = "14px 'Arial'";
ctx.textBaseline = ["alphabetic"];
ctx.fillStyle = "#f60";
ctx.fillRect(125, 1, 62, 20);
ctx.fillStyle = "#069";
ctx.fillText("ClientJS,org <canvas> 1.0", 2, 15);
ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
ctx.fillText("ClientJS,org <canvas> 1.0", 4, 17);
// console.log(canvas.toDataURL());
// console.log(navigator.userAgent); //a字段
// console.log(navigator.hardwareConcurrency);
// console.log(navigator.appCodeName);
// console.log(navigator.appName);
// console.log(navigator.vendor);
// console.log(navigator.languages);
// console.log(navigator.appVersion);
// console.log(navigator.platform);
// console.log(screen.colorDepth);
// console.log(screen.height);
// console.log(screen.availLeft);
// console.log(screen.availTop);
// console.log(screen.availHeight);
// console.log(screen.availWidth);
// console.log(screen.isExtended);
// console.log(screen.pixelDepth);
// console.log(screen.width);
// console.log(window.screenTop);
// console.log(window.screenLeft);
// console.log(window.innerWidth);
// console.log(window.outerWidth);
// console.log(window.innerHeight);
// console.log(window.outerHeight);
export const newData = {
  getSupportedExtensions: webgl.getSupportedExtensions(),
  UNMASKED_VENDOR_WEBGL: webgl.getExtension("WEBGL_debug_renderer_info")
    .UNMASKED_VENDOR_WEBGL,
  UNMASKED_RENDERER_WEBGL: webgl.getExtension("WEBGL_debug_renderer_info")
    .UNMASKED_RENDERER_WEBGL,
  a1,
  a2,
  toDataURL: canvas.toDataURL(),
  userAgent: navigator.userAgent,
  hardwareConcurrency: navigator.hardwareConcurrency,
  appCodeName: navigator.appCodeName,
  appName: navigator.appName,
  vendor: navigator.vendor,
  languages: navigator.languages,
  appVersion: navigator.appVersion,
  platform: navigator.platform,
  colorDepth: screen.colorDepth,
  height: screen.height,
  availLeft: screen.availLeft,
  availTop: screen.availTop,
  availHeight: screen.availHeight,
  availWidth: screen.availWidth,
  isExtended: screen.isExtended,
  pixelDepth: screen.pixelDepth,
  width: screen.width,
  screenTop: window.screenTop,
  screenLeft: window.screenLeft,
  innerWidth: window.innerWidth,
  outerWidth: window.outerWidth,
  innerHeight: window.innerHeight,
  outerHeight: window.outerHeight,
};