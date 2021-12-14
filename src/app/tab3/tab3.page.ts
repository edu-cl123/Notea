import { Component, ViewChild } from '@angular/core';
import { Camera, CameraResultType, CameraSource, ImageOptions, Photo } from '@capacitor/camera';
import { IonToggle } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '../services/local-storage.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  @ViewChild('mitoogle',{static:false}) mitoogle:IonToggle;
  public image:any;

  constructor(private traductor:TranslateService,
    private storage:LocalStorageService) {
    /*traductor.setDefaultLang("en");
    traductor.use("es");
    traductor.get("TAKE A PICTURE").toPromise().then(data=>{
      console.log(data);
    })*/

  }

  ionViewDidEnter(){
    const lang=this.traductor.getDefaultLang();
    if(lang=='es'){
      this.mitoogle.checked=false;
    }else{
      this.mitoogle.checked=true;
    }
  }
  public async cambiaIdioma(event:any){
    console.log(event)
    if(event && event.detail && event.detail.checked){
      await this.storage.setItem('lang',JSON.stringify({lang:'en'}));
      this.traductor.use('en');
    }else{
      await this.storage.setItem('lang',JSON.stringify({lang:'es'}));
      this.traductor.use('es');
    }
  }
  public async hazFoto(){
    let options:ImageOptions={
      resultType:CameraResultType.Uri,
      allowEditing:false,
      quality:90,
      source:CameraSource.Camera
    }
    let result:Photo = await Camera.getPhoto(options);
    this.image=result.webPath;

  }
}