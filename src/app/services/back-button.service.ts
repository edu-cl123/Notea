import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class BackButtonService {
  constructor(private platform:Platform) { }

  init(){
    this.platform.backButton.subscribeWithPriority(10,()=>{
      navigator['app'].exitApp();
    })
  }
  
}
