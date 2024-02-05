import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userEmail!: string;
  isLoggedIn$: Observable<boolean> | undefined
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    const userString = (localStorage.getItem('user'));
    if (userString !== null) {

      this.userEmail = JSON.parse(userString).email
      this.isLoggedIn$ = this.authService.isLoggedIn();
    } else {
      console.log('User data not found in localStorage')
    }
  }

  onLogOut() {
    this.authService.logOut();
  }

}
