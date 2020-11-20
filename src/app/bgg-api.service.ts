import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import xml2js from 'xml2js';  

import Config from '../../config.json';
import { BggBoardgame } from './bgg-objects';

@Injectable({
  providedIn: 'root'
})
export class BggApiService {
  public BGG_API_ENDPOINT = "https://www.boardgamegeek.com/xmlapi2";

  constructor(private _http: HttpClient) {}

  getBGGCollection(excludeExpansions: Boolean = true) {
    let url = `${this.BGG_API_ENDPOINT}/collection?username=${Config.bgg.username}`;
    if (excludeExpansions) { url += "&excludesubtype=boardgameexpansion"}
    
    return this._http.get(url, {
      responseType: 'text'
    });
  }

  parseBGGCollectionXML(data): Promise<BggBoardgame[]> {  
    return new Promise(resolve => {
      let k: string | number, arr = [];
      let parser = new xml2js.Parser({
        trim: true,  
        explicitArray: true  
      });  
      parser.parseString(data, function (err, result) {
        let items = result.items.item;
        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          let boardgame = new BggBoardgame(item);
          arr.push(boardgame);  
        }
        resolve(arr);  
      });  
    });  
  }
}
