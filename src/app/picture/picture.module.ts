import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PicturePageRoutingModule } from './picture-routing.module';

import { PicturePage } from './picture.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PicturePageRoutingModule
  ],
  declarations: [PicturePage]
})
export class PicturePageModule {}
