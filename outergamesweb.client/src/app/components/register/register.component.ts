import { Component } from '@angular/core';
import { Usuario } from '../../interfaces/usuario';
import { AuthService } from '../../services/auth.service';


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

  constructor(private authService: AuthService) {}

  register() {
    this.authService.register(this.usuario).subscribe(usuario => {
      console.log('Usuario creado:', usuario);
    })
  }
}
