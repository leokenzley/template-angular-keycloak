import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
  })
export class UserService {
    private apiUrl:string = environment.apiUrl;
    
    constructor(private httpClient:HttpClient){

    }
    getById(id: number): Observable<any>{

      return this.httpClient.request('GET', this.apiUrl+"/v1/user/"+id, {responseType:'json'});
    }
}