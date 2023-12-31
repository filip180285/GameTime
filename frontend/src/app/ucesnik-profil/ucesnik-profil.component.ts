import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { User } from 'src/models/user';
import { Event } from 'src/models/event';
import { UserService } from 'src/services/user.service';

import jwt_decode from "jwt-decode";
import { EventService } from 'src/services/event.service';

@Component({
  selector: 'app-ucesnik-profil',
  templateUrl: './ucesnik-profil.component.html',
  styleUrls: ['./ucesnik-profil.component.css']
})
export class UcesnikProfilComponent implements OnInit {

  /**
  * Injects the API service and Angular Router.
  * @param userService API service to inject
  * @param router Angular Router to inject
  */
  constructor(private userService: UserService, private eventService: EventService, private router: Router) { }

  // ulogovani korisnik
  loggedIn: User;
  // prethodna ucesca i dugovanja
  events: Event[] = [];
  totalOwing: number = 0;

  /**
   * Poziva se pri ucitavanju komponente.
   * @returns {Promise<void>} Promise objekat koji se izvrsava kada je komponenta ucitana.
   */
  async ngOnInit(): Promise<void> {
    const token: string = sessionStorage.getItem("token");
    if (token == null) return;

    try {
      const decodedToken: any = jwt_decode(token);
      const data = { username: decodedToken.username };
      const response: any = await lastValueFrom(this.userService.getUser(data, token));
      this.loggedIn = response;
      const responseEvents: any = await lastValueFrom(this.eventService.getAllPreviousEventsForParticipant(data, token));
      this.events = responseEvents;
      this.totalOwing = this.events.reduce((total, event) => {
        if (!event.paid.includes(this.loggedIn.username)) {
          total += event.pricePerUser;
        }
        return total;
      }, 0);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Konvertuje milisekunde u datum i vreme radi prikaza na stranici.
   * @param {number} numOfMs - Datum i vreme u milisekundama
   * @returns {Date} Datum i vreme kao objekat tipa Date
    */
  convertToDate(numOfMs: number): Date {
    return new Date(numOfMs);
  }

}
