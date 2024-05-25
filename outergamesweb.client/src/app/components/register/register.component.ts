import { Component } from '@angular/core';
import { Usuario } from '../../interfaces/usuario';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  public usuario: Usuario = {
    idusuario: 0,
    nombre: '',
    correoElectronico: '',
    contrasena: '',
    direccionEnvio: ''
  }; 

  agreedToTerms: boolean = false;  
  repeatContrasena: string = '';

    //Alert
    showAlert: boolean = false;
    alertMessage: string = '';
    alertType: string = 'success';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    const form = document.querySelector('.needs-validation') as HTMLFormElement;
    if(!this.agreedToTerms) {
      alert('Debes aceptar los terminos y condiciones!');
      return;
    }
    if (this.usuario.contrasena !== this.repeatContrasena) {
      alert('Las contraseñas no coinciden!');
      return;
    }
    if( form.checkValidity() === false) {
      event?.preventDefault();
      event?.stopPropagation();
    }
    form.classList.add('was-validated');
    this.authService.register(this.usuario).subscribe(usuario => {
      console.log('Usuario creado:', usuario);
      this.alertMessage = 'Registro exitoso :)';
      this.alertType = 'success';
      this.showAlert = true;
      setTimeout(() => {
        this.showAlert = false;
      }, 5000);
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    }, error => {
      if (error.error && error.error.message) {
        console.error('Error en el registro:', error.error.message);
        this.alertMessage = error.error.message;
        this.alertType = 'danger';
        this.showAlert = true;
        setTimeout(() => {
          this.showAlert = false;
        }, 5000);
      } else {
        console.error('Error en el registro:', error);
        this.alertMessage = error;
        this.alertType = 'danger';
        this.showAlert = true;
        setTimeout(() => {
          this.showAlert = false;
        }, 5000);
      }
    });
  }
}
