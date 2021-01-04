import { Component,OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  paymentList: any = []
  mypayment: any;
  refPayment:any;
  profile: any;
  profileName:any;

  constructor(
    private user: UserService,
    private afstore: AngularFirestore
  ) {}


  ngOnInit(){
      this.paymentList = [];
      this.payment();
      const uid = localStorage.getItem('uid');

      try{

        this.afstore.doc(`user/${uid}`).valueChanges().subscribe(data=> {
          this.profile = data;
          this.profileName = this.profile.username;
        })

      } catch (error){
        alert(error)
      }
    


  }


  payment(){
    this.paymentList = [];

    const payment = this.afstore.collection('payment');
    const uid = localStorage.getItem('uid');

    this.mypayment= payment.ref.where('uid','==',uid).get().then(snapshot=> {
      if (snapshot.empty){
        return
      }

      snapshot.forEach(doc=> {
        this.refPayment = doc.data();
        this.paymentList.push(this.refPayment)
      })
    })

  }

  delete(id){
    console.log(id)

    try{

      
    this.afstore.doc(`payment/${id}`).delete();
    this.payment();

    } catch (err) {

      alert(err);

    }

  }

}
