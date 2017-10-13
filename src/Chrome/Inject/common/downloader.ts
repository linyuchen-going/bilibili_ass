
import DanmuFilterConfig from "../../../Config/danmufilter";

export interface DownloadCompleteCallback{
    ():void;
}

export default interface CommonDownloader{
    start(danmuFilterConfig: DanmuFilterConfig, startCallback?: ()=>void):Promise<void>;
}