import { Component, OnInit } from '@angular/core';
import { ReminderListService } from '../services/reminder-list.service';
import { Observable, map, switchMap } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-reminder-list',
  templateUrl: './reminder-list.component.html',
  styleUrl: './reminder-list.component.css',
})
export class ReminderListComponent implements OnInit {
  reminders$!: Observable<any[]>;
  remindersAssignedToMe!: Observable<any[]>;
  remindersAssigned!: Observable<any[]>;
  remindersCompleted!: Observable<any[]>;
  newReminders!: Observable<any[]>;
  expandedReminderIndex: number | null = null;
  showModal = false;
  draggedReminderIndex!: number;
  remindersList: any[] = []; // Lista local de recordatorios

  constructor(
    private readonly reminderListService: ReminderListService,
    private readonly userService: UserService
  ) {}

  ngOnInit() {
    // Obtener los recordatorios desde el servicio y almacenarlos en remindersList
    this.reminders$ = this.reminderListService.getReminders();
    this.reminders$.subscribe((reminders) => {
      this.remindersList = reminders; // Guardamos los recordatorios en una lista local
    });

    // Filtrado para recordatorios específicos del usuario
    this.userService.userId$
      .pipe(
        switchMap((userId) => {
          // Filtrar recordatorios asignados al usuario actual
          this.remindersAssignedToMe = this.reminders$.pipe(
            map((reminders) =>
              reminders.filter((reminder) => reminder.assignedTo === userId)
            )
          );

          // Filtrar recordatorios asignados a otros usuarios
          this.remindersAssigned = this.reminders$.pipe(
            map((reminders) =>
              reminders.filter(
                (reminder) =>
                  reminder.assignedTo != userId && reminder.assignedTo !== ''
              )
            )
          );

          // Filtrar recordatorios sin asignar
          this.newReminders = this.reminders$.pipe(
            map((reminders) =>
              reminders.filter((reminder) => reminder.assignedTo == '')
            )
          );

          return this.reminders$;
        })
      )
      .subscribe();

    // Filtrar recordatorios completados
    this.remindersCompleted = this.reminders$.pipe(
      map((reminders) =>
        reminders.filter((reminder) => reminder.status == 'completed')
      )
    );
  }

  toggleReminder(index: number) {
    this.expandedReminderIndex =
      this.expandedReminderIndex === index ? null : index;
  }

  toggleModal() {
    console.log('muestra ventana');
    this.showModal = !this.showModal;
  }

  drag(event: DragEvent, index: number) {
    this.draggedReminderIndex = index;
    event.dataTransfer?.setData('text/plain', String(index));
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  drop(event: DragEvent, listType: string) {
    event.preventDefault();

    const fromIndex = this.draggedReminderIndex;
    const movedReminder = this.remindersList[fromIndex];

    // Verificar si el movimiento es válido y actualizar el recordatorio
    if (listType === 'assignedToMe' && movedReminder.status === 'new') {
      movedReminder.assignedTo = 'user_id'; // Cambia 'user_id' con el ID real del usuario
    } else if (listType === 'completed') {
      movedReminder.status = 'completed';
    } else {
      return; // No hacer nada si el movimiento no es permitido
    }

    // Remover el recordatorio de su lista original
    this.remindersList.splice(fromIndex, 1);

    // Llamar al servicio para actualizar el backend
    this.reminderListService.updateReminder(movedReminder);
  }
}
