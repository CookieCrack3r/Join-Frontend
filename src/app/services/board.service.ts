import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  constructor(private http: HttpClient) { }

  checkAndCreateBoard(boardId: number, title: string, description: string): Observable<any> {
    const url = environment.baseUrl + "/api/boards/check_board_default/";
    const body = {
      id: boardId,
      title: title,
      description: description
    };
    return this.http.post(url, body);
  }
}
