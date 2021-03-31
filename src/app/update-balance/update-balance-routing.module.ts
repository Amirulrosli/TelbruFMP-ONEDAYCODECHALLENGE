import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateBalancePage } from './update-balance.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateBalancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateBalancePageRoutingModule {}
