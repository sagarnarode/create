import { Component,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams,Nav,ToastController,LoadingController } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { FirstRunPage ,MainPage} from '../../pages';
import {App} from 'ionic-angular';
import { Api } from '../../providers/api/api'
import { User } from '../../providers/user/user'
import { DatePickerDirective } from 'ion-datepicker';

/**
 * The Settings page is a simple form that syncs with a Settings provider
 * to enable the user to customize settings for the app.
 *
 */
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
	@ViewChild(DatePickerDirective) private datepickerDirective:DatePickerDirective;

  // Our local settings object
  options: any;

  settingsReady = false;
  showMember:boolean=false;
  vaccine:any=[1,2,3,4,3,4,5,6,7,8,9]
  form: FormGroup;

  profileSettings = {
    page: 'profile',
    pageTitleKey: 'SETTINGS_PAGE_PROFILE'
  };

  page: string = 'main';
  pageTitleKey: string = 'SETTINGS_TITLE';
  pageTitle: string;

  subSettings: any = SettingsPage;
  dependantList:any;
  todaysDate:any;
  localDate :any;
  localDateFormated:any;
  paymentDetails:any;
  loading: any;
  constructor(public navCtrl: NavController,
   
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public translate: TranslateService,
    public copy:Clipboard,
    public loadingCtrl: LoadingController,
    public app:App,public user: User,public api : Api,public toastCtrl: ToastController) {
      this.localDate = new Date();
      let date=this.localDate.getFullYear()+"-"+this.localDate.getMonth()+"-"+this.localDate.getDate();
      this.localDateFormated=date;
  }

  _buildForm() {
    let group: any = {
      option1: [this.options.option1],
      option2: [this.options.option2],
      option3: [this.options.option3]
    };

    switch (this.page) {
      case 'main':
        break;
      case 'profile':
        group = {
          option4: [this.options.option4]
        };
        break;
    }
    this.form = this.formBuilder.group(group);

    // Watch the form for changes, and
   
  }

  ionViewDidLoad() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});
    this.getDependendlist();
  }

  ionViewWillEnter() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});

    this.page = this.navParams.get('page') || this.page;
    this.pageTitleKey = this.navParams.get('pageTitleKey') || this.pageTitleKey;

    this.translate.get(this.pageTitleKey).subscribe((res) => {
      this.pageTitle = res;
    })

  
  }

  ngOnChanges() {
    console.log('Ng All Changes');
  }
  copyText(text)
  {
    this.copy.copy(text);
  }
  logOut()
  {
    localStorage.clear();
    console.log('this.app.getRootNav()',this.app.getRootNav())
    this.app.getRootNav().setRoot(FirstRunPage);
  }
  getDependendlist()
  {
     
    let url=this.user.httpUrls.getdependant;
    this.showLoader();
    this.api.httpReqest('get',url).subscribe(data=>{
      this.dependantList=data;
      this.getPaymentList();
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
  addnewDependant(name,relation)
  {
    let url=this.user.httpUrls.Deregistration;
    let param=
    {
      'patient_name':name,
      'patient_dob':this.localDateFormated,
      'patient_age':'',
      'patient_phone':localStorage.mobilenumber,
      'patient_email':'',
      'patient_gender':relation,
      'patient_address':'',
      'status':''
    }
    console.log('patient_phone',localStorage.mobilenumber)
    this.showLoader();
    this.api.httpReqest('post',url,param).subscribe(data=>{
      this.loading.dismiss();
      
      let toast = this.toastCtrl.create({
        message: data.status,
        duration: 3000,
        position: 'top',
        cssClass: 'invalideOTP'
      });
  
      toast.present();
      this.getDependendlist();
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
  datechange(data) {
    //  console.log('data',data.format('YYYY-MM-DD'))
  
    let date=data.getFullYear()+"-"+data.getMonth()+"-"+data.getDate();
      this.localDateFormated=date;
     // this.calculateAge(data)

  }
//   calculateAge(birthday) { // birthday is a date
//     var ageDifMs = Date.now() - birthday.getTime();
//     var ageDate = new Date(ageDifMs); // miliseconds from epoch
//     let age= Math.abs(ageDate.getUTCFullYear() - 1970);
//     if(age<=0)
//     {
//       console.log(this.monthDiff(birthday,new Date()))
//     }
// }
// monthDiff(d1, d2) {
//   var months;
//   months = (d2.getFullYear() - d1.getFullYear()) * 12;
//   months -= d1.getMonth();
//   months += d2.getMonth();
//   return months <= 0 ? 0 : months;
// }
getPaymentList()
{
  let url=this.user.httpUrls.paymentDetails;
  this.api.httpReqest('get',url).subscribe(data=>{
    this.loading.dismiss();

    this.paymentDetails=data;
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
}
