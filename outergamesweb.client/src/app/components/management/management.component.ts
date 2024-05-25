import { Component, OnInit, TemplateRef } from '@angular/core';
import { Videojuego } from '../../interfaces/videojuego';
import { VideojuegosService } from '../../services/videojuegos.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../interfaces/usuario';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrl: './management.component.css'
})
export class ManagementComponent implements OnInit {
  //Models
  public videojuegos: Videojuego[] = []; 
  public videojuego!: Videojuego | null;
  public usuarios: Usuario[] = [];
  public usuario!: Usuario | null;

  public errorMessage!: string;

  public newUsuario: Usuario = {
    idusuario: 0,
    nombre: '',
    correoElectronico: '',
    contrasena: '',
    direccionEnvio: ''
  }; 

  public editUsuarioForm: Usuario = {
    idusuario: 0,
    nombre: '',
    correoElectronico: '',
    contrasena: '',
    direccionEnvio: ''
  };

  public newVideojuegoForm: Videojuego = {
    idvideojuego: 0,
    nombreVideojuego: '',
    descripcion: '',
    precio: 0,
    cantidadStock: 0,
    plataforma: '',
    genero1: '',
    genero2: '',
    genero3: '',
    imagen: ''
  };
  

  public editVideojuegoForm: Videojuego = {
    idvideojuego: 0,
    nombreVideojuego: '',
    descripcion: '',
    precio: 0,
    cantidadStock: 0,
    plataforma: '',
    genero1: '',
    genero2: '',
    genero3: '',
    imagen: ''
  };

  //Modal
    modalRef?: BsModalRef;
    idDeleteProduct: number = 0;
    idDeleteUser: number = 0;

  //Alert
  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: string = 'success';

  //Filters
  filters = {
    nombre: '',
    genero: '',
    plataforma: '',
    id: ''
  };

  //List of Genres
  generos: string[] = [
    'Acción', 'Aventura', 'Rol (RPG)', 'Estrategia', 'Simulación',
    'Deportes', 'Carreras', 'Puzzle', 'Plataformas', 'Terror',
    'Disparos en primera persona (FPS)', 'Disparos en tercera persona (TPS)', 
    'Lucha', 'Música y Ritmo', 'Educativos'
  ];

  //List of plataforms
  plataformas: string[] = [
    'PC', 'PS4', 'PS5', 'Xbox One', 'Xbox Series X', 
    'Nintendo Switch', 'iOS', 'Android', 'VR', 'Mac'
  ];




  constructor(private videojuegoService: VideojuegosService, private usuariosService: UsuariosService, 
              private authService: AuthService, private modalService: BsModalService) {}

  ngOnInit(): void {
    this.getAllVideojuegos();
    this.getAllUsuarios();
  }

  getAllVideojuegos() {
    this.videojuegoService.getAllVideojuegos().subscribe(
      (videojuegos) => {
        this.videojuegos = videojuegos;
      },
      (err) => {
        console.error(err);
        this.errorMessage = 'Error al obtener la lista de videojuegos.';
        this.alertMessage = 'Error al obtener la lista de videjuegos';
        this.alertType = 'info';
        this.showAlert = true;
        setTimeout(() => {
          this.showAlert = false;
        }, 5000);
        this.videojuegos = [];
      }
    );
  }

  filteredVideojuegos() {
    return this.videojuegos.filter(videojuego => {
      const matchesNombre = videojuego.nombreVideojuego.toLowerCase().includes(this.filters.nombre.toLowerCase());
      const matchesGenero = (videojuego.genero1.toLowerCase().includes(this.filters.genero.toLowerCase()) ||
                             videojuego.genero2.toLowerCase().includes(this.filters.genero.toLowerCase()) ||
                             videojuego.genero3.toLowerCase().includes(this.filters.genero.toLowerCase()));
      const matchesPlataforma = videojuego.plataforma.toLowerCase().includes(this.filters.plataforma.toLowerCase());
      const matchesId = videojuego.idvideojuego.toString().includes(this.filters.id);

      return matchesNombre && matchesGenero && matchesPlataforma && matchesId;
    });
  }

  openModalcreateVideogame(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template);
  }

  createVideojuego(): void {
    this.videojuegoService.createVideojuego(this.newVideojuegoForm).subscribe(videojuego => {
      console.log('Videojuego creado:', videojuego);
      this.alertMessage = 'Videojuego creado con éxito';
      this.alertType = 'success';
      this.showAlert = true;
      setTimeout(() => {
        this.showAlert = false;
      }, 5000);
    });
    this.modalRef?.hide();
  }

  //Edit videogame and submit
  openModalEditVideogame(template: TemplateRef<void>, videojuego: Videojuego) {
    this.editVideojuegoForm = {...videojuego};
    this.modalRef = this.modalService.show(template);
  }

  submitEdit(event: Event) {
    event.preventDefault(); // Prevenir la acción por defecto del formulario
  
    const form = document.querySelector('.needs-validation') as HTMLFormElement;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      form.classList.add('was-validated');
      return; // Salir del método si el formulario no es válido
    }
  
    form.classList.add('was-validated'); // Añadir la clase 'was-validated' si es válido
  
    this.videojuegoService.editVideojuego(this.editVideojuegoForm.idvideojuego, this.editVideojuegoForm).subscribe(
      (response) => {
        console.log('Videojuego actualizado con éxito', response);
        this.alertMessage = 'Videojuego actualizado con éxito';
        this.alertType = 'info';
        this.showAlert = true;
        setTimeout(() => {
          this.showAlert = false;
        }, 5000);
      },
      (error) => {
        console.error('Error al actualizar el videojuego', error);
      }
    );
  
    this.modalRef?.hide();
  }

  //Delete videogame whit modal
  openModalDeleteVideogame(template: TemplateRef<void>, id: number ) {
    this.modalRef = this.modalService.show(template);
    this.idDeleteProduct = id;
  }

  deleteVideojuego() {
    this.videojuegoService.deleteVideojuego(this.idDeleteProduct).subscribe(
      (response) => {
        console.log('Videojuego eliminado con éxito', response);
        this.alertMessage = 'Videojuego eliminado con éxito';
        this.alertType = 'warning';
        this.showAlert = true;
        setTimeout(() => {
          this.showAlert = false;
        }, 5000);
      },
      (error) => {
        console.error('Error al eliminar el videojuego', error);
        this.alertMessage = 'Error al eliminar el videojuego';
        this.alertType = 'danger';
        this.showAlert = true;
        setTimeout(() => {
          this.showAlert = false;
        }, 5000);
      }
    );
    this.modalRef?.hide();
  }


  //Usuarios
  getAllUsuarios() {
    this.usuariosService.getAllUsuarios().subscribe(
      (usuarios) => {
        this.usuarios = usuarios;
      },
      (err) => {
        console.error(err);
        this.errorMessage = 'Error al obtener la lista de usuarios.';
        this.alertMessage = 'Error al obtener la lista de usuarios.';
        this.alertType = 'info';
        this.showAlert = true;
        setTimeout(() => {
          this.showAlert = false;
        }, 5000);
        this.usuarios = [];
      }
    )
  }

  filteredUsuarios() {
    return this.usuarios.filter(usuario => {
      const matchesNombre = usuario.nombre.toLowerCase().includes(this.filters.nombre.toLowerCase());
      const matchesId = usuario.idusuario.toString().includes(this.filters.id);

      return matchesNombre && matchesId;
    });
  }

  openModalcreateUser(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template);
  }

  createUser() {
    const form = document.querySelector('.needs-validation') as HTMLFormElement;
    if( form.checkValidity() === false) {
      event?.preventDefault();
      event?.stopPropagation();
    }
    form.classList.add('was-validated');
    this.authService.register(this.newUsuario).subscribe(usuario => {
      console.log('Usuario creado:', usuario);
      this.alertMessage = 'Registro de usuario exitoso';
      this.alertType = 'success';
      this.showAlert = true;
      setTimeout(() => {
        this.showAlert = false;
      }, 5000);
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
  
  openModalEditUser(template: TemplateRef<void>, usuario: Usuario) {
    this.editUsuarioForm = {...usuario};
    this.modalRef = this.modalService.show(template);
  }

  submitEditUser(event: Event) {
    event.preventDefault(); 
  
    const form = document.querySelector('.needs-validation') as HTMLFormElement;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      form.classList.add('was-validated');
      return;
    }
  
    form.classList.add('was-validated');
  
    this.usuariosService.editUser(this.editUsuarioForm.idusuario, this.editUsuarioForm).subscribe(
      (response) => {
        console.log('Usuario actualizado con éxito', response);
        this.alertMessage = 'Usuario actualizado con éxito';
        this.alertType = 'info';
        this.showAlert = true;
        setTimeout(() => {
          this.showAlert = false;
        }, 5000);
      },
      (error) => {
        console.error('Error al actualizar el Usuario', error);
      }
    );
  
    this.modalRef?.hide();
  }

  //Pedidos
  

  

}
