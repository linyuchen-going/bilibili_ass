
interface ApiResponse{
    readonly code: number;
    readonly message: string;
    result?: any;    
}

export const userDanmuFilterUrl = `https://api.bilibili.com/x/dm/filter/user?jsonp=jsonp`;  // 用户的弹幕屏蔽列表

export enum UserDanmuFilterRuleType{
    // 0：普通文本，1：正则表达式，2：屏蔽用户(filer为用户16进制id)
    TEXT, REGEX, USER
}

export interface UserDanmuFilterRule{
    type: UserDanmuFilterRuleType;
    filter: string;
}

export interface UserDanmuFilterResponse extends ApiResponse{
    data: {
        rule: Array<UserDanmuFilterRule>;
    };
}

export const danmuUrl = (danmu_id: string) => `https://comment.bilibili.com/${danmu_id}.xml`;

export const eplistUrl = (season_id:string) => `https://bangumi.bilibili.com/web_api/get_ep_list?season_id=${season_id}`;

export interface EpItem{
    episode_id: number;  // epid, 每一话的id
}

export interface EplistResponse extends ApiResponse{
    result: Array<EpItem>;
}

export const epDetailUrl = (ep_id: number) => `https://bangumi.bilibili.com/web_api/episode/${ep_id}.json`;


export interface EpDetailResponse extends ApiResponse{
    result: {
        season: {
            title: string;
        };
        currentEpisode: {
            danmaku: string;  // 弹幕id
            longTitle: string;  // 每一话的标题
            indexTitle: number;  // 第几话
        };
    }
}

