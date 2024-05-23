import { Component, OnInit, TemplateRef } from '@angular/core';
import { Videojuego } from '../../interfaces/videojuego';
import { VideojuegosService } from '../../services/videojuegos.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrl: './management.component.css'
})
export class ManagementComponent implements OnInit {
  public videojuegos: Videojuego[] = []; 
  public errorMessage!: string;
  public videojuego!: Videojuego | null;

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

  //Alert
  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: string = 'success';


  constructor(private videojuegoService: VideojuegosService, private modalService: BsModalService) {}

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

  submitEdit() {
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



  

  //TABLE


}
