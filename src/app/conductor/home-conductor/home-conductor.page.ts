import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonText,
  IonIcon,
  IonImg,
  IonButton,
  IonMenuButton,
  IonMenu,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons/';
import { notifications } from 'ionicons/icons';
import { CargaDatos } from 'src/service/datos/cargar-datos';
import { Geolocation } from '@capacitor/geolocation';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import { Coordinate } from 'ol/coordinate';
import { Calles } from '../../../interfaces/calles';
@Component({
  selector: 'app-home-conductor',
  templateUrl: './home-conductor.page.html',
  styleUrls: ['./home-conductor.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonContent,
    IonHeader,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class HomeConductorPage implements OnInit {
  private map: Map | undefined;
  private datos = inject(CargaDatos);

  markerLayer: any;
  calleGuardada = '';
  data: Calles[] = [];

  constructor() {}

  async ngOnInit() {
    await this.loadMap();
  }

  async loadMap() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      const lat = coordinates.coords.latitude;
      const lng = coordinates.coords.longitude;

      this.map = new Map({
        target: 'mapId',
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat([lng, lat]),
          zoom: 15,
        }),
      });

      // Variable para guardar el string de la calle

      this.map.on('click', async (event) => {
        await this.obtenerYGuardarCalle(event.coordinate);
      });
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);

      this.map = new Map({
        target: 'mapId',
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat([-3.7026, 40.4165]),
          zoom: 15,
        }),
      });

      this.calleGuardada = '';
      this.map.on('click', async (event) => {
        await this.obtenerYGuardarCalle(event.coordinate);
      });
    }
  }

  async obtenerYGuardarCalle(coordinate: Coordinate) {
    try {
      const lonLat = toLonLat(coordinate);
      const [lng, lat] = lonLat;

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );

      const data = await response.json();

      if (data && data.address) {
        const calleString = this.crearStringCalle(data.address);
        this.guardarCalle(calleString, coordinate);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  crearStringCalle(address: {
    road: any;
    street: any;
    pedestrian: any;
    footway: any;
  }) {
    // Buscar calles con números
    const callesConNumeros = [
      address.road,
      address.street,
      address.pedestrian,
      address.footway,
    ].filter((nombre) => nombre && nombre.match(/\d+/));

    if (callesConNumeros.length > 0) {
      const calle = callesConNumeros[0];
      const numero = calle.match(/(\d+)/)[1];
      return `Calle ${numero}`;
    }

    // Si no encuentra número, buscar cualquier calle
    const cualquierCalle = address.road || address.street || address.pedestrian;
    if (cualquierCalle) {
      // Extraer número si existe en el nombre
      const match = cualquierCalle.match(/(\d+)/);
      if (match) {
        return `Calle ${match[1]}`;
      }
      return `Calle ${cualquierCalle}`;
    }

    return 'Calle no identificada';
  }

  guardarCalle(calleString: string, coordinate: Coordinate) {
    // Guardar en variable global
    this.calleGuardada = calleString;

    // También puedes guardar en localStorage si quieres persistencia
    localStorage.setItem('ultimaCalleCapturada', calleString);

    console.log('Calle guardada:', calleString);
    console.log(this.calleGuardada);

    // Mostrar en la interfaz
    this.mostrarCalleGuardada(calleString, coordinate);
  }

  mostrarCalleGuardada(calleString: any, coordinate: Coordinate) {
    let popup = document.getElementById('calle-guardada');

    if (!popup) {
      popup = document.createElement('div');
      popup.id = 'calle-guardada';
      popup.style.cssText = `
      position: absolute;
      background: white;
      padding: 15px;
      border: 3px solid #28a745;
      border-radius: 8px;
      box-shadow: 0 3px 15px rgba(0,0,0,0.2);
      z-index: 1000;
      font-family: Arial, sans-serif;
      text-align: center;
    `;
      const mapElement = document.getElementById('mapId');
      if (mapElement) {
        mapElement.appendChild(popup);
      }
    }
  }

  async buscar() {
    // Para buscar específicamente desde el servicio
    const callesEncontradas = await this.datos.buscarCallePorNombre(
      this.calleGuardada
    );
    console.log(callesEncontradas);
  }
}
