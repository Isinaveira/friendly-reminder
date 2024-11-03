import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, switchMap } from 'rxjs';
import { UserService } from './user.service';
@Injectable({
  providedIn: 'root'
})
export class ReminderListService {

  constructor(
    private firestore: AngularFirestore,
    private userService: UserService
  
  ) { }

  getReminders(): Observable<any[]> {
    return this.firestore.collection('reminders').valueChanges();    
  }


  addReminder(reminder: any) {
    return this.firestore.collection('reminders').add(reminder);
  }

}
