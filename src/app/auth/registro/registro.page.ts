import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Form, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonButton, IonInput, LoadingController, NavController, IonImg, IonText } from '@ionic/angular/standalone';
import { Alerts } from 'src/service/alerts/alerts';   
import { AuthService } from 'src/service/Auth/auth-service';

@Component({
  selector: 'app-register',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonText, IonImg, FormsModule, ReactiveFormsModule, IonButton, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule,IonInput, FormsModule]
})
export class RegistroPage implements OnInit {
registerForm!: FormGroup;
private Alerts = inject(Alerts);
private loadingController = inject(LoadingController);
private AuthService = inject(AuthService);
private nav = inject(NavController);

  constructor() { }

  ngOnInit() {
  this.registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]) 
  });
  }

  async register() {
    if (this.registerForm.invalid) return this.Alerts.DataVacia() ;
      const loading = await this.loadingController.create({message: 'registrando...',});
    try{
      const formValue = this.registerForm.value;
      const success = await this.AuthService.register(formValue);

    await loading.present();
      if (success) {
        this.registerForm.reset();
        this.Alerts.Loading();
        this.nav.navigateRoot('/login');
      } else {
        this.Alerts.DataIncorreta();
      }
      await loading.dismiss();
      
    }catch(error){
      console.error('Error during registration:', error);
      this.Alerts.DataIncorreta();
      await loading.dismiss();
    }

  
  

}

}