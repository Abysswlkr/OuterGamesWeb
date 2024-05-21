import { Component, OnInit } from '@angular/core';
import { Videojuego } from '../../interfaces/videojuego';
import { VideojuegosService } from '../../services/videojuegos.service';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrl: './management.component.css'
})
export class ManagementComponent implements OnInit {
  public videojuegos: Videojuego[] = []; 
  public errorMessage!: string;

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


  constructor(private videojuegoService: VideojuegosService) {}

  ngOnInit(): void {
    this.getAllVideojuegos();
  }

  getAllVideojuegos() {
    this.videojuegoService.getAllVideojuegos().subscribe(
      (videojuegos) => {
        this.videojuegos = videojuegos;
      },
      (err) => {
        console.error(err);
        this.errorMessage = 'Error al obtener la lista de videojuegos.';
        this.videojuegos = [];
      }
    );
  }

  createVideojuego(): void {
    this.videojuegoService.createVideojuego(this.newVideojuegoForm).subscribe(videojuego => {
      console.log('Videojuego creado:', videojuego);
    });
  }

  // editVideojuego and submitEdit are functions for edit videojuego
  editVideojuego(videojuego: Videojuego) {
    this.editVideojuegoForm = {...videojuego};
  }

  submitEdit() {
    this.videojuegoService.editVideojuego(this.editVideojuegoForm.idvideojuego, this.editVideojuegoForm).subscribe(
      (response) => {
        console.log('Videojuego actualizado con éxito', response);
      },
      (error) => {
        console.error('Error al actualizar el videojuego', error);
      }
    );
  }

  deleteVideojuego(idvideojuego: number) {
    this.videojuegoService.deleteVideojuego(idvideojuego).subscribe(
      (response) => {
        console.log('Videojuego eliminado con éxito');
        // Aquí puedes agregar más lógica, como actualizar la lista de videojuegos
      },
      (error) => {
        console.error('Error al eliminar el videojuego', error);
      }
    );
  }
}
