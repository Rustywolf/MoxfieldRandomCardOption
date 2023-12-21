import { MRCO_VERSION_ID } from "./utils";

function injectFile(version, id) {
  var v = document.createElement('input');
  v.type = "text";
  v.hidden = true;
  v.value = version;
  v.id = id;
  (document.body || document.documentElement).appendChild(v);

  var s = document.createElement('script');
  s.src = chrome.runtime.getURL('injected.js');
  s.onload = function () { s.remove(); };
  (document.head || document.documentElement).appendChild(s);
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    chrome.scripting.executeScript({
      target: { tabId },
      func: injectFile,
      args: [chrome.runtime.getManifest().version, MRCO_VERSION_ID]
    })
  }
});