import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from 'express';
import { Observable } from 'rxjs';
import { RefreshTokenResponse } from '../model/refresh-token-response.model';
import { UserInfoResponse } from '../model/user-info-response.model';

@Injectable({
  providedIn: 'root'
})
export class CustomAuthServiceService {
  private _apiPublic = `${environment.apiUrl}/public/v1/oauth`;
  private _api = `${environment.apiUrl}/v1/oauth`;
  private _ACCESS_TOKEN = 'access_token';
  private _REFRESH_TOKEN = 'refresh_token';

  constructor(
    private _http: HttpClient) { }

  refreshToken(): Observable<RefreshTokenResponse>{
    const obj = {
      token: sessionStorage.getItem('refresh_token'),
      access_token: sessionStorage.getItem('access_token')
    }
    return this._http.post<RefreshTokenResponse>(`${this._apiPublic}/refreshToken`, obj)
  }

  logout(){
    sessionStorage.clear()
    
  }

  getRefreshToken(): any {
     return sessionStorage.getItem('refresh_token');
  }

  getAccessToken(): any {
    return sessionStorage.getItem('access_token');
  }

  saveTokens(accessToken: string, refreshToken: string){
    sessionStorage.setItem(this._ACCESS_TOKEN, accessToken)
    sessionStorage.setItem(this._REFRESH_TOKEN,refreshToken)
  }

  userInfo(): Observable<UserInfoResponse>{
    return this._http.get<UserInfoResponse>(`${this._api}/userinfo`);
  }

  getUserInfo() {
    const userInfo = sessionStorage.getItem('user');
    if(userInfo) {
      return JSON.parse(userInfo);
    }
    return {};
  }

  saveUserInfo(userInfo:UserInfoResponse){
    sessionStorage.setItem('user', JSON.stringify(userInfo));
  }

  saveName(name:string){
    sessionStorage.setItem('name', name);
  }

  getName(){
    const userInfo:UserInfoResponse =  JSON.parse(JSON.stringify(sessionStorage.getItem('user')));
    return userInfo.name;
  }
}
