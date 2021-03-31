import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-picture',
  templateUrl: './picture.page.html',
  styleUrls: ['./picture.page.scss'],
})
export class PicturePage implements OnInit {

  image: any;

  myImage: any;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {

    var data = `${this.image}`;

    this.myImage = data;
    console.log(data);
  }

  dismiss(){

    this.modalCtrl.dismiss();
  }

}
