import * as React from 'react'
import * as ReactDOM from 'react-dom'
import InjectView, {CommonData} from '../common/view';
import Downloader from './downloader'
let STYLE = require("./downloader.css");

interface State extends CommonData{
    downloadBtnText: string;
}

class EpListAssDownloadView extends InjectView<State>{

    constructor(){
        super(new Downloader());
    }
    componentWillMount(){
        this.setState({downloadBtnText: "下载全部弹幕"});
    }

    startDownload(){
        this.downloader.start(this.filterConfig,
            ()=>{
                this.setState({
                    showSettings: false,
                    downloadBtnText: "下载中...",
                });
            })
            .then(()=>{
                this.setState({
                    downloadBtnText: "下载全部弹幕"
                })
            })

    }
    render(){
        return (
            <div>
                <div className={STYLE.downloadAssBtn} onClick={()=>this.setState({showSettings: true})}>
                    {this.state.downloadBtnText}
                </div>
                {this.renderSettings()}
            </div>
        )
    }
}
let downloadBtn = document.createElement("div");
let shareBtns = document.getElementsByClassName("share-wrp")[0];
let btnsContainer = document.getElementsByClassName("info-btm")[0];
btnsContainer.insertBefore(downloadBtn, shareBtns);
ReactDOM.render(<EpListAssDownloadView />, downloadBtn);