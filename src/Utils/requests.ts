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
    get(url: string, params?: any){
        return fetch(url, {credentials: 'include'})
    }
    checkApiRes(res: any): Promise<any>{
        return new Promise((successCallback: GeneralResCallback, failCallback: GeneralResCallback) => {
            if (res.code === this.SUCCESS_CODE) {
                successCallback(res);
            }
            else {
                failCallback(res);
            }
        });
    }
    apiGet(url: string, params: any): Promise<any>{
        return new Promise((successCallback: GeneralResCallback, failCallback: GeneralResCallback)=>{
            fetch(url, {credentials: 'include'}).then((res)=>{
                res.json().then(this.checkApiRes.bind(this)).then(successCallback,failCallback);
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
                res.json().then(this.checkApiRes).then(successCallback, failCallback)
            })
        })
    }
}

export default new Requests();