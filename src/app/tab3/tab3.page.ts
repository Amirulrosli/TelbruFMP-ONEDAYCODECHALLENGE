import { Component,OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import swal from 'sweetalert';
import Swal from 'sweetalert2';
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
  profileEmail: any;
  profileRoles: any = false;
  type:any;

  constructor(
    private user: UserService,
    private afstore: AngularFirestore,
    private router: Router,
    private ngFireAuth: AngularFireAuth
  ) {}


  ngOnInit(){
      this.paymentList = [];
      this.payment();
      const uid = localStorage.getItem('uid');

      try{

        this.afstore.doc(`user/${uid}`).valueChanges().subscribe(data=> {
          this.profile = data;
          this.profileName = this.profile.username;
          this.profileEmail = this.profile.email;
          this.profileRoles = this.profile.role;

          

          if (this.profileRoles == undefined){
            this.profileRoles = false;
          } else {
            this.profileRoles = true;
          }

        })

      } catch (error){
        alert(error)
      }
    


  }

  updateBalance(){

    this.router.navigate(['/update-balance'])
    
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

  AllPayment(){
    this.paymentList=[];

    this.getAllPosts().subscribe(data=> {
      this.paymentList = data;
    }, error=> {
      console.log(error)
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



  getAllPosts (): Observable<any> {
    return this.afstore.collection<any>( "payment",ref=> ref.orderBy("id","desc")).valueChanges();
  }


  change(){
    console.log(this.type)
    switch(this.type){
      case 'All': this.AllPayment(); break;
      case 'Personal': this.payment(); break;
      default: Swal.fire('The Internet is going down','Please Try again!','info')
    }
  }

  signOut(){
    this.ngFireAuth.signOut().then(() => {
       localStorage.removeItem('uid')
       localStorage.removeItem('user')
       Swal.fire('Successfully Logout'," Thank You For Using our Services",'success')
       this.router.navigate([''])
       
   },error=> {
    Swal.fire('logout Failed',"Cannot Logout from the app",'error')
   })
 }
   

}
