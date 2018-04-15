import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

import { ConfigService } from '../../config/config.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  username: string;
  password: string;
  email: string;
  firstname: string;
  lastname: string;

  constructor(private config: ConfigService, private http: Http) { }

  ngOnInit() {
  }

  register() {
    this.http.post(this.config.server_url + 'register', {
      username: this.username,
      password: this.password,
      email: this.email,
      firstname: this.firstname,
      lastname: this.lastname
    }, {
      withCredentials: true
    })
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log("Error occured");
        }
      );
  }

}
