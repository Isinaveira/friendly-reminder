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

  // Actualizar un recordatorio existente
  updateReminder(reminder: any) {
    const reminderId = reminder.id; // Asumimos que cada recordatorio tiene un campo 'id' único
    delete reminder.id; // Eliminamos el 'id' antes de la actualización

    return this.firestore.collection('reminders').doc(reminderId).update(reminder);
  }
}
