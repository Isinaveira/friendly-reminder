import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  title = 'friendly-reminder';
  user: firebase.User | null = null;

  constructor(
    public afAuth: AngularFireAuth,
    private userService: UserService
  ){
    this.afAuth.authState.subscribe(user=>{
      this.user = user;
      if(user){
        this.userService.setUserId(user.uid);
      }
    });
  }

  login() {
    this.afAuth.signInWithPopup(new 
      firebase.auth.GoogleAuthProvider());
  }

  logout(){
    this.afAuth.signOut();
  }
}
