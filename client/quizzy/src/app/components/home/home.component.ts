import { Component } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Login } from '../../models/login.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LoginResponse } from '../../models/loginResponse.model';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(public accountService: AccountService, private formBuilder: FormBuilder, private messageService: MessageService) { }

  navItems = [
    {
      label: 'Home',
      icon: 'pi pi-home'
    },
    {
      label: 'Features',
      icon: 'pi pi-star'
    },
    {
      label: 'Projects',
      icon: 'pi pi-search',
      items: [
        {
          label: 'Components',
          icon: 'pi pi-bolt'
        },
        {
          label: 'Blocks',
          icon: 'pi pi-server'
        },
        {
          label: 'UI Kit',
          icon: 'pi pi-pencil'
        },
        {
          label: 'Templates',
          icon: 'pi pi-palette',
          items: [
            {
              label: 'Apollo',
              icon: 'pi pi-palette'
            },
            {
              label: 'Ultima',
              icon: 'pi pi-palette'
            }
          ]
        }
      ]
    },
    {
      label: 'Contact',
      icon: 'pi pi-envelope'
    }
  ];

  loading: boolean = false;
  loggedIn: boolean = false;

  token!: String | null;
  user: any;
  loginForm!: FormGroup;

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern("^(?=.*[0-9])(?=.*[A-Z])(?!.*\s).{8,}$")]],
    });
    const userString = localStorage.getItem("user");
    if (userString !== null) {
      this.user = this.getDecodedJwt(userString);
    }
    else{
      this.loggedIn = false;
    }
  }

  load() {
    this.loading = true;



    setTimeout(() => {
      this.loading = false
    }, 2000);
  }

  login() {
    this.loading = true;
    if (this.loginForm.valid) {
      this.accountService.login(this.loginForm.value).subscribe({
        next: response => {
          // console.log(response);
          const user = response;
          if (user) {
            this.token = user.token;
            this.user = this.getDecodedJwt(user.token);
            console.log(this.user);

            localStorage.setItem('user', JSON.stringify(user));
            this.accountService.setCurrentUser(user);
          }
          this.loading = false;
          this.loggedIn = true;
        },
        error: error => {
          console.log(error);
          if (error.status === 401) {
            this.messageService.add({ severity: 'error', summary: 'Wrong credentials', detail: `${error.error}` });
          }
          this.loading = false;
        }
      })
    } else {
      this.messageService.add({ severity: 'error', summary: 'Invalid input', detail: 'Please fill valid details' });
      this.loading = false;

    }

  }

  logout() {
    this.loading = true;
    this.token = null;
    this.accountService.logout();
    this.loading = false;
    this.loggedIn = false;
  }


  getDecodedJwt(token: string): any {
    try {
      return jwtDecode(token);
    } catch (Error) {
      return Error;
    }
  }

}
