import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestServiceService {

  constructor(private http: HttpClient) { }

  public get(url:string){
    return this.http.get(url); // GET  
  }

  public post(url:string, body: any ){
    const headers = { 'Content-Type': 'application/json; charset=utf8' };
    return this.http.post(url,body,{ headers }
    ); // POST  
  }
  public put(url:string, body: any ){
    const headers = { 'Content-Type': 'application/json; charset=utf8' };
    return this.http.put(url,body,{ headers }); // POST  
  }
}