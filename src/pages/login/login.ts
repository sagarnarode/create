import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, PopoverController, ViewController,LoadingController,Platform } from 'ionic-angular';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MainPage,ForgotPass } from '../';
import { Api } from '../../providers/api/api'
import { User } from '../../providers/user/user'
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication';
import { FCM } from '@ionic-native/fcm';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  signupform: FormGroup;
  registrationform: FormGroup;
  userData = { "password": "", "email": "" };
  registerCredentials = { rName: '', rEmail: '', rMobile: '', rPassword: '', rConfirmation_password: '' };
  avatarimage: any;
  signform: any;
  showOtpPage: boolean = false;
  varificationId: any = '';
  timeLeft:any;
   elem :any;
   timerId:any;
   showResendButton=false;
   loading: any;
  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public api: Api,
    public popoverCtrl: PopoverController,
    private firebaseAuthentication: FirebaseAuthentication,
    private fcm:FCM,
    public loadingCtrl: LoadingController,
    public platform:Platform,
  ) {
  }
  ngOnInit() {
    let EMAILPATTERN = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    this.signupform = new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]),
      email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
    });
    this.registrationform = new FormGroup({
      rName: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(30)]),
      rMobile: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(10), Validators.maxLength(10)]),
      rPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]),
      rEmail: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
      rConfirmation_password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(12), this.equalto('rPassword')])
    })
  }
 
  equalto(field_name) {
    return (control: AbstractControl): { [key: string]: any } => {

      let input = control.value;

      let isValid = control.root.value[field_name] == input
      if (!isValid)
        return { 'equalTo': { isValid } }
      else
        return null;
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login2Page');
    this.avatarimage = 'assets/img/avatarleft.png';
    this.signform = "login"
    // this.flashCardFlipped = false;
    //   this.changeAvatar();
  }

  changeAvatar() {
    if (this.signform == 'login') {
      this.avatarimage = 'assets/img/avatarleft.png';
    }

    if (this.signform == 'signup') {
      this.avatarimage = 'assets/img/avatarright.png';
    }
  }
  // Attempt to login in through our User service
  doLogin() {
     let fcmid:any;
    if (this.signupform.valid) {
    
      this.fcm.getToken().then(token => {
        console.log('token', token)
        fcmid=token;
      });
     
      let param=
      {
       "email": this.userData.email,
       "password": this.userData.password,
       "fcm":fcmid
      }
      this.showLoader();
       
        let url=this.user.httpUrls.login;
        this.api.httpReqest('post',url,param).subscribe(data=>{
        console.log('api data',data)
        this.loading.dismiss();
        if(data.token)
        {
          localStorage.isLogin = 'true';
          localStorage.token=data.token;
          localStorage.mobilenumber=data.phone;
          console.log('patient_phone',localStorage.mobilenumber)
          console.log('patient_phone',data.phone)
          
          this.navCtrl.push(MainPage);
        }
        else
        {
          let toast = this.toastCtrl.create({
            message: ' Invalid username or password.',
            duration: 3000,
            position: 'top',
            cssClass: 'invalideOTP'
          });
  
          toast.present();
          this.userData.email='';
          this.userData.password='';
        }

      },error=>{
        this.loading.dismiss();
        let toast = this.toastCtrl.create({
          message: 'Oops. Something went wrong. Please try again later.',
          duration: 3000,
          position: 'top',
          cssClass: 'invalideOTP'
        });

        toast.present();
        this.userData.email='';
        this.userData.password='';
      }
      )
    
    }
  }
  registration(registerCredentials) {
    if (this.registrationform.valid) 
    {
    let param={
      'phone':registerCredentials.rMobile
    }
      let url=this.user.httpUrls.UsersignupVerify;
      this.api.httpReqest('post',url,param).subscribe(data=>{
      console.log('api data',data)
      if(data.status=="NOT-FOUND")
      {
        let mobileno = '+91' + registerCredentials.rMobile      
     
      console.log('res', this.timerId)
      this.firebaseAuthentication.verifyPhoneNumber(mobileno, 0)
        .then((res: any) => {
          this.showOtpPage = true;
          this.varificationId = res;
          this.timerId = setInterval(() => {this.countdown(); }, 1000);
          console.log('res', res)
        })
        .catch((error: any) => console.error(error));
      }
      else
      {
        let toast = this.toastCtrl.create({
          message: data.status,
          duration: 3000,
          position: 'top',
          cssClass: 'invalideOTP'
        })
          toast.present();
      }

    },error=>{
      let toast = this.toastCtrl.create({
        message: 'Oops. Something went wrong. Please try again later.',
        duration: 3000,
        position: 'top',
        cssClass: 'invalideOTP'
      })
        toast.present();
       
      }
      )
     

      }
  }
  otpController(event, next, prev) {
    if (event.target.value.length < 1 && prev) {
      prev.setFocus()
    }
    else if (next && event.target.value.length > 0) {
      next.setFocus();
    }
    else {
      return 0;
    }
  }
  varifyOtp(otp1, otp2, otp3, otp4, otp5, otp6,resData) {
    let finalOpt = otp1.value + "" + otp2.value + "" + otp3.value + "" + otp4.value + '' + otp5.value + '' + otp6.value
    console.log('varificationId', this.varificationId, 'otp', finalOpt)
    this.firebaseAuthentication.signInWithVerificationId(this.varificationId, finalOpt)
      .then((res: any) => {
        if (res == 'OK') {
          let param=
          {
            'name':resData.rName,
            'lastName':'',
            'email':resData.rEmail,
            'password':resData.rPassword,
            'phone':resData.rMobile
          }
          let url=this.user.httpUrls.Usersignup;
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
            this.signform = 'login';
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
      })
      .catch((error: any) => {
        let toast = this.toastCtrl.create({
          message: 'Invalide OTP',
          duration: 3000,
          position: 'top',
          cssClass: 'invalideOTP'
        });

        toast.onDidDismiss(() => {
          console.log('Dismissed toast');
        });

        toast.present();
      });
  }
  forgotPassword() {
    console.log('book appoiitment');
    this.navCtrl.push(ForgotPass);
    // let popover = this.popoverCtrl.create(ForgotPassword, {}, { showBackdrop: true, enableBackdropDismiss: true, cssClass: 'contact-popover' });
    // popover.onDidDismiss(data => {
    // })
    // popover.present({
    //   ev: event
    // });
  }

 resendOtp(mobileno)
 {
   mobileno = '+91' + mobileno 
  this.firebaseAuthentication.verifyPhoneNumber(mobileno, 0)
  .then((res: any) => {
    this.showOtpPage = true;
    this.varificationId = res;
    this.timerId = setInterval(() => {this.countdown(); }, 1000);
    console.log('res', res)
  })
  .catch((error: any) => console.error(error));
 }

 countdown() {
  this.elem = document.getElementById('resendOtpTime');
if(this.timeLeft==undefined)
{
  this.timeLeft=10;
}
    if (this.timeLeft == -1) {
        clearTimeout(this.timerId);
        this.showResendOtpBtn()
    } else {
        this.elem.innerHTML = this.timeLeft + ' seconds remaining';
        this.timeLeft--;
    }
    
}
showResendOtpBtn ()
{
    this.showResendButton=true
}
showLoader() {
  this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
  });
  this.loading.present();
}
}
@Component({
  selector: 'forgotPassword',
  template: `
  <ion-list style="margin: 5px;">
  <ion-item>
    <ion-label stacked style="color:orange;font-size: large;">Enter your email address</ion-label>
    <ion-input type="email" [(ngModel)]="email"  name="Email"></ion-input>
  </ion-item>
  </ion-list>
  <button ion-button block style="background-color: orange;" (click)='resetPaaword(email)'>
  Send 
</button>
  `
})
export class ForgotPassword {
  constructor(public viewCtrl: ViewController, ) {


  }
  resetPaaword(data) {

    this.viewCtrl.dismiss();
    if(data)
    {

    }
  }

}