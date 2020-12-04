import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams ,ViewController,Events,PopoverController,ToastController,LoadingController} from 'ionic-angular';
import { Api } from '../../providers/api/api'
import { User } from '../../providers/user/user'
import { Slides } from 'ionic-angular';
import { DatePickerDirective } from 'ion-datepicker';
@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage
{
  @ViewChild(DatePickerDirective) private datepickerDirective:DatePickerDirective;
  @ViewChild(Slides) slides: Slides;
  item: any;
  dateObject:any;
  features:any;
  arrCatimages:any;
  currentSelected:any;
  currentSelectedDate:any=0;
  maxcount:any=250;
  editFlag:any;
  chars:any;
  reasonErrorFlag: boolean = false;
  DoctInfo:any;
  timeslotapiData:any;
  dependantList:any;
  Doctlist:any;
  selectedDependantId:any;
  selecteDoctid:any;
  appDate:any;
  selectedTimeSloat:any;
  selecteddate:any;
  loading: any;
  tab:any;

monthObj:any=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]
weekDay:any=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  constructor(    
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public popoverCtrl: PopoverController,
    public user: User,public api : Api,
    public toastCtrl: ToastController,) {
    this.DoctInfo=this.navParams.get("item")
    this.Doctlist=this.navParams.get("doctorData")
  
      
  this.features = {
    pagination: '.swiper-pagination',
    slidesPerView: 1,
    paginationClickable: true,
    paginationBulletRender: function (index, className) {
        return '<span class="' + className + '">' + (index + 1) + '</span>';
    }
    }
  }

  ionViewDidLoad() {
    this.getDependendlist();
    this.getTimeAndDate(this.DoctInfo.id)
  
  }
  showLoader() {
    this.loading = this.loadingCtrl.create({
        content: 'Please wait...'
    });
    this.loading.present();
  }
  getDependendlist()
  {
     
    let url=this.user.httpUrls.getdependant;
    this.api.httpReqest('get',url).subscribe(data=>{
      console.log(data,'data')
      if(data.length>0)
      {
        this.dependantList=data;
      }
     

  },error=>{
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
  onItemClicked(data,idx)
  {
    this.selectedTimeSloat=data.slot
    this.currentSelected=idx
  }
  selectDate(idx,date)
  {
    this.selecteddate=date.fulldate
    console.log('selected date',this.selecteddate)
    this.appDate=date;
    this.currentSelectedDate=idx
    this.arrCatimages= this.timeslotapiData[idx].timeSlots;
    if(this.arrCatimages[0].status=='Open')
      {
        this.currentSelected=0
        this.selectedTimeSloat=this.arrCatimages[0].slot
      }
      else 
      {
        this.selectedTimeSloat=this.arrCatimages[1].slot
        this.currentSelected=1
      }

  }
  slideChanged() {
    this.currentSelectedDate = this.slides.getActiveIndex();

    //console.log('Current index is', currentIndex);
  }
  backbtn()
  {
    this.navCtrl.pop();
  }
  confirmAppoitment(ngMdescribereasonforvisit,depenlist)
  {
    console.log('this.selecteDoctid',this.DoctInfo.id,)
    let param={
      'patientId':depenlist.id,
      'doctorId':this.DoctInfo.id,
      'doa':this.selecteddate,
      'timeslot':this.selectedTimeSloat,
      'problem':ngMdescribereasonforvisit,
      'token':''
    }
   let option=
   {
     'doctName':this.DoctInfo.dName,
     'dependandName':depenlist.name,
     'date':this.selecteddate,
     'timeslot':this.selectedTimeSloat
   }
    let url=this.user.httpUrls.newappointment;
    this.showLoader();
    this.api.httpReqest('post',url,param).subscribe(data=>{
      this.loading.dismiss();
      this.showPopover(option);

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
  showPopover(option)
  {
    let popover = this.popoverCtrl.create(ConfirmAppoitmentPage,{options :option},{cssClass: 'attachment-popup'});
    
    popover.present();
    popover.onDidDismiss(data => {
      this.tab = this.navCtrl.parent;
      this.tab.select(0);
      this.tab.select(1);
    })
  }
  ChangeCount(e: any) {
    if (e.target.value.length < 1) {
      this.editFlag = false;
    }
    else {
      this.reasonErrorFlag = false;
      this.editFlag = true
    }
    let max = this.maxcount;
      let currentCount = e.target.value.length;
      if (currentCount <= max) {
        this.chars = max - currentCount;
      }
      else
      {
        e.target.value=e.target.value.substring(0, this.maxcount);
      }
  }
  changeDependant(dependant)
  {
    console.log('get depe',dependant)
    this.selectedDependantId=dependant.id;
  }
  ChangeDoctor(doctlist)
  {
    this.selecteDoctid=doctlist.id;
    this.getTimeAndDate(doctlist.id)
  }
  getTimeAndDate(id)
  {
    let url=this.user.httpUrls.doctorAavailability.replace('{doctorID}',id);
    this.showLoader();
    this.api.httpReqest('get',url).subscribe(data=>{
      this.loading.dismiss();
    this.timeslotapiData=data;
      this.dateObject=[]
      for(let i=0;i<data.length;i++)
      {
        let dateObj=new Date(data[i].date);
        let month=dateObj.getMonth() + 1
        let returnDate={
          day:this.weekDay[dateObj.getDay()],
          date:dateObj.getDate(),
          month:this.monthObj[dateObj.getMonth()],
          fulldate:dateObj.getFullYear()+"-"+month+"-"+dateObj.getDate(),
        }
        this.dateObject.push(returnDate)
      } 
      this.arrCatimages=data[0].timeSlots;
      if(this.arrCatimages[0].status=='Open')
      {
        this.currentSelected=0
        this.selectedTimeSloat=this.arrCatimages[0].slot
      }
      else 
      {
        this.currentSelected=1
        this.selectedTimeSloat=this.arrCatimages[1].slot
      }

      this.selecteddate=data[0].date

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
  ionViewWillLeave()
  {
  //  this.navCtrl.pop();
  }
  addnewDependant(option)
  {
    let popover = this.popoverCtrl.create(AddNewDep,{},{cssClass: 'attachment-popup'});
    
    popover.present();
    popover.onDidDismiss(data => {
      this.getDependendlist();
    })
  }
}
@Component({
  selector: 'ConfirmMsg',
  template: `
  <ion-card>
  <img style='width: 44%;margin-left: 30%;margin-top: 16%;' src="../assets/img/calendar-icon.jpg"/>
  <ion-card-content>
    <ion-card-title style='font-size: 1.4rem;text-align: center;'>
      {{options.dependandName}},we have got you confirm for your appoitment
    </ion-card-title>
    <p style='font-size: 2.0rem;text-align: center;'>
      {{options.timeslot}} | {{options.doctName}}
    </p>
    <p style='font-size: 1.4rem;text-align: center;font-family: initial;color:slategray;'>
      {{options.date}}
    </p>
    <p style='font-size: 1.4rem;text-align: center;font-family: initial;color:slategray;'>
    New Panvel East, Sector 5, Navi Mumbai, Maharashtra 410206
    </p>
  </ion-card-content>
    <button ion-button block style="background-color: orange;" (click)='confirmAppoitment()'>
      My Appoitment 
    </button>
</ion-card>

  `
})
export class ConfirmAppoitmentPage {
  options:any;
  constructor(    public navCtrl: NavController,public viewCtrl: ViewController,public param: NavParams, public events: Events,private navParams : NavParams) {

    this.options = this.navParams.get("options");
   }
   confirmAppoitment()
   {
    this.viewCtrl.dismiss();
  

   }
}
@Component({
  selector: 'AddnewDep',
  template: `
  <ion-row text-center>
  <ion-col col-6 >
   <ion-input placeholder="Name" [(ngModel)]='newDepeName' required  class='otp'>
     
   </ion-input>
  </ion-col>
   <ion-col col-4 (ionChanged)='datechange($event)'   ion-datepicker  [(value)]="localDate">
    <ion-input placeholder="DOB" [(ngModel)]='localDateFormated'   class='otp' readonly>

   </ion-input>
  </ion-col>
  <ion-col>
    <ion-icon name="calendar" (ionChanged)='datechange($event)'   ion-datepicker  [(value)]="localDate" style="color:orange ;font-size: 2.2em;"></ion-icon> 
  </ion-col>
  </ion-row>
 
  <ion-row text-center>
    <ion-col col-8 >
      <ion-item >
        <ion-label class="text-md-blue">Relation</ion-label>
        <ion-select class="select-container"  [(ngModel)]='newDepeReleation' style="padding: 0px;" >
          <ion-option value='Son'>Son</ion-option>
          <ion-option value='Daughter'>Daughter</ion-option>    
          <ion-option value='Other'>Other</ion-option>    
        </ion-select>
      </ion-item>
    </ion-col>
     <ion-col col-4>
      <button ion-button   block [disabled]="!(newDepeName  && newDepeReleation)"   style="background-color: orange;font-size: large;" (click)='addnewDependant(newDepeName,newDepeReleation)'>
        Save</button>
    </ion-col>
    </ion-row>

  `
})
export class AddNewDep {
  options:any;
  localDate :any;
  localDateFormated:any;
  constructor(public user: User,public api : Api,public toastCtrl: ToastController,    public navCtrl: NavController,public viewCtrl: ViewController,public param: NavParams, public events: Events,private navParams : NavParams) {

    this.localDate = new Date();
    let date=this.localDate.getFullYear()+"-"+this.localDate.getMonth()+"-"+this.localDate.getDate();
    this.localDateFormated=date;
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
    this.api.httpReqest('post',url,param).subscribe(data=>{
   
      this.viewCtrl.dismiss();
      let toast = this.toastCtrl.create({
        message: data.status,
        duration: 3000,
        position: 'top',
        cssClass: 'invalideOTP'
      });
  
      toast.present();
     
  },error=>{
    this.viewCtrl.dismiss();
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
}
