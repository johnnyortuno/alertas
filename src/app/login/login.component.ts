import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './shared/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  _users;

  constructor(private auth: AuthenticationService) { }

  ngOnInit(): void {
    this._users = this.auth.getUsers();
    console.log(this._users);
  }

}
