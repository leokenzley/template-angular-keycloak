import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import {authConfig} from "./auth.config";
import { UserService } from '../services/user.service';
import { CustomAuthServiceService } from './security/services/custom-auth-service.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'template-angular';

  constructor(private oauthService: OAuthService,
    private userService: UserService,
    private _oauthService: CustomAuthServiceService
    ){
    this.configure();
  }

  getUserById(){
    console.log(this.oauthService.getAccessToken());
    const id = 1;
    this.userService.getById(id).subscribe(response=>{
        console.log('Dados do usuário: '+JSON.stringify(response));
    });
  }


  login() {
    this.oauthService.initCodeFlow();
  }

  private configure() {
    this.oauthService.configure(authConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin(); // This method is trigger issuer uri
  }

  logout() {
    this.oauthService.logOut();
  }
  
  isAuthenticated(){
    console.log(this.oauthService.getAccessToken());
    return this.oauthService.getAccessToken() != null && this.oauthService.getAccessToken() != undefined && this.oauthService.getAccessToken() != '';
  }
}
