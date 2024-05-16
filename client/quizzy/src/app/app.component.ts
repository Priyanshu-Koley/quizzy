import { Component } from '@angular/core';
import { AccountService } from './services/account.service';
import { LoginResponse } from './models/loginResponse.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'quizzy';

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.setCurrentUser();
  }

  setCurrentUser() {
    if (this.accountService.isLoggedIn()) {
      
    }
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const userToken: LoginResponse = JSON.parse(userString);
    this.accountService.setCurrentUser(userToken);
  }
}
