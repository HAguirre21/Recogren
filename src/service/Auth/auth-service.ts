import { Injectable } from '@angular/core';
import { CapacitorHttp} from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // Método para guardar datos
  private async setStorage(key: string, value: string): Promise<void> {
    await Preferences.set({
      key: key,
      value: value
    });
  }

  async login(formValue: {
    email: string;
    password: string;
  }): Promise<boolean> {
    try {
      const option = {
        url: environment.url2 + '/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: { email: formValue.email, password: formValue.password },
      };

      const response = await CapacitorHttp.request(option);

      if (response.status === 200 && response.data.access_token) {
        await this.setStorage('isLoggedIn', 'true');
        await this.setStorage('userEmail', formValue.email);
        await this.setStorage('token', response.data.access_token); // guarda el token
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  }

async register(formValue : { name: string; email: string; password: string }): Promise<boolean> {

    try {
      const option = {
        url: environment.url2 + '/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: { name: formValue.name, email: formValue.email, password: formValue.password },
      };

      const response = await CapacitorHttp.request(option);

      if (response.status === 201 && response.data.access_token) {
        await this.setStorage('isLoggedIn', 'true');        localStorage.setItem('userEmail', formValue.email);
        localStorage.setItem('token', response.data.access_token); 
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error during registration:', error);
      return false;
    }


}
}
