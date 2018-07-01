import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChargingScannerPage } from './charging-scanner';

@NgModule({
  declarations: [
    ChargingScannerPage,
  ],
  imports: [
    IonicPageModule.forChild(ChargingScannerPage),
  ],
})
export class ChargingScannerPageModule {}
