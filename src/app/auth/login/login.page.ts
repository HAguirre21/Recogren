import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonInput,
  IonCard,
  IonItem,
  IonButton,
  NavController,
  LoadingController,
  IonLabel,
  AlertController, IonImg, IonButtons, IonSkeletonText, IonText } from '@ionic/angular/standalone';
import { AuthService } from 'src/service/Auth/auth-service';
import { Alerts } from 'src/service/alerts/alerts';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonText, IonImg, 
    IonButton,
    IonItem,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonInput,
    ReactiveFormsModule,
  ],
})
export class LoginPage implements OnInit {
  constructor() {}

  private loadingController = inject(LoadingController);
  private Nav = inject(NavController);
  private authService = inject(AuthService);
  private alertController = inject(AlertController);
  loginForm!: FormGroup;
  private Alerts = inject(Alerts);

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }



  async login() {
    if (this.loginForm.invalid) return this.Alerts.DataVacia();

    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
    });
    await loading.present();

    try {
      const formValue = this.loginForm.value;
      const isAuthenticated = await this.authService.login(formValue);
      if (isAuthenticated) {
        this.Nav.navigateRoot('/home-conductor');
        await loading.dismiss();
      } else {
        this.Alerts.DataIncorreta();
        await loading.dismiss();
      }
    } catch (error) {
      console.error('Error during login:', error);
      this.Alerts.DataIncorreta();
    }
  }

  async goRegister() {
    await this.Alerts.Loading();
    this.Nav.navigateForward('/register');
        

  }
}
