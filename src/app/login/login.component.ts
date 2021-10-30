import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  val = {
    email: 'admin@admin.com',
    password: 'Password...123'
  };


  constructor() {
  }

  ngOnInit() {

  }

  login(formData: NgForm, submit): void {
    console.log(formData.value, formData.valid);
    console.log('Val:', this.val);
  }

  onEmailChange($event: any) {
    console.log($event);
  }

  onEmailChange2($event: any) {
    console.log($event);
  }
}
