import * as React from 'react'
import DanmuFilterConfig from '../../../Config/danmufilter'
import CommonDownloader from './downloader';
let STYLE =  require('./view.css');

export interface CommonData{
    blockDanmuTop: boolean;
    blockDanmuBottom: boolean;
    blockColor: boolean;  // 是否屏蔽彩色弹幕
    userFilter: boolean;  // B站的自定义过滤(文本，正则，用户)
    showSettings: boolean;
}

export default class CommonView<D extends CommonData> extends React.Component<any, D>{
    filterConfig = new DanmuFilterConfig();
    downloader: CommonDownloader;
    constructor(downloader: CommonDownloader){
        super();
        this.downloader = downloader;
        this.filterConfig.read();
        this.state = {
            blockDanmuBottom: this.filterConfig.configData.blockBottom,
            blockDanmuTop: this.filterConfig.configData.blockTop,
            blockColor: this.filterConfig.configData.blockColor,
            userFilter: true,
            showSettings: false
        } as D;
    }

    componentDidUpdate(){
        this.filterConfig.configData.blockColor = this.state.blockColor;
        this.filterConfig.configData.blockTop = this.state.blockDanmuTop;
        this.filterConfig.configData.blockBottom = this.state.blockDanmuBottom;
        this.filterConfig.save()
    }

    startDownload(){
        this.downloader.start(this.filterConfig).then(
            ()=>{
                this.setState({showSettings: false});
            }
        );
    }

    renderSettings(){
        if(!this.state.showSettings){
            return;
        }
        return (
            <div>
                <div className={STYLE.mask}></div>
                <div className={STYLE.container}>
                    <div className={STYLE.filterItemTitle}>弹幕类型过滤</div>
                    <div className={STYLE.filterItems}>

                        <input type='checkbox' style={{display: 'none'}}/>
                        <label className={STYLE.filterItem}>屏蔽底部弹幕
                            <input type='checkbox'  defaultChecked={this.state.blockDanmuBottom} onChange={(e)=>{this.setState({blockDanmuBottom: e.target.checked})}} />
                        </label>
                        <label className={STYLE.filterItem}>屏蔽顶部弹幕
                            <input type='checkbox'  defaultChecked={this.state.blockDanmuTop} onChange={()=>{this.setState({blockDanmuTop: !this.state.blockDanmuTop})}}></input>
                        </label>
                        <label className={STYLE.filterItem}>屏蔽彩色弹幕
                            <input type='checkbox' defaultChecked={this.state.blockColor}  onChange={()=>this.setState({blockColor: !this.state.blockColor})}></input>
                        </label>
                    </div>
                    <div className={STYLE.btns}>
                        <a className={STYLE.confirm} onClick={this.startDownload.bind(this)}>确定</a>
                        <a className={STYLE.cancel} onClick={()=>this.setState({showSettings: false})}>取消</a>
                    </div>
                </div>
            </div>
        )
    }
}


// let v = document.createElement("div");
// document.body.appendChild(v);
// ReactDOM.render(<CommonView></CommonView>, v);
