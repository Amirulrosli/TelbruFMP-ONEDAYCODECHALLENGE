import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username:any;
  password: any;
  uid: any;

  constructor(
    private router: Router,
    private afstore: AngularFirestore,
    private afauth: AngularFireAuth,
    private user: UserService,
    private alert: AlertController,
    private platform: Platform,
    private statusBar: StatusBar,

  ) { 

    platform.ready().then(()=>{
      this.statusBar.overlaysWebView(true);
      this.statusBar.backgroundColorByHexString('#26f1ff');
    })
  }

  ngOnInit() {

  
  }

  signup(){

    this.router.navigate(['/signup'])

  }

  async submit(){

    const username = this.username;
    const password = this.password;

    try{
      const res = await this.afauth.signInWithEmailAndPassword(username+"@gmail.com",password).then(res=> {
        if (res.user){
          this.user.setUser({
            username,
            uid: res.user.uid
          })
        }

        localStorage.setItem('uid',res.user.uid);

      }).then(data=> {

       

        this.showAlert("Login Success","Welcome")
        this.router.navigate(['/tabs/tab1'])
      })
      

    }catch (error){


      this.showAlert("Login Failed!",error)



    }

  }


  async showAlert(header:string, message:string){
    const alert = await this.alert.create({

      header,
      message,
      buttons: ["Ok"]

    })

    await alert.present()
    

  }

}
