import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials = {
    correoElectronico: '',
    contrasena: ''
  }

  //Alert
  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: string = 'success';

  constructor(private authService: AuthService) {}

  login() {
    const form = document.querySelector('.needs-validation') as HTMLFormElement;
    if( form.checkValidity() === false) {
      event?.preventDefault();
      event?.stopPropagation();
    }
    form.classList.add('was-validated');
    this.alertMessage = 'Sesión iniciada, bienvenido!';
    this.alertType = 'info';
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
    setTimeout(() => {
      this.authService.login(this.credentials);
    }, 2000);
    console.log('Sesión iniciada con éxito!')
  }
}
