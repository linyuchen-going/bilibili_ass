
interface DanmuFilterData{
    blockTop: boolean;
    blockBottom: boolean;
    blockColor: boolean;
}

export default class DanmuFilterConfig{

    public configData: DanmuFilterData = {
        blockTop: false,
        blockBottom: false,
        blockColor: false
    };
    key = "bilibili-ass-config";
    save(): void{
        let data = JSON.stringify(this.configData);
        localStorage.setItem(this.key, data);
    }
    read(): DanmuFilterData{
        let data = localStorage.getItem(this.key);
        if (data){
            let jsonData = JSON.parse(data);
            this.configData = jsonData;
            return <DanmuFilterData>jsonData;
        }
        else{
            return this.configData;
        }
    }

}