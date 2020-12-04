import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication';

/**
 * Generated class for the ForgotpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgotpassword',
  templateUrl: 'forgotpassword.html',
})
export class ForgotpasswordPage {
  showOtpPage:boolean = false;
  countdowncount:number=30;
  timerId:any;
  showresendButton:boolean = false;
  changepasswordpage:boolean=false;
  showmobilenumber:boolean = true;
  mobilevalidation:boolean=false;
  varificationId:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,    private firebaseAuthentication: FirebaseAuthentication,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotpasswordPage');
  }
  sendOtp(otp)
  {
    let mobileno = '+91' + otp      
     
      console.log('res', this.timerId)
      this.firebaseAuthentication.verifyPhoneNumber(mobileno, 0)
        .then((res: any) => {
          this.showOtpPage= true;
          this.showmobilenumber=false
          this.varificationId = res;
          this.timerId = setInterval(() => {this.countdown();}, 1000);
        })
        .catch((error: any) => console.error(error));
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
  countdown()
  {
    if (this.countdowncount == 0) {
      clearTimeout(this.timerId);
      this.showresendButton=true
     // this.showResendOtpBtn()
  } else {
      this.countdowncount--;
  }
  }
  resendOtp(mobile)
  {
    this.countdowncount=30
    this.showresendButton=false
  }
  varifyOtp(a,b,c,d,e,f)
  {
    let finalOpt = a.value + "" + b.value + "" + c.value + "" + d.value + '' + e.value + '' + f.value
    
    this.firebaseAuthentication.signInWithVerificationId(this.varificationId, finalOpt)
      .then((res: any) => {
        if (res == 'OK') {
          this.showOtpPage= false;
          this.changepasswordpage=true;
        }
      })
      .catch((error: any) => {})
        

    
  }
  savepassword(password)
  {


  }
  mobilenumberEnter(value,ctrl)
  {
    console.log('ss',value.length)
 if(value.length==10 && ctrl.valid)
 {
   this.mobilevalidation=true
 }
 else
 {
  this.mobilevalidation=false
 }
  }
  backbtn()
  {
    this.navCtrl.pop();
  }
}
