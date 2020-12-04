import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController ,ToastController,App} from 'ionic-angular';
import { Api } from '../../providers/api/api';
import { User } from '../../providers/user/user';
import { FirstRunPage ,MainPage} from '../../pages';
//import firebase  from 'firebase';
@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  cardItems:any=[];
  hospitalgallary=[];
  constructor(public app:App,public navCtrl: NavController, public modalCtrl: ModalController, public user: User,public api : Api,public toastCtrl: ToastController,) {
    
    let url=this.user.httpUrls.gallary;
    this.api.httpReqest('get',url).subscribe(data=>{
 console.log('img gallary data',data)
  },error=>{
    this.app.getRootNav().setRoot(FirstRunPage);
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

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
   
    
    let url=this.user.httpUrls.DoctorList;
    this.api.httpReqest('get',url).subscribe(data=>{
      if(data.message!='Unauthorized')
      {
        this.cardItems=data;
        this.cardItems.forEach(element => {
          if(element.dImage)
          {
            let str1='data:image/jpeg;base64,'
            element.dImage=str1.concat(element.dImage)
          }
          else
          {
            element.dImage= 'assets/img/marty-avatar.png'
          }
          element.dAvailableTime=element.dAvailableTime.split(",")
        });
      }
    else
    {
      this.app.getRootNav().setRoot(FirstRunPage);
    let toast = this.toastCtrl.create({
      message: 'Your Session Has Expired. Please Login Again.',
      duration: 3000,
      position: 'top',
      cssClass: 'invalideOTP'
    });

    toast.present();
    }

  },error=>{
    this.app.getRootNav().setRoot(FirstRunPage);
    let toast = this.toastCtrl.create({
      message: 'Your Session Has Expired. Please Login Again.',
      duration: 3000,
      position: 'top',
      cssClass: 'invalideOTP'
    });

    toast.present();
   
  }
  )
  for(let i=1;i<=22;i++)
  {
    // console.log("errfforor");
    // let name="images/"+i+".jpg"
    // var uploadTask = firebase.storage().ref().child(name)
    // uploadTask.getDownloadURL().then(snapshot1 => {
    //   let data={imgurl:snapshot1}
    //   this.hospitalgallary.push(data);  
    // }, error => {
     
    //   console.log("error", error);
    // })
  }
  }
  book_appoitment(item) {
    this.navCtrl.push('ItemDetailPage', {
      item: item,
      doctorData:this.cardItems
    });
  }
  email(emailid)
  {
    window.location.href = `mailto:${emailid}`;
  }
}
