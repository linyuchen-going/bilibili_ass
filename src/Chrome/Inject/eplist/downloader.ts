/*
对番剧列表页注入
* */
import {Promise} from 'es6-promise'
import * as Api from '../../../Config/api'
import Bangumi from '../../../Bangumi'
import Downloader from '../../../Downloader/index'
import DanmuFilterConfig from "../../../Config/danmufilter";
import CommonDownloader, {DownloadCallback} from '../common/downloader'

let FileSave = require("file-saver");
let ZipFile = require("jszip");


export default class EpListAssDownloader extends Downloader implements CommonDownloader{
    zipfile = new ZipFile();

    private downloadList(): Promise<void>{
        let bangumi = new Bangumi();
        let epName = document.getElementsByClassName("info-title")[0].getAttribute("title");
        let completeCount = 0;
        return new Promise((completeCallback: DownloadCallback=null)=> {
            bangumi.getEpList(bangumi.getSeasonId())
                .then((epList: Array<Api.EpItem>) => {
                    epList.forEach((epItem: Api.EpItem, epIndex: number) => {
                        bangumi.getEpDetail(epItem.episode_id)
                            .then((epDetail: Api.EpDetailResponse) => {
                                this.download(epDetail.result.currentEpisode.danmaku, (assText) => {
                                    let fileName = `${epDetail.result.season.title} ${epDetail.result.currentEpisode.indexTitle} ${epDetail.result.currentEpisode.longTitle}.ass`
                                    this.zipfile.file(fileName, assText);
                                    completeCount++;
                                    // console.log(`${fileName}下载完成, ${completeCount}/${epList.length - 1}`);
                                    if (completeCount >= epList.length) {
                                        completeCallback && completeCallback();
                                        this.zipfile.generateAsync({type: "blob"}).then(function (content: Blob) {
                                            FileSave.saveAs(content, `${epName}.zip`);
                                        });
                                    }
                                })
                            })
                    });
                })
                .catch((res) => alert("获取番剧列表失败"))
        });
    }
    public start(danmuFilterConfig: DanmuFilterConfig): Promise<void>{
        this.setDanmuFilterConfig(danmuFilterConfig);
        return new Promise<void>((startCallback: DownloadCallback)=>{
            let downloadedPromise = new Promise((completeCallback: DownloadCallback)=>{
                this.downloadList().then(completeCallback);
            });
            this.danmuApi.getUserFilter((res: Api.UserDanmuFilterResponse)=> {
                this.filterRules = res.data.rule;
                startCallback && startCallback();
                return downloadedPromise;
            }, (res)=>{
                startCallback && startCallback();
                return downloadedPromise;
            })
        })

    }
}
