import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../shared/services/data.service';
import { AuthService } from "../../shared/services/auth.service";
import { UniqueEmailValidator } from "../../shared/validators/email.validator";
import { UniquePhoneValidator } from "../../shared/validators/phone.validator";
import { numberValidator } from "../../shared/validators/number.validator";
import { salaryValidator } from "../../shared/validators/salary.validator";
import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSelect } from '@angular/material/select';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from 'src/app/login/login.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../../../assets/scss/media/_register.scss']
})
export class RegisterComponent implements OnInit {
  @ViewChild("chipList", { static: true }) chipList: MatChipList;
  @ViewChild("typesList", { static: true }) typesList: MatChipList;
  @ViewChild("skillsList", { static: true }) skillsList: MatChipList;
  @ViewChild("stepper", { static: true }) stepper: MatStepper;
  @ViewChild("eduList", { static: true }) eduList: MatChipList;
  @ViewChild("student", { static: true }) student: ElementRef;
  @ViewChild("bachelor", { static: true }) bachelor: ElementRef;
  @ViewChild("langName", { static: true }) langName: MatSelect;
  @ViewChild("langLevel", { static: true }) langLevel: MatSelect;
  jobTypes: string[] = ["Full Time", "Part Time", "Internship", "Work From Home", "Freelance"];
  languages: string[] = ["Arabic", "English", "French", "Italian"];
  steps: string[] = ["General Info", "Career Interests", "Professional Info"];
  expYears: string[] = Array.from({length: 10}, (value, index) => `${index + 1} Years`);
  seperatorKeyCodes: number[] = [ENTER, COMMA];
  generalInfo: FormGroup = this.fb.group({
    first_name: ["", [Validators.required, Validators.minLength(3)]],
    last_name: ["", [Validators.required, Validators.minLength(3)]],
    birth_date: [null, [Validators.required]],
    gender: ["", [Validators.required]],
    location: ["", [Validators.required]],
    marital_status: ["", [Validators.required]],
    military_status: ["", [Validators.required]],
    phone: ["", 
            [numberValidator, 
              Validators.minLength(11)], 
              new UniquePhoneValidator(this.dataService).validate.bind(this)
            ],
    email: [
      "", 
      [Validators.required, Validators.email], 
       new UniqueEmailValidator(this.dataService).validate.bind(this)
    ],
    password: ["", [Validators.required, Validators.minLength(8)]],
  });

  careerInterests: FormGroup = this.fb.group({
    min_salary: ["", salaryValidator.bind(this)],
    
    status: ["", Validators.required],
    careerLevel: ["", Validators.required],

    jobTypes: this.fb.array([
      this.fb.control("Full Time")
    ], [Validators.minLength(1), Validators.required]),

    expYears: [0, [Validators.min(0), Validators.max(15), Validators.required]],
    educationLevel: ["", Validators.required],
  });

  profInfo: FormGroup = this.fb.group({
    jobTitles: this.fb.array([
      this.fb.control("frontend"),
    ], { validators: [Validators.required, Validators.minLength(2), Validators.maxLength(5)] }),
    langs: this.fb.array([
      
    ], [Validators.minLength(2), Validators.required]),
    skills: this.fb.array([
      this.fb.control("Teamwork")
    ], [Validators.required, Validators.minLength(2), Validators.maxLength(20)]),
    qualification: this.fb.group({
      degreeLevel: ["", Validators.required],
      institution: ["", Validators.required],
      fieldOfStudy: ["", Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      gradGrade: ["", Validators.required],
    }, Validators.required)
  })
  isConfidential: boolean = false;
  isLocationValid: boolean = true;

  constructor(
    private fb: FormBuilder, 
    private dataService: DataService, 
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router) {
  }

  ngOnInit(): void {
    this.student.nativeElement.click();
    this.bachelor.nativeElement.click();
    console.log(this.generalInfo)
  }

  setConfidential(event: MatCheckboxChange): void {
    this.isConfidential = !this.isConfidential;
    if (event.checked) {
      this.careerInterests.get("min_salary").disable();
      this.careerInterests.get("min_salary").setValue("Confidential");
    } else {
      this.careerInterests.get("min_salary").enable();
      this.careerInterests.get("min_salary").setValue("");
    }
  }

  addTitle(e: MatChipInputEvent): void {
    const value: string = e.value.trim().toLowerCase();
    const control: FormControl = new FormControl(value, Validators.minLength(3));
    if (control.valid && !this.jobTitles.controls.find(control => control.value === value)) {
      this.jobTitles.push(control);
      e.input.value = "";
    } else {
      e.input.value = ""
    }
    console.log(this.careerInterests);
  }

  addSkill(e: MatChipInputEvent): void {
    const value = e.value.trim();
    const control = new FormControl(value, Validators.minLength(3));
    if (control.valid) {
      this.skills.push(control);
      e.input.value = "";
    }
    console.log(this.careerInterests);
  }

  get jobTitles(): FormArray {
    return this.profInfo.get("jobTitles") as FormArray
  }

  get langs(): FormArray {
    return this.profInfo.get("langs") as FormArray
  }

  get skills(): FormArray {
    return this.profInfo.get("skills") as FormArray
  }

  get qualification(): FormGroup {
    return this.profInfo.get("qualification") as FormGroup
  }

  selectLevel(e: any) {
    const value = e.target["innerText"];
    this.chipList.value = value;
    this.careerInterests.get("careerLevel").setValue(this.chipList.value);
  }

  selectDegree(e: any) {
    const value = e.target["innerText"];
    this.eduList.value = value;
    this.careerInterests.get("educationLevel").setValue(this.eduList.value);
  }

  selectType(e: any, i: number) {
    const value: string = e.target["innerText"];
    if (!this.typesList.value?.includes(value) ) {
      (this.careerInterests.get("jobTypes") as FormArray).push(new FormControl(value));
      this.typesList.value = this.careerInterests.get("jobTypes").value;
    } else {
      this.typesList.value = this.typesList.value.filter((item: string) => item != value);
      (this.careerInterests.get("jobTypes") as FormArray).clear();
      for (let type of this.typesList.value) {
        (this.careerInterests.get("jobTypes") as FormArray).push(new FormControl(type))
      }
    }
  }

  selectSkill(e: any, i: number) {
    const value: string = e.target["innerText"];
    if (!this.skillsList.value?.includes(value) ) {
      (this.profInfo.get("skills") as FormArray).push(new FormControl(value));
      this.skillsList.value = this.profInfo.get("skills").value;
    } else {
      this.skillsList.value = this.skillsList.value.filter((item: string) => item != value);
      (this.profInfo.get("skills") as FormArray).clear();
      for (let type of this.skillsList.value) {
        (this.profInfo.get("skills") as FormArray).push(new FormControl(type))
      }
    }
  }

  addLang(name: string, level: string): void {
    this.langName.options.changes.subscribe(v => console.log(v));
    this.langs.push(this.fb.group({
      name: this.fb.control(name, Validators.required),
      proficiency: this.fb.control(level, Validators.required)
    }, Validators.required));
    this.langName.writeValue(null);
    this.langLevel.writeValue(null);
    this.languages = this.languages.filter(item => item !== name);
  }

  removeLang(index: number, value: string): void {
    this.langs.removeAt(index);
    this.languages.push(value);
    console.log(this.languages)
  }

  isDisabled(lang: string): boolean {
    return this.languages.some(item => item === lang);
  }

  async submitForm(form: {[key: string]: string}, action: string): Promise<void> {
    this.authService.registerForm(form, action)
    .subscribe(
      async (res: string) => {
        if (action === "addProf") {
            const swal = (await import("sweetalert2")).default;
            swal.fire({
              title: "Now you can start your journey",
              text: "You have successfully signed up",
              icon: "success",
              confirmButtonText: "Find jobs",
              denyButtonText: "Return to homepage",
              showConfirmButton: true,
              showDenyButton: true
              // buttons: ["Return to homepage", "Find jobs"]
            })
            .then(value => {
              if (value.isConfirmed) {
                this.dialog.open(LoginComponent, {
                  width: "900px"
                })
              } else if (value.isDenied) {
                this.router.navigate(["/home"])
              }
            })
          }
          this.stepper.next();
          console.log(res);
        },
        (error: any) => {
          console.log(error);
        });
  }

}
