import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore, docChanges } from '@angular/fire/firestore';

import Swal from 'sweetalert2';

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
  dateBalance:any;
  totalBalance: any;
  currYear: any;
  mybill: any;
  specificBill:any;
  deleteCollection: any = []
  deleteData: any;

  constructor(
    private location: Location,
    private afstore : AngularFirestore
  ) { }

  ngOnInit() {
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    this.Date = monthNames[(new Date().getMonth())]+new Date().getFullYear().toString();
    console.log(this.Date)

    this.paymentMonth = monthNames[(new Date().getMonth())].toString();
    this.currYear = new Date().getFullYear().toString();


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

  submit(){

    try{

      const totalBalance = this.totalBalance;
      const dateBalance = this.dateBalance;
      const paymentMonth = this.paymentMonth;

      const currDate = this.paymentMonth+ this.currYear

      this.afstore.doc(`bill/${currDate}`).valueChanges().subscribe(data=> {
        this.mybill = data;
        try{

          this.specificBill = this.mybill.bill;

        } catch (error) {

          Swal.fire('Updating Balance Failed!','Please Check Balance Change For Month and Try Again!','error')
          return;

        }



    })

    this.afstore.collection('bill').ref.where('month','!=','0').get().then(snapshot=> {
      if (snapshot.empty){
        return;
      }
      
        snapshot.forEach(doc=> {
          this.deleteData = doc.data();
          this.deleteCollection.push(this.deleteData)
        })
      
    }).then(resp=> {
      this.deleteColl(this.deleteCollection)

      this.afstore.doc(`bill/${currDate}`).set({
        bill: totalBalance,
        month:currDate,
        dateChange: dateBalance
      })

      this.afstore.doc(`totalBill/0`).update({
        totalBill: totalBalance,
        month: currDate
      }).then (resp=> {

        Swal.fire('Process Successful','Balance Has Been Updated','success')
        this.dateBalance = "";
        this.totalBalance = "";

      })



    },error=>{
      Swal.fire('Process Unsuccessful','Please Check and try Again','error')
    })





  } catch (error){
    Swal.fire('Updating Balance Failed!','Please Check and Try Again!','error')
  }

}


deleteColl(data){
  console.log(data)

  for (let i = 0; i<data.length; i++){
    this.afstore.doc(`bill/${data[i].month}`).delete();
  }

}

}
