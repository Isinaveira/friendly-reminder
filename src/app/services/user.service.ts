import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userIdSource = new BehaviorSubject<string | null>(null);
  userId$ = this.userIdSource.asObservable();

  setUserId(userId:string){
    this.userIdSource.next(userId);
  }
  
}
