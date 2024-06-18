import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment.prod';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private _tagsHistory: string[] = [];
  public gifList: Gif[] = [];

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();

    if (this._tagsHistory.includes(tag)) {
      // Nuevo arreglo con los tags diferentes (sin duplicados)
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag);
    }

    //Inserto el tag del usuario
    this._tagsHistory.unshift(tag);

    //Evitar que el arreglo contenga mas de 10 tags
    this._tagsHistory = this._tagsHistory.splice(0, 10);
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    //Si no hay historial, detenemos la ejecucion
    if (!localStorage.getItem('history')) return;

    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);

    //Si el historial es igual a 0, detenemos la ejecucion
    if (this._tagsHistory.length === 0) return;

    this.searchTag(this._tagsHistory[0]);
  }

  public searchTag(tag: string): void {
    // Validar input
    if (tag.length === 0) return;

    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', environment.GIPHY_API_KEY)
      .set('q', tag)
      .set('limit', '10');

    this.http
      .get<SearchResponse>(environment.GIPHY_API_URL, { params })
      .subscribe((resp) => {
        this.gifList = resp.data;
      });
  }
}
