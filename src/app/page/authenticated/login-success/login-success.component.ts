import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RefreshTokenResponse } from '../../../security/model/refresh-token-response.model';
import { UserInfoResponse } from '../../../security/model/user-info-response.model';
import { CustomAuthServiceService } from '../../../security/services/custom-auth-service.service';

@Component({
  selector: 'app-login-success',
  standalone: true,
  imports: [],
  templateUrl: './login-success.component.html',
  styleUrl: './login-success.component.css'
})
export class LoginSuccessComponent implements OnInit{
    constructor(
    private _authService: CustomAuthServiceService){}

  ngOnInit(): void { 
    this._authService.userInfo().subscribe(response=>{
      this._authService.saveUserInfo(response);
    });
  }

  getName(){
    return this._authService.getName();
  }
}
