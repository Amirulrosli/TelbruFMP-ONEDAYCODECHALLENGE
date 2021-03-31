import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore'
import { Router } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonSelect, ModalController, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { PicturePage } from '../picture/picture.page';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  @ViewChild('mySelect') selectRef: IonSelect;
  value:any
  bill:any;
  totalbill:any = 0;
  allPayment:any = [];
  Date:any;
  month: any;
  caret: boolean = false;
  currentBill: any;
  mybillData: any;
  billUsage: any = [];
  billArray:any;
  topupUsage:any = [];
  topupData: any;
  topupSub: any;
  topCaret: boolean = false;
  filterDate: any;
  myDate = new Date();
  data: any;

  constructor(private afstore: AngularFirestore,
    private router: Router,
    private platform: Platform,
    private datePipe: DatePipe,
    private modalCtrl: ModalController,
    private statusBar: StatusBar) {



      platform.ready().then(()=>{
        this.statusBar.overlaysWebView(true);
        this.statusBar.backgroundColorByHexString('#009da8');
      })


   

  }

  ngOnInit(){

    this.value = 0;

    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    this.Date = monthNames[(new Date().getMonth())]+new Date().getFullYear().toString();
    console.log(this.Date)
    this.afstore.doc(`bill/${this.Date}`).valueChanges().subscribe(data=> {
      this.currentBill = data;
      this.month = this.currentBill.month;

    })

    this.afstore.doc(`totalBill/${this.value}`).valueChanges().subscribe(data=> {
      this.bill = data;
      this.totalbill = this.bill.totalBill;
      this.monthly(this.totalbill)
    })

    this.getAllPosts().subscribe(data=> {
      this.allPayment = data;
      
      console.log(this.allPayment)
    })

   
    let transDate = this.datePipe.transform(this.myDate, 'yyyy-MM-DD');
    this.filterDate = transDate;

    this.billMonthly();
    this.topup();
  }


  monthly(allBill){
    
    
    const monthly = this.afstore.firestore.doc(`bill/${this.Date}`).get()
    .then(doc=> {
      if (doc.exists){
        return;
      } else {
        var bill = 49;
        this.afstore.doc(`bill/${this.Date}`).set({
          bill
        })
        
        const totalBill = allBill + bill;
        const value = 0;

        this.afstore.doc(`totalBill/${value}`).update({
          totalBill
        })

        
      }
    })

  }

  myCaret(){
    this.topCaret = !this.topCaret;
  }

  topup(){

    this.topupUsage = [];

    const top = this.afstore.collection('topup');
    const uid = localStorage.getItem('uid');
    const date = this.Date;

    this.topupSub= top.ref.where('month','==',date).get().then(snapshot=> {
      if (snapshot.empty){
        return;
      }

      snapshot.forEach(doc=> {
        this.topupData = doc.data();
        this.topupUsage.push(this.topupData)
      })
    })

  }



  async showModal(id){
    let modal = await this.modalCtrl.create({component: PicturePage,
      cssClass: 'share-css',
      componentProps: {
        image: id
      }
    });
    let me = this;
    modal.onDidDismiss().then((data) => {
      this.data = data['data'];
    });
    (await modal).present();
  }
  
  billMonthly(){
    this.billUsage = [];

    const payment = this.afstore.collection('bill');
    const uid = localStorage.getItem('uid');

    this.billArray= payment.ref.where('bill','>=',0).get().then(snapshot=> {
      if (snapshot.empty){
        return
      }

      snapshot.forEach(doc=> {
        this.mybillData = doc.data();
        this.billUsage.push(this.mybillData)
      })
    })

  }


  getAllPosts (): Observable<any> {
    return this.afstore.collection<any>( "payment",ref=> ref.orderBy("id","desc")).valueChanges();
  }

  payment(){

    this.router.navigate(['/payment'])

  }



  select(){
    this.caret = !this.caret;
    this.selectRef.open();
  }

  nextSelect(){
    this.caret = !this.caret;
  }

}
