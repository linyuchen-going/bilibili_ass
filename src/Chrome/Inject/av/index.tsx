
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import InjectView, {CommonData} from '../common/view';
import Downloader from './downloader'


class AvDownloadView extends InjectView<CommonData>{

    constructor(){
        super(new Downloader());
    }
    render(){
        return (
            <label>
                <a onClick={()=>this.setState({showSettings: true})}>
                    下载
                </a>
                {
                    this.renderSettings()
                }
            </label>
        )
    }
}

let v = document.createElement("label");
let btnContainer = document.getElementsByClassName("b-icon-danmaku")[0].parentElement;
btnContainer.appendChild(v);
ReactDOM.render(<AvDownloadView></AvDownloadView>, v);
