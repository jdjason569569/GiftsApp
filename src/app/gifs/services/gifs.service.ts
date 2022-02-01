import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {Gif, SearchGifsResponse} from '../../gifs/interface/gifs.interface';

@Injectable({
  providedIn: 'root'    //Angular eleva a un nivel global en la aplicacion
})
export class GifsService {

  private apiKey: string = 'C7BEpOY9eJmsmuPC2V25i4lrRujuRvhN'
  private _historial: string[] = [];
  public resultados: Gif[] = [];
  private servicioUrl : string = 'https://api.giphy.com/v1/gifs';

  constructor(private http:HttpClient) {  // El constructor se va a instanciar solo una vez, no importa que lo llamemos de otros componentes
        //DOS FORMAS

        //1
        this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
        this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];

        //2
        //if(localStorage.getItem('historial')){
        //  this._historial = JSON.parse(localStorage.getItem('historial')!)
        //}
  }

  get historial(){
    return [...this._historial]; // Hace que no se modifique el arreglo original.  se regresa un nuevo arreglo
  }

  buscarGifs( query: string){

    query = query.trim().toLocaleLowerCase();

    if(!this._historial.includes(query)){
      this._historial.unshift(query);
      this._historial = this._historial.splice(0,10);
      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams().set('api_key', this.apiKey)
    .set('limit', '10').set('q', query);

    this.http.get<SearchGifsResponse>(`${ this.servicioUrl }/search`, {params: params})
    .subscribe((response) =>{
      console.log(response.data);
       this.resultados = response.data;
       localStorage.setItem('resultados', JSON.stringify(this.resultados));
    });
  }
}
