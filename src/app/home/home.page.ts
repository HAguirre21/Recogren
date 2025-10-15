import { Component, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonImg,
  IonTabButton,
  IonButton,
  IonSkeletonText,
  IonText,
  IonFooter,
  NavController,
} from '@ionic/angular/standalone';
import { Alerts } from '../../service/alerts/alerts';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonFooter,
    IonText,
    IonSkeletonText,
    IonButton,
    IonTabButton,
    IonImg,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
  ],
})
export class HomePage {
  private nav = inject(NavController);
  private Alerts = inject(Alerts);

  constructor() {}

  login() {
    this.Alerts.Loading();
    this.nav.navigateForward('/login');
  }
  registro() {
    this.Alerts.Loading();
    this.nav.navigateForward('/registro');
  }

  goCiudadano(){
        this.Alerts.Loading();
        this.nav.navigateForward('/inicio')

  }
}
