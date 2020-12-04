import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,AlertController,LoadingController  } from 'ionic-angular';
import { Api } from '../../providers/api/api';
import { User } from '../../providers/user/user';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import * as _ from 'lodash';
@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  historyData:any;
  loading: any;
  constructor(  public loadingCtrl: LoadingController,private photoViewer: PhotoViewer,public alertCtrl: AlertController,public navCtrl: NavController, public navParams: NavParams,public user: User,public api : Api,public toastCtrl: ToastController,) { }

  /**
   * Perform a service for the proper items.
   */
  ionViewDidEnter() {
    let url=this.user.httpUrls.appointmentHistory;
    this.showLoader();
    this.api.httpReqest('get',url).subscribe(data=>{
      this.loading.dismiss();
      this.historyData= _.orderBy(data,['id'],['desc'])
    
  },error=>{
    this.loading.dismiss();
    let toast = this.toastCtrl.create({
      message: 'Oops. Something went wrong. Please try again later.',
      duration: 3000,
      position: 'top',
      cssClass: 'invalideOTP'
    });

    toast.present();
   
  }
  )
  }
  showLoader() {
    this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
    });
    this.loading.present();
  }
  openAttachment(id)
  {
    
    let url=this.user.httpUrls.pdfDownload.replace('{pdfid}',id);
    this.showLoader();
    this.api.httpReqest('get',url).subscribe(data=>{
      this.loading.dismiss();

      this.photoViewer.show('data:image/jpeg;base64,'+data.consultation, 'Attachment', {share: true});

    },error=>{
      this.loading.dismiss();

      let toast = this.toastCtrl.create({
        message: 'Oops. Something went wrong. Please try again later.',
        duration: 3000,
        position: 'top',
        cssClass: 'invalideOTP'
      });
  
      toast.present();
     
    }
    )
  }
  deleteAppoitment(id)
  {
   // appointmentCancel: `${this.mainUrl}/appointment-cancel/{appointmentID}`,
   const confirm = this.alertCtrl.create({
    title: 'Cancle Appointment?',
    message: 'are you sure you want to cancel your appointment?',
    buttons: [
      {
        text: 'No',
        handler: () => {
          console.log('Disagree clicked');
        }
      },
      {
        text: 'Yes',
        handler: () => {
          let url=this.user.httpUrls.appointmentCancel.replace('{appointmentID}',id);
          this.showLoader();
          this.api.httpReqest('get',url).subscribe(data=>{
            this.loading.dismiss();
          },error=>{    
            this.loading.dismiss();

            let toast = this.toastCtrl.create({
              message: 'Oops. Something went wrong. Please try again later.',
              duration: 3000,
              position: 'top',
              cssClass: 'invalideOTP'
            });
        
            toast.present();
           
          }
          )
        }
      }
    ]
  });
  confirm.present();
   
  }

}
