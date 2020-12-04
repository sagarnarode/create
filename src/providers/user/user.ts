import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';

import { Api } from '../api/api';
 
@Injectable()
export class User {
  _user: any;
  mainUrl:any='http://13.233.92.243/hospital/rest'
  constructor(public api: Api) { }
  httpUrls = {
    login: `${this.mainUrl}/authenticate`,
    DoctorList: `${this.mainUrl}/doctors`,
    getdependant: `${this.mainUrl}/getdependant`,
    doctorAavailability: `${this.mainUrl}/doctor/availability/{doctorID}`,
    appointmentHistory: `${this.mainUrl}/appointment-history`,
    appointmentCancel: `${this.mainUrl}/appointment-cancel/{appointmentID}`,
    newappointment: `${this.mainUrl}/newappointment`,
    UsersignupVerify: `${this.mainUrl}/signup-verify`,
    Usersignup: `${this.mainUrl}/signup`,
    resetpassword: `${this.mainUrl}/reset-password`,
    Deregistration: `${this.mainUrl}/registration`,
    paymentDetails: `${this.mainUrl}/payment-details`,  
    pdfDownload: `${this.mainUrl}/getConsultationImage/{pdfid}`,  
    gallary: `${this.mainUrl}/gallary/images`,  
  }
  
 
   firebaseConfig = {
    apiKey: "AIzaSyCFs_Nyuw6qQh8jR2Z6Y0DI0TjXY-0G0eY",
    authDomain: "appoitement-3051a.firebaseapp.com",
    databaseURL: "https://appoitement-3051a.firebaseio.com",
    projectId: "appoitement-3051a",
    storageBucket: "appoitement-3051a.appspot.com",
    messagingSenderId: "397230859703",
    appId: "1:397230859703:web:e8abf9c96db0768078f432",
    measurementId: "G-1CW0RT9PXR"
  }
 


}
