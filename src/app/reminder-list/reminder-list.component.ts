import { Component } from '@angular/core';
import { ReminderListService } from '../services/reminder-list.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, map, switchMap } from 'rxjs';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-reminder-list',
  templateUrl: './reminder-list.component.html',
  styleUrl: './reminder-list.component.css',
})
export class ReminderListComponent {
  reminders$!: Observable<any[]>;
  remindersAssignedToMe!: Observable<any[]>;
  remindersAssigned!: Observable<any[]>;
  remindersCompleted!: Observable<any[]>;
  newReminders!: Observable<any[]>;
  expandedReminderIndex: number | null = null; //Cambia el índice expandido
  showModal = false;
  draggedReminder!: any;

  constructor(
    private readonly reminderListService: ReminderListService,
    private readonly userService: UserService
  ) {}

  ngOnInit() {
    this.reminders$ = this.reminderListService.getReminders();

    this.userService.userId$
      .pipe(
        switchMap((userId) => {
          //Filtramos la lista de reminders por las que están asignadas al usuario
          this.remindersAssignedToMe = this.reminders$.pipe(
            map((reminders) =>
              reminders.filter((reminder) => reminder.assignedTo === userId)
            )
          );

          //Filtramos la lista de reminders por las que no están asignadas al usuario
          this.remindersAssigned = this.reminders$.pipe(
            map((reminders) =>
              reminders.filter(
                (reminder) =>
                  reminder.assignedTo != userId && reminder.assignedTo !== ''
              )
            )
          );

          this.newReminders = this.reminders$.pipe(
            map((reminders) =>
              reminders.filter((reminder) => reminder.assignedTo == '')
            )
          );

          //retornamos un observable vacío ya que los filtros ya se han aplicado
          return this.reminders$;
        })
      )
      .subscribe();

    //Filtramos la lista de reminders completados
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
    this.draggedReminder = index;
    event.dataTransfer?.setData('text/plain', String(index)); // Gurda el índice en el dataTransfer
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  drop(event: DragEvent, listType: string) {
    event.preventDefault();

    const fromIndex = this.draggedReminder;

    let remindersList: any[];
    let targetList: Observable<any[]>;

    // Obtén la lista de recordatorios desde el Observable
    this.reminders$.subscribe((reminders) => {
      remindersList = reminders; // Aquí guardamos los recordatorios en un array

      switch (listType) {
        case 'newReminders':
          targetList = this.reminders$; // Puedes crear un Observable específico si lo necesitas
          break;
        case 'assignedTasks':
          targetList = this.remindersAssigned;
          break;
        case 'assignedToMe':
          targetList = this.remindersAssignedToMe;
          break;
        case 'completed':
          targetList = this.remindersCompleted;
          break;
        default:
          return;
      }

      // Lógica para mover el recordatorio a la nueva lista
      if (remindersList && remindersList.length > 0) {
        const movedReminder = remindersList[fromIndex];

        // Eliminar el recordatorio de la lista original
        remindersList.splice(fromIndex, 1);

        // Aquí deberías agregar el recordatorio a la nueva lista
        // Esto puede implicar un método en tu servicio para actualizar la base de datos
        // Por ejemplo: this.reminderListService.updateReminders(updatedList);

        // Asegúrate de actualizar también la UI después de hacer los cambios en la base de datos
      }
    });
  }
}
