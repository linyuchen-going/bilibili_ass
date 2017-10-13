/*
对番剧列表页注入
* */
import {Promise} from 'es6-promise'
import * as Api from '../../../Config/api'
import Bangumi from '../../../Bangumi'
import Downloader from '../../../Downloader/index'
import DanmuFilterConfig from "../../../Config/danmufilter";
import CommonDownloader, {DownloadCompleteCallback} from '../common/downloader'

let FileSave = require("file-saver");
let ZipFile = require("jszip");


export default class EpListAssDownloader extends Downloader implements CommonDownloader{
    zipfile = new ZipFile();

    private downloadList(): Promise<void>{
        let bangumi = new Bangumi();
        let epName = document.getElementsByClassName("info-title")[0].getAttribute("title");
        let completeCount = 0;
        return new Promise((completeCallback: DownloadCompleteCallback)=> {
            bangumi.getEpList(bangumi.getSeasonId()) // 获取番剧视频列表
                .then((epList: Array<Api.EpItem>) => {
                    epList.forEach((epItem: Api.EpItem) => {
                        bangumi.getEpDetail(epItem.episode_id)  // 获取每个视频的弹幕id
                            .then((epDetail: Api.EpDetailResponse) => {
                                this.download(epDetail.result.currentEpisode.danmaku)  // 下载弹幕
                                    .then((assText) => { // 弹幕转成ass格式

                                        // 添加到zip包内
                                        let fileName = `${epDetail.result.season.title} ${epDetail.result.currentEpisode.indexTitle} ${epDetail.result.currentEpisode.longTitle}.ass`
                                        this.zipfile.file(fileName, assText);
                                        completeCount++;
                                        // console.log(`${fileName}下载完成, ${completeCount}/${epList.length - 1}`);
                                        if (completeCount >= epList.length) {
                                            completeCallback();
                                            // 浏览器下载zip包
                                            this.zipfile.generateAsync({type: "blob"})
                                                .then(function (content: Blob) {
                                                    FileSave.saveAs(content, `${epName}.zip`);
                                                });
                                        }
                                    })
                            })
                    });
                }
                , (res) => alert("获取番剧列表失败"));
        });
    }
    public start(danmuFilterConfig: DanmuFilterConfig, startCallback: ()=>void): Promise<void>{
        this.setDanmuFilterConfig(danmuFilterConfig);
        startCallback();
        return new Promise<void>((completeCallback: DownloadCompleteCallback): void=> {
            this.danmuApi.getUserFilter().then((res: Api.UserDanmuFilterResponse) => {
                this.filterRules = res.data.rule;
                this.downloadList().then(completeCallback);
            }, () => {
                this.downloadList().then(completeCallback)
            });
        })
    }
}
