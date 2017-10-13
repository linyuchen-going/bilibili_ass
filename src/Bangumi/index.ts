import Requests, {GeneralResCallback} from '../Utils/requests';
import * as Api from '../Config/api'
import {Promise} from 'es6-promise'

interface EpListApiSuceessCallback{
    (res: Api.EpItem[]):void
}
interface EpDetailSuccessCallback{
    (res: Api.EpDetailResponse): void
}

export default class Bangumi{

    // 获取季番号
    getSeasonId(): string{
        let result = location.href.match(/anime\/(\d+)/);
        return result[1];
    }
    getEpList(seasonId: string): Promise<Array<Api.EpItem>>{
        return new Promise<Array<Api.EpItem>>((successCallback: EpListApiSuceessCallback, failCallback: GeneralResCallback)=>{
            Requests.apiGet(Api.eplistUrl(seasonId), null)
                .then(
                    (res:Api.EplistResponse)=>{
                        successCallback(res.result);
                    }
                    , failCallback
                );
        });

    }
    getEpDetail(epId: number): Promise<Api.EpDetailResponse>{
        return new Promise(( successCallback: EpDetailSuccessCallback, failCallback: GeneralResCallback)=>{
            Requests.apiGet(Api.epDetailUrl(epId), null).then(successCallback, failCallback);
        })
    }
}