import { Component, OnInit } from '@angular/core';
import { VideojuegosService } from '../../services/videojuegos.service';
import { Videojuego } from '../../interfaces/videojuego';
import { Pedido } from '../../interfaces/pedidos';
import { Transaccion } from '../../interfaces/transacciones';
import { Router } from '@angular/router';

@Component({
  selector: 'app-videogames',
  templateUrl: './videogames.component.html',
  styleUrl: './videogames.component.css'
})
export class VideogamesComponent implements OnInit{
  //Toast
  show = false;

  public videojuegos: Videojuego[] = []; 
  public videojuego!: Videojuego | null; 
  public videojuegosFilterGenre: Videojuego[] | null = [];
  public videojuegosFilterPlatform: Videojuego[] | null = [];
  public videojuegosFilterName: Videojuego[] | null = [];
  public videojuegosFilterPrice: Videojuego[] | null = [];
  public errorMessage!: string;

  //Genre filter
  generos: string[] = [
    'Acción', 'Aventura', 'Rol (RPG)', 'Estrategia', 'Simulación',
    'Deportes', 'Carreras', 'Puzzle', 'Plataformas', 'Terror',
    'Disparos en primera persona (FPS)', 'Disparos en tercera persona (TPS)', 
    'Lucha', 'Música y Ritmo', 'Educativos'
  ];

  //Platform filter
  selectedPlatform: string = '';
  plataformas: string[] = [
    'PC', 'PS4', 'PS5', 'Xbox One', 'Xbox Series X', 
    'Nintendo Switch', 'iOS', 'Android', 'VR', 'Mac'
  ];

  //Search name Filter
  searchTerm: string = '';

  //Price filter
  minPrice: number = 0;
  maxPrice: number = 0;

  //error
  error = false;



  
  //Order
  public pedido!: Pedido | null;

  //Payment
  amount!: number;
  response: any;

  public newTransaction: Transaccion = {
    idtransaccion: 0,
    idpedido: 2,
    fechaTransaccion: new Date().toISOString(),
    montoTransaccion: 0,
    estadoTransaccion: 'Realizada'
  };

  //Remember to take the methods before split the modules
  constructor(private videojuegoService: VideojuegosService, 
              private router: Router,
              ) {
  }

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

  getVideojuegoById(id: number) {
    this.videojuegoService.getVideojuegosById(id).subscribe(
      (videojuego) => {
        this.router.navigate(['/videogame', videojuego.idvideojuego], { state: { data: videojuego } });
        this.errorMessage = '';
        console.log(videojuego);
      },
      (err) => {
        console.error(err)
        this.errorMessage = 'No hay videojuego con esa id';
        this.videojuego = null;
      }
    )
  }

  getVideojuegosByGenre(event: Event) {
    const target = event.target as HTMLSelectElement;
    const genre = target.value;

    if (genre === '') {
      this.getAllVideojuegos();
    } else {
      this.videojuegoService.getVideojuegosByGenre(genre).subscribe(
        (videojuegos) => {
          this.videojuegos = videojuegos;
          this.errorMessage = '';
        },
        (err) => {
          console.error(err)
          this.errorMessage = 'No se encontraron videojuegos con el género proporcionado.';
          this.videojuegos = [];
        }
      )
    }
  }

  getVideojuegosByPlatform(event: Event) {
    const target = event.target as HTMLSelectElement;
    const plataforma = target.value;

    if (plataforma === '') {
      this.getAllVideojuegos();
    } else {
      this.videojuegoService.getVideojuegosByPlatform(plataforma).subscribe(
        (videojuegos) => {
          this.videojuegos = videojuegos;
          this.errorMessage = '';
        },
        (err) => {
          console.error(err);
          this.errorMessage = 'No se encontraron videojuegos para la plataforma proporcionada.';
          this.videojuegos = [];
        }
      );
    }
  }

  getVideojuegosByName() {
    this.videojuegos = [];
    if (this.searchTerm === '') {
      this.getAllVideojuegos()
    } else {
      this.videojuegoService.getVideojuegosByName(this.searchTerm).subscribe(
        (videojuegos) => {
          if (videojuegos && videojuegos.length > 0) {
            this.videojuegos = videojuegos;
            this.errorMessage = '';
            this.error = false;
          } else {
            this.errorMessage = 'No se encontraron videojuegos para el nombre proporcionado.';
            this.error = true;
          }
        },
        (err) => {
          this.error = true;
          console.error(err);
          this.errorMessage = 'Ocurrió un error al buscar los videojuegos.';
        }
      );
    }
  }
  

  getVideogamesByPriceRange() {
    if (this.minPrice !== null || this.maxPrice !== null) {
      if (this.minPrice === null && this.maxPrice === null) {
        this.getAllVideojuegos();
      } else {
        this.videojuegoService.getVideojuegosByPriceRange(Number(this.minPrice), Number(this.maxPrice)).subscribe(
          (videojuegos) => {
            this.videojuegos = videojuegos;
            this.errorMessage = '';
          },
          (err) => {
            console.error(err);
            this.errorMessage = 'No se encontraron videojuegos dentro del rango de precios proporcionado.';
            this.videojuegos = [];
            this.error = true;
          }
        );
      }
    } else {
      // Manejar caso en el que los campos están vacíos
      this.getAllVideojuegos();
    }
  }

}
