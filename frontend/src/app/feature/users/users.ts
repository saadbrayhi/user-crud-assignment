
import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../../core/services/users';


@Component({
  selector: 'app-users',
  imports: [],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit{
  private readonly usersService=inject(UsersService);
  ngOnInit(): void {
    this.usersService.getUsers().subscribe({
      next:response=>{
        console.log(response);
      },
      error:error=>{
        console.error(error);
      },
    })
  }
}
