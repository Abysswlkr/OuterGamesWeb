import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Videojuego } from './interfaces/videojuego';
import { VideojuegosService } from './services/videojuegos.service';
import { FormBuilder } from '@angular/forms';

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {


  constructor() {}

  ngOnInit() {
    
  }
  
  title = 'outergamesweb.client';
}
