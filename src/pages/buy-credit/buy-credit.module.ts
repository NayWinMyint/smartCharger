import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuyCreditPage } from './buy-credit';

@NgModule({
  declarations: [
    BuyCreditPage,
  ],
  imports: [
    IonicPageModule.forChild(BuyCreditPage),
  ],
})
export class BuyCreditPageModule {}
