import { animate, query, stagger, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { debounceTime } from "rxjs/operators";
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss', "../../assets/scss/media/_navbar.scss"],
  animations: [
    trigger("navbarCollapse", [
      state("collapseStart", style({
        opacity: 0
      })),

      state("collapseEnd", style({
        opacity: 1
      })),
      transition(":enter", [
        animate("300ms")
      ]),
      transition(":leave", [
        animate("300ms")
      ])
    ]
    ),
    trigger("buttonsAnimation", [
      transition(":enter", [
        query(".navbar-nav .nav-item button, .navbar-nav .nav-item a", [
          style({
            opacity: 0,
            transform: "translateX(30px)"
          }),
          stagger(150, [
            animate("300ms", style({
              opacity: 1,
              transform: "translateX(0px)"
            }))
          ])
        ],
        ),
      ]),
      transition(":leave", [
        query(".navbar-nav .nav-item button, .navbar-nav .nav-item a", [
          style({
            opacity: 1,
            transform: "translateX(0px)"
          }),
          stagger(50, [
            animate("300ms", style({
              opacity: 0,
              transform: "translateX(30px)"
            }))
          ])
        ],
        ),
      ])
    ]),
    trigger("navbarDisplay", [
      state("navUp", style({
        transform: 'translateY(-70px)'
      })),
      state("navDown", style({
        transform: "translateY(0px)"
      })),

      transition("navUp <=> navDown", [
        animate("0.3s")
      ])
    ])
  ]
})
export class NavbarComponent implements OnInit {
  isCollapsed: boolean = false;
  navbarState: string = "navDown";
  isLoggedIn: boolean = false;
  userType: string;
  @ViewChild("navbar", {static: true}) navbarElement: ElementRef;
  lastScrollY: number = 0;

  constructor(public dialog: MatDialog, private auth: AuthService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.auth.logState;
    this.auth.$user
      .subscribe(
        (type: string) => {
          this.userType = type;
        }
      )
    window.innerWidth >= 992 ? this.isCollapsed = true : this.isCollapsed = false;
    const scrollEvent = fromEvent(window, "scroll");
    scrollEvent.pipe(
      debounceTime(17)
    ).subscribe(
      e => {
        const scrollY = window.scrollY;
        if (scrollY >= this.lastScrollY && scrollY > this.navbarElement.nativeElement.clientHeight) {
          this.navbarState = "navUp";
        } else {
          this.navbarState = "navDown";
        }

        this.lastScrollY = scrollY;
      }
    )
  }

  toggleLogin(event: Event): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: "900px"
    });
    this.isCollapsed = window.innerWidth >= 992 ? true : false;


    dialogRef.afterClosed().subscribe(_ => {
      console.log("Login has been closed!");
    })
  }

  getText(): string {
    return this.userType === "job_seeker" ? "Find Jobs" : "Find Employees"
  }

  getLink(): string {
    return this.userType === "job_seeker" ? "/work/explore" : "/find/emps"
  }

  toggleNavbar(e: any) {
    this.isCollapsed = (e.target.className.includes("navbar-collapse") && window.innerWidth < 992) ? false : true;
  }

  logout(): void {
    this.auth.logout();
  }

}
