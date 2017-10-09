import * as Message from './messages'
let win = <any>window;

function send(){
    // window.postMessage({"type": "download"}, "*");
    win.chrome.tabs.query({active: true, currentWindow: true}, function(tabs: any) {
        let msg: Message.Message = {
            type: Message.MsgType.download
        };
        win.chrome.tabs.connect(tabs[0].id).postMessage(msg);
        }
    );
}
document.getElementById("send").onclick = send;