import { Injectable } from '@angular/core';
/*
import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
*/
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { User } from '@codetrix-studio/capacitor-google-auth/dist/esm/user';
import { LocalStorageService } from '../services/local-storage.service';
import { Platform, ToastController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: any;
  private isAndroid = false;

  constructor(private storage: LocalStorageService,
    private platform: Platform,
    private afauth: AngularFireAuth,
    private toastCtrl:ToastController) {
    //this.isAndroid=platform.is("android");
    //if(!this.isAndroid)
    // GoogleAuth.init(); //ojo, error aquí, debe estar platform ready -> lee la config clientid del meta de index.html
  }

  public async registerEmail(email: string, pass: string) {
    return await this.afauth.createUserWithEmailAndPassword(email, pass);
    
  }

  public async loadSession() {
    let user = await this.storage.getItem('user');
    if (user) {
      user = JSON.parse(user);
      this.user = user;
    }
  }

  public async login() {
    let user: User = await GoogleAuth.signIn();
    
    this.user = user;
    await this.keepSession();
  }

  public async loginEmail(email: string, pass: string) {
      let user = await this.afauth.signInWithEmailAndPassword(email, pass);
      this.user = user;
      await this.keepSession();
    // return await this.afauth.signInWithEmailAndPassword();
  }
  public async logout() {
    await GoogleAuth.signOut();
    await this.storage.removeItem('user');
    this.user = null;
  }
  public async keepSession() {
    await this.storage.setItem('user', JSON.stringify(this.user));
  }
  public isLogged(): boolean {
    if (this.user) return true; else return false;
  }


}