import {DanmuItem, DanmuPositionType} from './index'
const SCREEN_W = 1920;
const SCREEN_H = 1080;
const SCRENN_LINES = 17;  // 屏幕最多显示多少行字幕
const CHAR_W = 32;  // 一个字的宽度
const CHAR_H = 64;  // 一个字的高度
const STAY_TIME = 12;  // 一行字幕在屏幕显示多少秒

// 需要加入UFT8 BOM
// String.fromCharCode(0xEF, 0xBB, 0xBF)
const ASS_HEADER = `[Script Info]
ScriptType: v4.00+
Collisions: Normal
PlayResX: ${SCREEN_W}
PlayResY: ${SCREEN_H}

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: DMDefalut, Microsoft YaHei, 64, &H00FFFFFF, &H00FFFFFF, &H00000000, &H00000000, 0, 0, 0, 0, 100, 100, 0.00, 0.00, 1, 1, 0, 2, 20, 20, 20, 0

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text

`

enum AssPositionType{
    SCROLL = 1,
    TOP = 8,
    BOTTOM = 2,
    OTHER = 0
}

// ass字幕类
export default class ASS{
    private scriptContent = ASS_HEADER;
    private danmus: Array<DanmuItem> = []; // 全部弹幕
    private screenDanmus: Array<DanmuItem> = [];  // 当前屏幕显示的弹幕

    public addDanmuItem(danmuItem: DanmuItem): void{
        this.danmus.push(danmuItem);
    }

    // 获取新弹幕的填充位置（屏幕第几行）
    private getNewDanmuScreenLine(newDanmu: DanmuItem): number{
        let overTimeDanmuIndex = 0;  // 没有超时的弹幕, 默认替换第一条
        if(this.screenDanmus.length >= SCRENN_LINES){ // 当前屏幕弹幕池满了，用新的弹幕替换掉已经显示超过了2秒时间的弹幕
            let overTimeDanmu = this.screenDanmus.filter((currentDanmu: DanmuItem)=>{
                return newDanmu.timePosition - currentDanmu.timePosition > 2;
            })

            if (overTimeDanmu.length > 0){ // 有超时的弹幕，把它替换掉
                overTimeDanmuIndex = this.screenDanmus.indexOf(overTimeDanmu[0])
            }
            this.screenDanmus.splice(overTimeDanmuIndex, 1, newDanmu);
        }
        else{
            overTimeDanmuIndex = this.screenDanmus.length;
            this.screenDanmus.push(newDanmu);
        }
        return overTimeDanmuIndex;
    }

    public toString(): string{
        let startScreenY = CHAR_H;
        this.danmus.sort((a: DanmuItem, b: DanmuItem)=>a.timePosition - b.timePosition)
        this.danmus.forEach((newDanmu:DanmuItem, index:number)=>{
            this.addAssScript(newDanmu, this.getNewDanmuScreenLine(newDanmu) * CHAR_H)
        })
        return this.scriptContent;
    }

    private addAssScript(danmuItem: DanmuItem, screenY: number): void{

        let contentLength = danmuItem.content.length;
        let startX = SCREEN_W + (contentLength / 2 * CHAR_W);
        let assPositionType: AssPositionType;
        let color = Number(danmuItem.color).toString(16)
        let startTime = danmuItem.getClockTimePosition();
        let endTime = danmuItem.getClockTimePosition(danmuItem.timePosition + STAY_TIME);
        switch(danmuItem.positionType){
            case DanmuPositionType.NORMAL:{
                this.scriptContent += (`\nDialogue: 3,${startTime},${endTime},`+
                `DMDefalut,,0000,0000,0000,,{\\move(${startX}, ${screenY}, ${-startX}, ${screenY})\\c&H${color}}${danmuItem.content}`)
                return;
            };
            case DanmuPositionType.TOP:{
                assPositionType = AssPositionType.TOP;
            }break;
            case DanmuPositionType.BOTTOM:{
                assPositionType = AssPositionType.BOTTOM;
            }break;
            default:{
                assPositionType = AssPositionType.OTHER;
            }
        }

        endTime = danmuItem.getClockTimePosition(danmuItem.timePosition + STAY_TIME / 2); // 定点弹幕显示时间减半
        this.scriptContent += (`\nDialogue: 3,${startTime},${endTime},` +
        `DMDefalut,,0000,0000,0000,,{\\c&H${color}\\an${assPositionType}}${danmuItem.content}`)
    }
}