import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private _tagsHistory: string[] = [];

  constructor(private http: HttpClient) {}

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
  }

  public searchTag(tag: string): void {
    // Validar input
    if (tag.length === 0) return;

    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', environment.GIPHY_API_KEY)
      .set('q', tag)
      .set('limit', '10');

    this.http.get(environment.GIPHY_API_URL, { params }).subscribe((resp) => {
      console.log(resp);
    });
  }
}
