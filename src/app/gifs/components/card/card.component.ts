import { Component, Input, OnInit } from '@angular/core';
import { Gif } from '../../interfaces/gifs.interfaces';

@Component({
  selector: 'gif-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent implements OnInit {
  @Input()
  public gif!: Gif;

  ngOnInit(): void {
    if (!this.gif) throw new Error('Gif property is required');
  }

  async downloadGif(url: string) {
    try {
      const response = await fetch(url, { mode: 'cors' });
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = this.getFileNameFromUrl(url);
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error al descargar el GIF:', error);
    }
  }

  private getFileNameFromUrl(url: string): string {
    const fileName = url.split('/').pop();
    return fileName ? fileName.split('?')[0] : 'download.gif';
  }
}
