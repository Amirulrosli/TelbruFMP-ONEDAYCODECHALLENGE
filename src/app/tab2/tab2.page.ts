import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  paymentMonth: any;
  topupDesc: any;
  totalPayment: any;
  Length: any;
  datePayment: any;
  Date: any;
  value: any;
  totalBill: any;
  bill: any;
  specificBill: any;

  constructor(
    private afstore: AngularFirestore,
    private router: Router,
    private alert: AlertController,
    private user: UserService
  ) {

    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    this.Date = monthNames[(new Date().getMonth())]+new Date().getFullYear().toString();
    console.log(this.Date)


  }


  ngOnInit(){
    this.getAllPosts().subscribe(data=> {
      this.Length = data.length+1000;
    })

    this.value = 0;


    this.afstore.doc(`totalBill/${this.value}`).valueChanges().subscribe(data=> {
      this.bill = data;
      this.totalBill = this.bill.totalBill;
    
    })

    this.afstore.doc(`bill/${this.Date}`).valueChanges().subscribe(data=> {
      this.bill = data;
      this.specificBill = this.bill.bill;
    

    })


  }


  getAllPosts (): Observable<any> {
    return this.afstore.collection<any>( "topup" ).valueChanges ();
  }


  topup(){

    console.log(this.paymentMonth)


    switch(this.paymentMonth){
      case '4': this.topupDesc = "15GB 7 Days for $4.00"; break;
      case '20': this.topupDesc = "120GB 30 Days for $20.00"; break;
      case '8': this.topupDesc = "35GB 14days for $8.00"; break;
      case '12': this.topupDesc="60GB 21 Days for $12.00";break;
      default: this.topupDesc = "No Topup";break;
    }

    console.log(this.topupDesc);

    this.totalPayment = this.paymentMonth;

  }

  submit(){
    try{

      const id = this.Length;
      const uid = localStorage.getItem('uid');
      const price = this.totalPayment;
      const description = this.topupDesc;
      const date = this.datePayment;
      const month = this.Date;
      const username = this.user.getUsername();
      console.log(id)

      this.afstore.doc(`topup/${id}`).set({

        id,
        uid,
        price,
        description,
        date,
        month,
        username
        

      })

      var bill = parseInt(this.specificBill) + parseInt(price);

      this.afstore.doc(`bill/${month}`).update({
        bill
      })

      var totalBill = parseInt(this.totalBill) + parseInt(price);
      const value = 0;

      this.afstore.doc(`totalBill/${value}`).update({
        totalBill
      }).then(resp=> {

        this.showAlert("Topup successful","Topup document has been created")
        this.datePayment=undefined;
        this.paymentMonth = undefined;
        this.topupDesc = "";
        this.totalPayment = undefined;
        this.router.navigate(['/tabs/tab1'])

      })

   

    } catch (error){

      this.showAlert("Topup Processing Failed","Please try again!")

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
