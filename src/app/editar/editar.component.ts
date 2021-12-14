import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss'],
})
export class EditarComponent implements OnInit {
  @Input() key:string;
  @Input() title:string;
  @Input() description:string;
  tituloInput=new FormControl('',Validators.required);
  descripcionInput=new FormControl('',Validators.required);
  

  constructor(private modalCtrl:ModalController) { }

  ngOnInit() {}

  cerrarModal(){
    this.modalCtrl.dismiss(null,'cancelado');

  }

  /**
   * Generamos una nueva nota y cuando el modal se cierre editamos la nota ya creada
   */
  editar(){
    const newNote=({
      key:this.key,
      title : this.tituloInput.value,
      description: this.descripcionInput.value,

    });
    this.modalCtrl.dismiss(newNote,' actualizado');
  }
}
