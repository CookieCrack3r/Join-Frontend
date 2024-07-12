import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../interface/user';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface EditableUser extends User {
  selected?: boolean;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],  // Import FormsModule hier
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  users: User[] = [];
  groupedUsers: { [key: string]: User[] } = {};
  selectedUser: User | null = null;
  editableUser: EditableUser | null = null;
  isEditing: boolean = false;
  private userSubscription!: Subscription;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userSubscription = this.userService.getAllUsers().subscribe(users => {
      this.users = users;
      this.groupUsersByAlphabet();
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  groupUsersByAlphabet() {
    this.groupedUsers = this.users.reduce((result, user) => {
      const letter = user.first_name.charAt(0).toUpperCase();
      if (!result[letter]) {
        result[letter] = [];
      }
      result[letter].push(user);
      return result;
    }, {} as { [key: string]: User[] });
  }

  selectUser(user: User) {
    this.selectedUser = user;
    this.editableUser = { ...user };
    this.isEditing = false;
  }

  isSelected(user: User): boolean {
    return this.selectedUser ? this.selectedUser.id === user.id : false;
  }

  getAlphabet(): string[] {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  }

  getInitials(user: any): string {
    const firstNameInitial = user.first_name ? user.first_name.charAt(0).toUpperCase() : '';
    const lastNameInitial = user.last_name ? user.last_name.charAt(0).toUpperCase() : '';
    return firstNameInitial + lastNameInitial;
  }

  enableEditing() {
    if (this.selectedUser) {
      this.editableUser = { ...this.selectedUser };
      this.isEditing = true;
    }
  }

  saveUser() {
    if (this.editableUser) {
      this.userService.updateUser(this.editableUser).subscribe(updatedUser => {
        this.users = this.users.map(user => user.id === updatedUser.id ? updatedUser : user);
        this.groupUsersByAlphabet();
        this.selectedUser = updatedUser;
        this.editableUser = null;
        this.isEditing = false;
      });
    }
  }

  cancelEdit() {
    this.editableUser = this.selectedUser ? { ...this.selectedUser } : null;
    this.isEditing = false;
  }

  deleteUser(user: User) {
    if (confirm(`Are you sure you want to delete ${user.first_name} ${user.last_name}?`)) {
      this.userService.deleteUser(user.id).subscribe(() => {
        this.users = this.users.filter(u => u.id !== user.id);
        this.groupUsersByAlphabet();
        this.selectedUser = null;
        this.editableUser = null;
        this.isEditing = false;
      });
    }
  }

  trackById(index: number, item: User): number {
    return item.id;
  }

  trackByLetter(index: number, letter: string): string {
    return letter;
  }
}
