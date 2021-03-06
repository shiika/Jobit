import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { DataService } from "../../shared/services/data.service";

@Injectable({ providedIn: "root" })

export class UniqueEmailValidator implements AsyncValidator {
    constructor(private dataService: DataService) {}
    

    validate(ctrl: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
        return this.dataService.checkEmail(ctrl.value)
            .pipe(map( value => value ? { duplicated: true } : null))
    }
}