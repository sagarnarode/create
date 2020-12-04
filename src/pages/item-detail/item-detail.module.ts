import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { DatePickerModule } from 'ion-datepicker';
import { ItemDetailPage } from './item-detail';

@NgModule({
  declarations: [
    ItemDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ItemDetailPage),
    TranslateModule.forChild(),
    DatePickerModule,
  ],
  exports: [
    ItemDetailPage
  ]
})
export class ItemDetailPageModule { }
