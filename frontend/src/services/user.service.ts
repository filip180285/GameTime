import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  uri = 'http://localhost:4000/users';
  //private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI2LCJ1c2VybmFtZSI6Im5vdmkiLCJuYW1lIjoibm92aSIsImxhc3RuYW1lIjoibm92aSIsInVzZXJUeXBlIjoib3JnYW5pemF0b3IiLCJpYXQiOjE2ODk5NjgwMjgsImV4cCI6MTY4OTk3MTYyOH0.VYEvnNvPwOoJAAaCFGrRCTw5dtfGFQnsOUHrO7sxd3s';

  /**
   * Injects the HTTP client.
   * @param client HTTP client to inject
   */
  constructor(private http: HttpClient) { }

  /**
   * Slanje POST zahteva za prijavu i autentifikaciju.
   * @param {Object} data - objekat sa kredencijalima korisnika
   * @returns {Observable<Object>} Observable odgovora, sa telom kao objektom parsiranim iz JSON-a.
   */
  login(data: Object): Observable<Object> {
    return this.http.post(`${this.uri}/login`, data);
  }

  /**
  * Slanje POST zahteva za registraciju novog korisnika.
  * @param {Object} data - Objekat sa poljima sa informacijama novog korisnika
  * @returns {Observable<Object>} Observable odgovora, sa telom kao objektom parsiranim iz JSON-a.
 */
  register(data: Object): Observable<Object> {
    return this.http.post(`${this.uri}/register`, data);
  }

  /**
   * Slanje POST zahteva za dodavanje profilne slike novog korisnika pri registraciji.
   * @param {formData} FormData - FormData objekat koji sadrzi sliku koja se salje na backend.
   * @returns {Observable<Object>} Observable odgovora, sa telom kao objektom parsiranim iz JSON-a.
   */
  addPicture(formData: FormData): Observable<Object> {
    return this.http.post(`${this.uri}/addPicture`, formData);
  }

  /**
  * Slanje POST zahteva za dohvatanje korisnika.
  * @param {Object} data - Objekat sa poljima sa korisnickim imenom
  * @param {string} token - Token korisnika za autorizaciju
  * @returns {Observable<User>} Observable odgovora, sa telom kao objektom parsiranim iz JSON-a."
 */
  getUser(data: Object, token: string) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.post(`${this.uri}/getUser`, data, { headers });
  }

    /**
  * Slanje GET zahteva za dohvatanje svih korisnika.
  * @param {string} token - Token korisnika za autorizaciju
  * @returns {Observable<User>} Observable odgovora, sa telom kao objektom parsiranim iz JSON-a."
 */
    getAllUsers(token: string) {
      const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
      return this.http.get(`${this.uri}/getAllUsers`, { headers });
    }


  //test
  test(): Observable<Object> {
    return this.http.post(`${this.uri}/test`, {});
  }

  /*testJWT(): Observable<Object> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.token);
    return this.http.post(`${this.uri}/testJWT`, {}, { headers });
  }*/
}
