package com.ecarlop.Notea;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;


//import com.capacitorjs.plugins.storage.storagePlugin;


public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstaceState){
        super.onCreate(savedInstaceState);

        //aqui los plugin no oficiales
        registerPlugin(GoogleAuth.class);
       
      // registrePlugin(SecureStoragePlugin.class);
        
        
    }
}
