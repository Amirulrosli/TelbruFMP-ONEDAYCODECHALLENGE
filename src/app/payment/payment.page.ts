import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { UserService } from '../user.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  value:any;
  bill: any;
  specificBill:any;
  mybill:any;
  totalbill:any;
  datePayment: any;
  totalPayment: any;
  paymentMonth: any;
  paymentLength: any;
  currMonth: any;
  currYear:any;
  currDate:String;
  storageDate: any;
  downloadURL: Observable<string>;
  percentage: any;
  snapshot: any;
  file: File;
  proof: any;
  Date: any;

  constructor(private location: Location,
    private afstore: AngularFirestore,
    private user: UserService,
    private alert: AlertController,
    private router: Router,
    private storage: AngularFireStorage
    ) { }

  ngOnInit() {

    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    this.Date = monthNames[(new Date().getMonth())]+new Date().getFullYear().toString();
    console.log(this.Date)

    this.paymentMonth = monthNames[(new Date().getMonth())].toString();

    this.storageDate = new Date()

    this.currMonth = (new Date().getMonth()+1).toString();
    this.currYear = new Date().getFullYear().toString();
 

    this.value = 0;


    this.afstore.doc(`totalBill/${this.value}`).valueChanges().subscribe(data=> {
      this.bill = data;
      this.totalbill = this.bill.totalBill;

    })

    this.getAllPosts().subscribe(data=> {
      this.paymentLength = data.length+1000;
    })
  }

  Back(){

    this.location.back();

  }

  getAllPosts (): Observable<any> {
    return this.afstore.collection<any>( "payment" ).valueChanges ();
  }

  submit(){

   


    console.log(this.paymentMonth)
    console.log(this.datePayment)
    console.log(this.totalPayment)
    console.log(this.paymentLength)

    try{

      if (this.proof==undefined || this.proof == ""){
          Swal.fire('Process Failed','Please Enter your proof of evidence!','error')
          return;
      }


      return new Promise (async (resolve)=> {

      this.currDate = this.paymentMonth+this.currYear
      console.log(this.currDate)

      this.afstore.doc(`bill/${this.currDate}`).valueChanges().subscribe(data=> {
        this.mybill = data;
        try{

          this.specificBill = this.mybill.bill;

        } catch (error) {

          this.showAlert("Payment Failed","Bill for selected Month is not available")
          return;

        }

        return resolve(this.specificBill)
  
      })
  
      }).then(solve=> {


      console.log(this.specificBill)

      if (this.specificBill == undefined) {
        return;
      }

        
      const datePayment = this.datePayment;
      const totalPayment = this.totalPayment;
      const paymentMonth = this.paymentMonth;
      const id = this.paymentLength;
      const currDate = this.currDate;
      const proof = this.proof;

      try{

        this.afstore.doc(`payment/${id}`).set({
          datePayment,
          totalPayment,
          paymentMonth,
          ref: currDate,
          image: proof,
          id: id,
          uid: this.user.getUID(),
          username: this.user.getUsername()
        })

      } catch (err){
        console.log(err)
      }
 


      const bill = this.specificBill - totalPayment;


      this.afstore.doc(`bill/${currDate}`).update({
        bill
      })

      const value = 0;

      const totalBill = this.totalbill - totalPayment;

      this.afstore.doc(`totalBill/${value}`).update({
        totalBill
      }).then(res=> {
        this.showAlert("Payment Created","Successfully deduct the bill amount")
        this.router.navigate(['/tabs/tab1'])
      })


      }).catch(error=> {
        this.showAlert("Payment Failed","Payment Month For is not available")
      })

      
      
    } catch (error){

      Swal.fire('Payment Failed','Please check and Try Again','error')

      console.log(error)

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

  change(file){

    try{


      this.file = file.target.files[0];

      const filePath = `Proof/${this.storageDate}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(`Proof/${this.storageDate}`,this.file);
      this.percentage = task.percentageChanges();
      this.snapshot = task.snapshotChanges().pipe(finalize(()=> {
        this.downloadURL = fileRef.getDownloadURL();
        this.downloadURL.subscribe(url => {
          if (url) {
            this.proof = url;
          }
          console.log(url)
        });
      })).subscribe(url => {
        if (url) {
          console.log(url)
        }
      })
  

      this.showAlert("File Selected", "New file has been set")

    } catch (error) {

      this.showAlert("Choose File Failed", error)

    }


  }

}
