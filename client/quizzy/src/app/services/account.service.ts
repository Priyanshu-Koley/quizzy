import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../models/user.model';
import { Login } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = 'https://localhost:7085/api/Account/'
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  login(loginModel: Login) {
    // return this.http.post<User>(this.baseUrl + 'login', loginModel).pipe(
    //   map((response: User) => {
    //     const user = response;
    //     if (user) {
    //       localStorage.setItem('user', JSON.stringify(user));
    //       this.currentUserSource.next(user);
    //     }
    //     return user;
    //   })
    // )
    return this.http.post<User>(this.baseUrl + 'login', loginModel)
  }

  register(model: any) {
    return this.http.post<User>(this.baseUrl + 'register', model).pipe(
      map(response => {
        const user = response;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    )
  }

  setCurrentUser(user: User) {
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}