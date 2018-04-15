import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

import { ConfigService } from '../../config/config.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;

  constructor(private http: Http, private config: ConfigService) { }

  ngOnInit() {
  }

  login() {
    this.http.post(this.config.server_url + 'login', {
      username: this.username,
      password: this.password
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
