import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private _tagsHistory: string[] = [];

  constructor() {}

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

    console.log(this._tagsHistory);
  }
}
