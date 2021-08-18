import { Component, OnInit } from '@angular/core';
import { StorageService } from '../core/services/storage.service';
import { AuthenticationService } from '../login/shared/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private authService: AuthenticationService, private storageService: StorageService) { }

  ngOnInit(): void {
  }

  public logout(): void{
    /*this.authService.logout().subscribe(
        response => {
          if(response) {
            this.storageService.logout();
          }
        }
    );*/
    this.storageService.logout();
  }

}
