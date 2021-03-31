import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateBalancePageRoutingModule } from './update-balance-routing.module';

import { UpdateBalancePage } from './update-balance.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateBalancePageRoutingModule
  ],
  declarations: [UpdateBalancePage]
})
export class UpdateBalancePageModule {}
