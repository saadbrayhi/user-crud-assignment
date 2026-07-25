import { TableModule } from 'primeng/table';
import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../../core/services/users';
import { User } from '../../core/services/models/user.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-users',
  imports: [TableModule],
  templateUrl: './users.html',
  styleUrl: './users.css',


})
export class Users implements OnInit{
  private readonly usersService=inject(UsersService);
  private readonly chdR=inject(ChangeDetectorRef)
  users:User[]=[];
  totalRecords=0;
  loading=true;

  ngOnInit(): void {
    this.usersService.getUsers().subscribe({
      next:response=>{
      this.users=response.data;
      this.totalRecords=response.meta.totalItems;
      this.loading=false;
      this.chdR.detectChanges();
      console.log(response);
      },
      error:error=>{
        this.loading=false;
        this.chdR.detectChanges();
        console.error(error);
      },
    })
  }
}
