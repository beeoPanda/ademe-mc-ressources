function sendHeight() {
  var sizeTracker = document.getElementById("sizeTracker");
  var height = sizeTracker.offsetTop + sizeTracker.offsetHeight;
  window.parent.postMessage({ t: "h", h: height, s: window.location.href }, "*");
}
window.addEventListener("load", sendHeight);
var resizeObserver = new ResizeObserver(sendHeight);
var sizeTracker = document.createElement("div");
sizeTracker.id = "sizeTracker";
document.body.appendChild(sizeTracker);
resizeObserver.observe(sizeTracker);
var mutationObserver = new MutationObserver(sendHeight);
mutationObserver.observe(document.body, { attributes: true, childList: true, subtree: true });
