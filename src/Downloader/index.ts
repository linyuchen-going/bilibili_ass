import {Promise} from 'es6-promise'
import * as Api from '../Config/api'
import {DanmuApi, DanmuItem, DanmuPositionType} from '../Danmu'
import ASS from '../Danmu/ass';
import DanmuFilterConfig from "../Config/danmufilter"

interface DownloadAssSuccessCallback{
    (ass: string): void;
}

export default class Downloader{

    protected danmuApi = new DanmuApi();
    protected filterRules: Array<Api.UserDanmuFilterRule> = [];  // 用户的自定义过滤
    private danmuFilterConfig: DanmuFilterConfig = new DanmuFilterConfig();

    public setDanmuFilterConfig(danmuFilterConfig: DanmuFilterConfig){
        this.danmuFilterConfig = danmuFilterConfig;
    }

    danmuFilter(danmuItem: DanmuItem): boolean{ // true留下, false过滤掉
        let blockDanmus = this.filterRules.filter((rule: Api.UserDanmuFilterRule)=>{
            if(rule.type === Api.UserDanmuFilterRuleType.REGEX || rule.type === Api.UserDanmuFilterRuleType.TEXT){
                return danmuItem.isBlockContent(rule.type, rule.filter);
            }
            else if(rule.type === Api.UserDanmuFilterRuleType.USER){
                return danmuItem.isBlockSender(rule.filter);
            }
            return false;
        });
        if (this.danmuFilterConfig.configData.blockColor && danmuItem.isBlockColor()){
            return false;
        }
        else if (this.danmuFilterConfig.configData.blockBottom && danmuItem.isBlockPositionType(DanmuPositionType.BOTTOM)){
            return false;
        }
        else if (this.danmuFilterConfig.configData.blockTop && danmuItem.isBlockPositionType(DanmuPositionType.TOP)){
            return false;
        }

        return blockDanmus.length <= 0;

    }
    download(danmuId: string): Promise<string>{
        return new Promise((successCallback: DownloadAssSuccessCallback)=> {
            this.danmuApi.getDanmuXml(danmuId)
                .then((xmlDoc: Document) => {
                    let danmus = this.danmuApi.xmlToDanmus(xmlDoc);
                    let ass = new ASS();
                    danmus.forEach((i) => {
                        if (this.danmuFilter(i)) {
                            ass.addDanmuItem(i);
                        }
                    });
                    successCallback(ass.toString());
                })
        })
    }
}