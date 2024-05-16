import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { LoginResponse } from '../models/loginResponse.model';
import { Login } from '../models/login.model';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = 'https://localhost:7085/api/Account/'
  private currentUserSource = new BehaviorSubject<LoginResponse | null>(null);
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
    return this.http.post<LoginResponse>(this.baseUrl + 'login', loginModel)
  }

  register(model: any) {
    return this.http.post<LoginResponse>(this.baseUrl + 'register', model).pipe(
      map(response => {
        const user = response;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    )
  }

  setCurrentUser(user: LoginResponse) {
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  isLoggedIn() : boolean{
    let user;
    this.currentUser$.subscribe(response => {
      if (response !== null) {
        user = jwtDecode(response.token)
        if (user.exp) {
          if (user.exp <= (Date.now()/1000)) {
            console.log(user.exp);
            console.log(Date.now()/1000);
            
            this.logout();
            return false;
          }
          else{
            return true;
          }
        }
        else{
          return false;
        }
      }
      else{
        return false;
      }
    })
    return true;

  }
}