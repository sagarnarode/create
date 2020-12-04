import { HttpClient, HttpParams } from '@angular/common/http';
import { Http, Headers, RequestOptions, URLSearchParams, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
//import { Observable } from "rxjs/Observable";
import {Observable} from 'rxjs/Rx';
/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
  constructor(public http: Http) {
  }
  httpReqest(type,url,param?)
  {
    let extractData = (res: Response) => {
      let body = res.json();
      return body || {};
  }
    let handleError = (error: Response | any) => {
      console.log('in handleError', error);
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            errMsg = body;
            if(error.status==401){
            }
        } else {
            console.log('in else');
            errMsg = error.message
                ? error.message
                : error.toString();
        }
        return Observable.throw(errMsg);
    }
      let headers: any;
      let timeout = 35000;
      headers = new Headers();
      headers.append("Accept", 'application/json');
     // headers.append('Content-Type', 'application/x-www-form-urlencoded');
      if(localStorage.token)
      {
        console.log('token number ',localStorage.token)
        headers.append('Authorization', 'Bearer '+localStorage.token);
      }
      
      let options = new RequestOptions({ headers: headers });
      console.log('options ',options)
      if(type=='post')
      {
        let request = this
        .http
        .post(url, param, options)
        .timeout(timeout)
        .map(extractData)
        .catch(handleError);
        return request;
      }
      if (type == 'get') {

        let request = this
          .http
          .get(url, options)
          .timeout(timeout)
          .map(extractData)
          .catch(handleError);
          return request;
        }

  }
}