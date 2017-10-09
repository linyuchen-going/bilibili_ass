import 'whatwg-fetch';
import {Promise} from 'es6-promise'

export interface GeneralResCallback{
    (res: any): any
}

interface ApiRes{
    code: number,
    message: string
}

class Requests{
    SUCCESS_CODE = 0;
    get(url: string, params: any, cb: GeneralResCallback):void{
        fetch(url, {credentials: 'include'}).then(cb)
    }
    checkApiRes(res: any): Promise<any>{
        return new Promise((successCallback: GeneralResCallback, failCallback: GeneralResCallback) => {
            res.then((res: any)=>{
              if (res.code === this.SUCCESS_CODE) {
                    successCallback(res);
                }
                else {
                    failCallback(res);
                }
            });

        })
    }
    apiGet(url: string, params: any): Promise<any>{
        return new Promise((successCallback: GeneralResCallback, failCallback: GeneralResCallback)=>{
            fetch(url, {credentials: 'include'}).then((res)=>{
                this.checkApiRes(res.json()).then(successCallback).catch(failCallback);
            })
        })
    }
    apiPost(url: string, params: any): Promise<any>{
        return new Promise((successCallback: GeneralResCallback, failCallback: GeneralResCallback)=> {
            fetch(url,
                {
                    method: "POST",
                    mode: "no-cors",
                    credentials: 'include',
                    body: JSON.stringify(params),
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8'
                    }
                }
            ).then((res) => {
                this.checkApiRes(res.json()).then(successCallback).catch(failCallback);
            })
        })
    }
}

export default new Requests();