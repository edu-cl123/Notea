import { HttpHandler } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { async } from '@firebase/util';
import { AlertController, IonInfiniteScroll, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { EditarComponent } from '../editar/editar.component';
import { Note } from '../model/Note';
import { AuthService } from '../services/auth.service';
import { NoteService } from '../services/note.service';
import { ZoomComponent } from '../zoom/zoom.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild(IonInfiniteScroll) infinite: IonInfiniteScroll;

  public notas: Note[] = [];
  private miLoading: HTMLIonLoadingElement;

  constructor(private ns: NoteService,
    private loading: LoadingController,
    private toast: ToastController,
    private authS: AuthService,
    private router: Router,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController) { }

  async ionViewDidEnter() {
    await this.cargaNotas();
    
  }

  /**
   * @param nota Nota seleccionada de la lista
   * Creamos una alerta que dependiendo del botton procede a llamar al servicio o a no hacer nad
   */
  public async borra(nota: Note) {
    const alett = this.alertCtrl.create({
      header: 'Eliminar Nota',
      message: '¿Esta seguro de borrar la nota?',
      buttons: [{
        text: "Confirmar",
        role: 'ok',
        handler: async () => {
          await this.presentLoading();
          await this.ns.remove(nota.key);
          let i = this.notas.indexOf(nota, 0);
          if (i > -1) {
            this.notas.splice(i, 1);
          }
          await this.miLoading.dismiss();
        },

      }, {
        text: "Cancel",
        role: 'Error',
      }]
    });
    (await alett).present();
  }

  public async cargaNotas(event?) {
    if (this.infinite) {
      this.infinite.disabled = false;
    }
    if (!event) {
      await this.presentLoading();
    }
    this.notas = [];
    try {
      this.notas = await this.ns.getNotesByPage('algo').toPromise();
    } catch (err) {
      console.error(err);
      await this.presentToast("Error cargando datos", "danger");
    } finally {
      if (event) {
        event.target.complete();
      } else {
        await this.miLoading.dismiss();
      }
    }
  }
  public async logout() {
    await this.authS.logout();
    this.router.navigate(['']);
  }
  public async cargaInfinita($event) {
    console.log("CARGAND");
    let nuevasNotas = await this.ns.getNotesByPage().toPromise();
    if (nuevasNotas.length < 10) {
      $event.target.disabled = true;
    }
    this.notas = this.notas.concat(nuevasNotas);
    $event.target.complete();
  }

  async presentLoading() {
    this.miLoading = await this.loading.create({
      message: ''
    });
    await this.miLoading.present();
  }

  async presentToast(msg: string, clr: string) {
    const miToast = await this.toast.create({
      message: msg,
      duration: 2000,
      color: clr
    });
    miToast.present();
  }



  async modal(nota) {
    const modal = await this.modalCtrl.create({
      component: EditarComponent,
      componentProps: {
        key: nota.key,
        title: nota.title,
        description: nota.description
      }
    });
    await modal.present();

    const { data: newNote, role } = await modal.onWillDismiss();
    console.log(role);

    if (role == "cancelado") {
      const alert = this.alertCtrl.create({ header: 'Error', message: 'Error en la actualizacion', buttons: ['Confirmar'] });
      (await alert).present();

    } else {
      await this.ns.editar(newNote);
      const alert = this.alertCtrl.create({ header: 'Actualizado', message: 'Nota actualizada correctamente', buttons: ['Confirmar'] });
      this.cargaNotas();
      (await alert).present();
    }

  }

  buscar($event) {
    
    const query = $event.target.value.toLowerCase();
    console.log(query);
    if(query.length > 0){
      this.notas = this.notas.filter((note) => {
      return note.title.toLowerCase().indexOf(query.toLowerCase()) > -1;
    });
    }else{
      this.cargaNotas();
    }

  }

  async ver(nota){
    const modal = await this.modalCtrl.create({
      component: ZoomComponent,
      componentProps: {
        key: nota.key,
        title: nota.title,
        description: nota.description,
        latitud:nota.latitud,
        longitud:nota.longitud
      }
    });
    await modal.present();

  }




}