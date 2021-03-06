import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployerGuard } from '../core/guards/employer.guard';
import { JobSeekerComponent } from '../job-seeker/job-seeker.component';
import { LangsResolverService } from '../shared/services/resolvers/langs-resolver.service';
import { ProfileResolverService } from '../shared/services/resolvers/profile.resolver.service';
import { SkillsResolverService } from '../shared/services/resolvers/skills-resolver.service';
import { SavedComponent } from './saved/saved.component';
import { EmpWorkComponent } from './emp-work.component';
import { EmployeesComponent } from "./employees/employees.component";
import { JobPostComponent } from './job-post/job-post.component';
import { JobsComponent } from './jobs/jobs.component';

const routes: Routes = [
    {
        path: "", component: EmpWorkComponent, canActivate: [EmployerGuard], children: [
          {
            path: "saved", component: SavedComponent
          },
          {
            path: "emps", component: EmployeesComponent
          },
          {
            path: "jobs", component: JobsComponent
          },
          {
            path: "seeker/:id", 
            component: JobSeekerComponent,
            resolve: { 
              profile: ProfileResolverService,
              skills: SkillsResolverService,
              langs: LangsResolverService,
            }
          },
          {
            path: "post", component: JobPostComponent
          }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpWorkRoutingModule { }
