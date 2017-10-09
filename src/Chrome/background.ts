/*

* */

let chrome = (<any>window).chrome;

chrome.browserAction.onClicked.addListener(()=>{
    chrome.tabs.create({
        url: chrome.extension.getURL('doc/introduction.html'),
    });
});
