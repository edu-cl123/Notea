import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { User } from '@codetrix-studio/capacitor-google-auth/dist/esm/user';
import { AlertController, ModalController, Platform, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public userinfo: User;
  private isAndroid: boolean;
  private formado: boolean = false;


  usu = {
    email: "",
    password: ""
  }

  /**
   * 
   * @param data Evento recogido en el HTML para luego modificar las variables de usuario
   */
  readData(data) {
    if (data != "") {
      this.usu.password = data;
      console.log(this.usu.password);
    }

  }
  /**
   * 
   * @param value Evento recogido en el HTML para luego modificar las variables de usuario
   */
  setemail(value: string) {
    this.usu.email = value;
    this.formado = true;
    console.log(this.usu.email);
  }

  constructor(private platform: Platform,
    private authS: AuthService,
    private router: Router,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController) {
  }

  ngOnInit() {
    if (this.authS.isLogged()) {
      this.router.navigate(['private/tabs/tab1']);
    }
  }

  ionViewWillEnter() {
    if (this.authS.isLogged) {
      this.router.navigate(['private/tabs/tab1']);
    }


  }

  /**
   * Utilizamos la funcion del servicio para iniciar sesion con la cuenta almacenada en firebase
   */
  public async loginEmail() {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(this.usu.email) && this.usu.password != "") {
      console.log(this.usu.email);
      try {
        await this.authS.loginEmail(this.usu.email, this.usu.password);
        const toast = this.toastCtrl.create({
          header: "Sesion iniciada Correctamente",
          message: "Tu cuenta se ha iniciado correctamente",
          duration: 2000,

        });
        this.router.navigate(['private/tabs/tab1']);
        console.log("navego");
        (await toast).present();
      } catch (error) {

      }

    } else {
      const toast = this.toastCtrl.create({
        header: "Error al iniciar sesión",
        duration: 2000,
      });
      (await toast).present();
    }

  }


  /**
   * Utilizamos la funcion del servicio para añadir nuestra cuenta a firebase
   */
  public async registerEmail() {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    try {
      if (re.test(this.usu.email) && this.usu.password != "") {
        await this.authS.registerEmail(this.usu.email, this.usu.password);
        const toast = this.toastCtrl.create({
          header: "Registrado Correctamente",
          message: "Tu cuenta se ha registrado correctamente",
          duration: 2000,

        });
        (await toast).present();
      } else {
        const toast = this.toastCtrl.create({
          header: "Error",
          message: "Error al introducir los campos",
          duration: 2000,

        });
        (await toast).present();
      }
    } catch (error) {
      console.log(error);
    }

  }


  /**
   * Iniciamos sesion con google
   */
  public async signin() {
    try {
      await this.authS.login();
      this.router.navigate(['private/tabs/tab1']);

    } catch (err) {
      console.error(err);
    }
  }




}