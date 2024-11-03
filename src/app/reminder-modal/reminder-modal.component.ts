import { Component } from '@angular/core';
import { ReminderListService } from '../services/reminder-list.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-reminder-modal',
  templateUrl: './reminder-modal.component.html',
  styleUrl: './reminder-modal.component.css'
})
export class ReminderModalComponent {
  reminderForm: FormGroup;
  reminders$!: Observable<any[]>;
  expandedReminderIndex: number | null = null; //Cambia el índice expandido
  showModal: boolean = false;


  constructor(
    private reminderListService: ReminderListService, 
    private fb:FormBuilder,
    private userService: UserService
  ){
    this.reminderForm = this.fb.group({
      title: [''],
      content: [''],
      userId: [''],
      createdAt: new Date(Date.now())
                .toLocaleString('en-En',
                  {
                    weekday: 'short', 
                    year: 'numeric', 
                    month: 'long', 
                    day:'numeric'
                  }),
      status: 'not started'
    })

  }

  ngOnInit() {
    this.userService.userId$.subscribe(userId => {
      this.reminderForm.patchValue({ userId: userId})
    });
  }
  
  addReminder(){
    if(this.reminderForm.valid){
      console.log(this.reminderForm.value);
      this.reminderListService.addReminder(this.reminderForm.value);
      this.reminderForm.reset();
    }
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  
}

