
import DanmuFilterConfig from "../../../Config/danmufilter";

export interface DownloadCallback{
    ():void;
}

export default interface CommonDownloader{
    start(danmuFilterConfig: DanmuFilterConfig, startCallback?: DownloadCallback, completeCallback?: DownloadCallback): void;
}