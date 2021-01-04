import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  username: any;
  password: any;
  myUID:any;

  constructor(
    private router: Router,
    private afstore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private alert: AlertController
  ) { }

  ngOnInit() {
  }


  Login(){
    this.router.navigate([''])
  }

  async submit(){

    try{
      const username = this.username;
      const password = this.password;
      const res = await this.afAuth.createUserWithEmailAndPassword(username+'@gmail.com',password);
      this.myUID = res.user.uid;

      const email = this.username+"@gmail.com";

      this.afstore.doc(`user/${this.myUID}`).set({
        username,
        email,
        uid: res.user.uid

      }).then((data)=> {
        this.showAlert("Registration Completed","Please proceed to login");
        this.router.navigate([''])
      }).catch(err=> {
        this.showAlert("Registration Failed!",err)
      })

    } catch (error){

      this.showAlert("Registration Failed!",error)

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
