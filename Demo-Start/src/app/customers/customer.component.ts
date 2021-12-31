import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Customer } from './customer';


function emailMatcher(c: AbstractControl): {[key: string]: boolean} | null {
  const emailControl = c.get('email');
  const confirmControl = c.get('confirmEmail');

  if(emailControl.pristine || confirmControl.pristine){
    return null;
  }
  if(emailControl.value === confirmControl.value) {
    return null;
  }
  return{'match':true};
}
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customer = new Customer();
  customerForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    this.customerForm=this.fb.group({
      firstName: ['',[Validators.required,Validators.minLength(3)]],
      lastName: ['',[Validators.required,Validators.minLength(3)]],

      emailGroup: this.fb.group({
        email: ['',[Validators.required,Validators.email]],
        confirmEmail: ['',Validators.required],
      },{validator:emailMatcher}),

      sendCatalog: [true],
      phone:[''],
      notification: 'email'
    })

    // this.populateTestData()
    console.log(this.customerForm.controls)
  }

  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  // using this code in ngoninit will initialize the form values
  populateTestData(): void{
    this.customerForm.patchValue({
      firstName: 'Haseeb',
      lastName: 'Khan',
      email: 'haseeb@gmail.com',
      sendCatalog: false
    })
  }



  setNotification(notifyVia: string): void{
    const phoneControl=this.customerForm.get('phone')
    if(notifyVia==='text'){
      phoneControl.setValidators(Validators.required)
    }else{
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();

  }

  
}
