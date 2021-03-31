import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PicturePage } from './picture.page';

const routes: Routes = [
  {
    path: '',
    component: PicturePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PicturePageRoutingModule {}
