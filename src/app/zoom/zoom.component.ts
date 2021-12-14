import { Component, Input, OnInit } from '@angular/core';
import { ModalController, Platform, ToastController } from '@ionic/angular';
import { TextZoom, SetOptions, GetResult } from "@capacitor/text-zoom";
import * as L from "leaflet";

@Component({
  selector: 'app-zoom',
  templateUrl: './zoom.component.html',
  styleUrls: ['./zoom.component.scss'],
})
export class ZoomComponent implements OnInit {
  @Input() key: string;
  @Input() title: string;
  @Input() description: string;
  @Input() latitud: number;
  @Input() longitud: number;
  map: L.Map;

  constructor(private modalCtrl: ModalController,
    private platfrom: Platform, private toastCtrl: ToastController) { }

  ionViewDidEnter() {
    this.map = L.map('map', {
      center: [this.latitud, this.longitud],
      zoom: 15,
      renderer: L.canvas()
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
      maxZoom: 18
    }).addTo(this.map);

    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);

    L.marker([this.latitud, this.longitud]).addTo(this.map)
    .bindPopup('Nota creada en este punto')
    .openPopup();
  }

  ngOnInit() {

  }

  cerrarModal() {
    this.modalCtrl.dismiss(null, 'cancelado');

  }
  
  /**
   * 
   * @param val Cantidad de zoom que le añadimos o reducimos
   */
  async zooming(val) {
    
    if (this.platfrom.is('android')) {
      TextZoom.get().then((val1: GetResult) => {
        var currentZoom = val1.value
        var options: SetOptions = {
          value: currentZoom + parseFloat(val)
        }
        TextZoom.set(options);
      })
    } else {
      const toast = this.toastCtrl.create({
        header: "Plugin disponible en movil",
        duration: 2000,

      });
      (await toast).present();
    }

  }

}
