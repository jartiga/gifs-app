import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

const GIPHY_API_KEY: string = 'yUqhWCnS1n2HAGCQosxzObR3Ta3bG7lx';
const GIPHY_URL: string = 'https://api.giphy.com/v1/gifs';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  public gifList: Gif[] = [];
  private _tagsHisotry: string[] = [];

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
   }

  get tagsHistory() {
    return [ ...this._tagsHisotry];
  }

  searchTag(tag: string):void {

    if (!tag) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
    .set('api_key',GIPHY_API_KEY)
    .set('q', tag)
    .set('limit','10');

    this.http.get<SearchResponse>(`${ GIPHY_URL }/search`, { params })
              .subscribe(resp => {
                this.gifList = resp.data;
              });
  }

  private organizeHistory(tag: string): void {
    tag = tag.toLowerCase();

    if (this._tagsHisotry.includes(tag)) {
      this._tagsHisotry = this._tagsHisotry.filter((oldTag)=> oldTag !== tag);
    }
    this._tagsHisotry.unshift(tag);
    this._tagsHisotry = this._tagsHisotry.splice(0,10);
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem("history", JSON.stringify(this._tagsHisotry));
  }

  private loadLocalStorage(): void {
    if (!localStorage.getItem('history')) return;

    this._tagsHisotry = JSON.parse(localStorage.getItem('history')!);
    this.searchTag(this._tagsHisotry[0]);

  }

}
