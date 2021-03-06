import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { salaryValidator } from 'src/app/core/validators/salary.validator';
import { LoginComponent } from 'src/app/login/login.component';
import { SeekerService } from 'src/app/shared/services/seeker.service';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExperienceComponent implements OnInit {
  
  exp: FormGroup = this.fb.group({
    companyName: ["", [Validators.required]],
    salary: ["", [Validators.required, salaryValidator]],
    title: ["", Validators.required],
    jobType: ["Full Time", Validators.required],
    startDate: [null, Validators.required],
    endDate: [null, Validators.required],
  })
  constructor(
    private seeker: SeekerService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LoginComponent>) { }

  ngOnInit(): void {
      
  }

  submitLogin(): void {
    this.seeker.addExp(this.exp.value)
      .subscribe(
        async (res: string) => {
          const swal = (await import("sweetalert2")).default;
          swal.fire({
            title: "Experience has been added",
            icon: "success",
            confirmButtonText: "Done",
            showConfirmButton: true
          })
          .then(value => {
            if (value.isConfirmed) {
              this.dialogRef.close("bananas");
            }
          })
        }
      )
  }

}
