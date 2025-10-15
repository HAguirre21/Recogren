import { Injectable } from '@angular/core';
import {CapacitorHttp, HttpResponse} from '@capacitor/core'
import { environment } from 'src/environments/environment';
import { Calles } from 'src/interfaces/calles';
@Injectable({
  providedIn: 'root'
})
export class CargaDatos {
  


  constructor() { }


// En tu servicio
// En tu servicio (datos.service.ts)
public async getDatos(): Promise<Calles[]> {
  const options = {
    url: environment.url + '/calles',
    method: 'GET',
  };
  const response: HttpResponse = await CapacitorHttp.get(options);    
  return response.data.data as Calles[];
}

// NUEVO MÉTODO para buscar por nombre
public async buscarCallePorNombre(nombre: string): Promise<Calles[]> {
  const options = {
    url: environment.url + '/calles',
    method: 'GET',
  };
  
  const response: HttpResponse = await CapacitorHttp.get(options);    
  const todasLasCalles = response.data.data as Calles[];
  
  // Filtrar por nombre (case insensitive)
  return todasLasCalles.filter(calle => 
    calle.nombre.toLowerCase().includes(nombre.toLowerCase())
  );
}
}
