import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime} from 'rxjs/operators'
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
  emailMessage:string='';

  private validationMessage={
    required: 'Please enter your email address',
    email: 'Please enter a valid email address'
  }

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

    this.customerForm.get('notification').valueChanges.subscribe(
      value=>this.setNotification(value)
    )

    const emailControl=this.customerForm.get('emailGroup.email');
    emailControl.valueChanges
    .pipe(
      debounceTime(1000)
    )
    .subscribe(
      value=>this.setMessage(emailControl)
    );
  }

  setMessage(c: AbstractControl):void{
    this.emailMessage='';
    if((c.touched||c.dirty)&&c.errors){
      this.emailMessage= Object.keys(c.errors).map(
        key=>this.validationMessage[key]).join('')
    }
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
