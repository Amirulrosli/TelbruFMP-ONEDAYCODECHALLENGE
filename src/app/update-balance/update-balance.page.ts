import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-update-balance',
  templateUrl: './update-balance.page.html',
  styleUrls: ['./update-balance.page.scss'],
})
export class UpdateBalancePage implements OnInit {
  Date: any;
  bill: any;
  totalbill: any = 0;
  paymentMonth: any;
  longMonth: any;

  constructor(
    private location: Location,
    private afstore : AngularFirestore
  ) { }

  ngOnInit() {
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    this.Date = monthNames[(new Date().getMonth())]+new Date().getFullYear().toString();
    console.log(this.Date)

    this.paymentMonth = monthNames[(new Date().getMonth())].toString();

    this.afstore.doc(`totalBill/0`).valueChanges().subscribe(data=> {
      this.bill = data;


      try {

        this.totalbill = this.bill.totalBill;
        this.longMonth = this.bill.month;
        this.monthly(this.totalbill)

      } catch (error) {
        this.totalbill = 0;
        this.afstore.doc(`totalBill/0`).set({
          totalBill: this.totalbill,
          month: this.Date
        }).then(resp=> {
          this.monthly(this.totalbill)
        })

     
      }
      
    
    })

  }

  monthly(allBill){
    
    
    const monthly = this.afstore.firestore.doc(`bill/${this.Date}`).get()
    .then(doc=> {
      if (doc.exists){
        return;
      } else {
        var bill = 59;
        this.afstore.doc(`bill/${this.Date}`).set({
          bill,
          month: this.Date
        })

        const currentBill = parseInt(allBill);
        console.log(currentBill)
        
        const totalBill = currentBill + bill;
        const value = 0;

        this.afstore.doc(`totalBill/${value}`).update({
          totalBill
        })

        
      }
    })

  }

  Back(){
    this.location.back()
  }

}
