import { Injectable, Inject } from "@nestjs/common";
import fsPromise from 'fs/promises';
import fs from 'fs';

@Injectable()
export class BotBaseService {
    private readonly folderUrl = '/dist/assets/';

    constructor(private readonly fileName: string, private readonly bot: any) {
        this.init()
    }
    getBot() {
       return this.bot;
    }
    async init() {
        const currentPath = process.cwd() + this.folderUrl + this.fileName;
        if (!fs.existsSync(currentPath)) {
            await fsPromise.writeFile(currentPath, JSON.stringify({}));
        }
    }

    async getUserStep(chatId: number) {
        const currentPath = process.cwd() + this.folderUrl;
        const result = (await fsPromise.readFile(currentPath + this.fileName)).toString();
        const parsedData = JSON.parse(result);
        return parsedData[chatId]
    }

    async setUserStep (chatId: number, step: string) {
        const currentPath = process.cwd() + this.folderUrl + this.fileName;
        
        const jsonString = (await fsPromise.readFile(currentPath)).toString();
        
        let objToUpdate = JSON.parse(jsonString);
        objToUpdate[chatId] = step;

        const updatedJsonString = JSON.stringify(objToUpdate, null, 2); 
        await fsPromise.writeFile(currentPath, updatedJsonString, 'utf8');
    }
    async sendMessage(chatId: number, message: string, markup?: any) {      
        await this.bot.telegram.sendMessage(chatId, message,
        {
            reply_markup: markup,
            parse_mode: "HTML"
        })
    }
}