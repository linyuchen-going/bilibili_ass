/*
对单个视频页注入
* */
import * as Api from '../../../Config/api'
import Downloader from '../../../Downloader/index'
import DanmuFilterConfig from "../../../Config/danmufilter"
import CommonDownloader from '../common/downloader'
import Bangumi from '../../../Bangumi'
let FileSave = require("file-saver");

export default class AssDownloader extends Downloader implements CommonDownloader{
    injectEleId = "inject-data-bili-ass";
    injectEleAttrDanmuId = "data-cid";
    injectEleAttrEpisodeId = "data-eid";
    injectEleAttrVideoName = "data-video-name";
    danmuId: string;
    episodeId: string;
    videoName: string;

    save(danmuId: string, title: string): void{
        let saveAss = ()=>{
            super.download(danmuId, (assText) => {
                let blob = new Blob([assText], {type: 'application/octet-stream'});
                FileSave.saveAs(blob, `${title}.ass`);
            });
        };
        this.danmuApi.getUserFilter((res: Api.UserDanmuFilterResponse) => {
            this.filterRules = res.data.rule;
            saveAss();
        }, (res) => {
            saveAss();
        });
    }

    public start(danmuFilterConfig: DanmuFilterConfig=null):void{
        if (danmuFilterConfig){
            this.setDanmuFilterConfig(danmuFilterConfig)
        }
        let jsEle = this.injectDataEle();
        let dataEle = this.getInjectData();
        document.body.removeChild(jsEle);
        document.body.removeChild(dataEle);
        if(this.danmuId){
            this.save.call(this, this.danmuId, this.videoName);
        }
        else{ // 番剧是不能从window变量中直接得到弹幕id(cid)的
            let cidReg = document.body.innerHTML.match(/cid=(\d+)/);  // 直接从html页面找弹幕id（cid）
            if(cidReg){
                this.danmuId = cidReg[1];
                this.save.call(this, this.danmuId, this.videoName);
            }
            else if(this.episodeId){
                let bagumiApi = new Bangumi();
                bagumiApi.getEpDetail(parseInt(this.episodeId))
                    .then((res:Api.EpDetailResponse)=>{
                        this.save(res.result.currentEpisode.danmaku, this.videoName);
                    })
            }
        }

    }

    private injectDataEle(): HTMLElement{
        let injectJs = `var injectEle = document.createElement("div");
        injectEle.id = "${this.injectEleId}";
        injectEle.setAttribute("${this.injectEleAttrDanmuId}", window.cid || "")
        injectEle.setAttribute("${this.injectEleAttrEpisodeId}", window.episode_id || "")
        injectEle.setAttribute("${this.injectEleAttrVideoName}", wb_title)
        document.body.append(injectEle)
        `;
        let injectJsEle = document.createElement("script");
        injectJsEle.innerHTML = injectJs;
        injectJsEle.setAttribute("type", "text/javascript");
        document.body.appendChild(injectJsEle);
        return injectJsEle;
    }

    private getInjectData(): HTMLElement{
        let injectEle = document.getElementById(this.injectEleId);
        this.danmuId = injectEle.getAttribute(this.injectEleAttrDanmuId);
        this.episodeId = injectEle.getAttribute(this.injectEleAttrEpisodeId);
        this.videoName = injectEle.getAttribute(this.injectEleAttrVideoName);
        return injectEle;
    }

}


