import {Promise} from 'es6-promise'
import Requests, {GeneralResCallback} from '../Utils/requests';
import * as Api from '../Config/api'
import {UserDanmuFilterResponse} from "../Config/api";
interface UserFilterApiSuccessCallback{
    (res: Api.UserDanmuFilterResponse): void;
}

export interface DanmuXmlSuccessCallback{
    (res: Document): void;
}

export enum DanmuPositionType{
    // 普通（从右到左），顶部，底部，逆向，精准定位，高级弹幕
    NORMAL, TOP, BOTTOM, REVERSE, PRECISE, ADVANCED
}


export class DanmuItem{
    timePosition: number;
    positionType: DanmuPositionType;
    fontSize: number;
    color: number;
    sendTime: number;
    senderId: string;
    content: string;

    constructor(el: HTMLElement){
        let p = el.getAttribute("p");
        let attrs = p.split(","); // 一共8个参数
        if (attrs.length >= 8){
            this.timePosition = parseFloat(attrs[0]);
            let positionType = parseInt(attrs[1]);
            if(positionType <= 3){
                this.positionType = DanmuPositionType.NORMAL;
            }
            else if (positionType === 4){
                this.positionType = DanmuPositionType.BOTTOM;
            }
            else if (positionType === 5){
                this.positionType = DanmuPositionType.TOP;
            }

            else if (positionType === 6){
                this.positionType = DanmuPositionType.REVERSE;
            }
            else if (positionType === 7){
                this.positionType = DanmuPositionType.PRECISE;
            }
            else if (positionType === 8){
                this.positionType = DanmuPositionType.ADVANCED;
            }

            this.fontSize = parseInt(attrs[2]);
            this.color = parseInt(attrs[3]);
            this.sendTime = parseInt(attrs[4]);
            this.senderId = attrs[6];
            this.content = el.innerHTML;
        }
    }

    getClockTimePosition(timePosition: number = null): string{
        if(!timePosition){
            timePosition = this.timePosition;
        }
        let hour = Math.floor(timePosition / 3600);
        let minute = (timePosition - hour * 3600) / 60;
        minute = Math.floor(minute) ;
        let second = (timePosition - (hour * 3600 + minute * 60)).toFixed(2);
        return `${hour}:${minute}:${second}`;
    }

    // 是否符合弹幕类型屏蔽
    isBlockPositionType(type: DanmuPositionType): boolean{
        return this.positionType === type;
    }

    // 是否符合彩色弹幕屏蔽
    isBlockColor(): boolean{
        return this.color !== 0xffffff;
    }

    // 是否符合发送者屏蔽
    isBlockSender(senderId: string): boolean{
        return this.senderId === senderId;
    }

    // 是否符合内容屏蔽
    isBlockContent(filterType: Api.UserDanmuFilterRuleType, filterContent: string): boolean{
        switch(filterType){
            case Api.UserDanmuFilterRuleType.TEXT:{
                return this.content.indexOf(filterContent) !== -1;
            }
            case Api.UserDanmuFilterRuleType.REGEX:{
                return this.content.search(filterContent) !== -1;
            }
            default: {
                return false
            }
        }
    }
}

export class DanmuApi{
    getUserFilter(successCallback: UserFilterApiSuccessCallback, failCallback: GeneralResCallback): Promise<UserDanmuFilterResponse>{
        return new Promise((successCallback: UserFilterApiSuccessCallback, failCallback: GeneralResCallback)=>{
            Requests.apiGet(Api.userDanmuFilterUrl, null).then(successCallback).catch(failCallback)
        })
    }
    getDanmuXml(danmuId: string, successCallback: DanmuXmlSuccessCallback): void{
        Requests.get(Api.danmuUrl(danmuId), null, (data)=>{
            data.text().then((data: string)=>{
                let domParser = new DOMParser()
                let xmlDoc = domParser.parseFromString(data, "text/xml");
                successCallback(xmlDoc);
            })
        })
    }
    xmlToDanmus(xml: HTMLDocument): Array<DanmuItem>{
        let danmus: Array<DanmuItem> = [];
        let danmuElements = xml.getElementsByTagName("d");
        for(let i=0; i<danmuElements.length; i++){
            danmus.push(new DanmuItem(<HTMLElement>danmuElements[i]));
        }
        return danmus;
    }
}