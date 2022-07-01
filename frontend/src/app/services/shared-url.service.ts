import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class SharedUrlService {

  private previousUrl: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public previousUrl$: Observable<string> = this.previousUrl.asObservable();

  constructor() { }
  
  proId: String;
  typecode: String;
  level: String;

  setPreviousUrl(previousUrl: string) {
    this.previousUrl.next(previousUrl);
  }

  
}
