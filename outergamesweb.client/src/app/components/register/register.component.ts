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

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    if(!this.agreedToTerms) {
      alert('Debes aceptar los terminos y condiciones!');
      return;
    }
    if (this.usuario.contrasena !== this.repeatContrasena) {
      alert('Las contraseñas no coinciden!');
      return;
    }
    this.authService.register(this.usuario).subscribe(usuario => {
      console.log('Usuario creado:', usuario);
      this.router.navigate(['/login']);
    }, error => {
      console.error('Error en el registro', error);
    });
  }
}
