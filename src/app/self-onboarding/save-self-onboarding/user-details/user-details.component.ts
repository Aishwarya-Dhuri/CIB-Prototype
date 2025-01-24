import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserDetails } from '../../@models/self-onboarding.model';
import { SelfOnboardingService } from '../../@services/self-onboarding.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  addUserSidebar: boolean = false;
  editUserSidebar: boolean = false;
  editUserIndex: number = null;

  user: UserDetails = {
    firstName: '',
    lastName: '',
    userId: '',
    gender: '',
    emailId: '',
    mobileNumber: '',
    accessRole: '',
    profile: '',
    authorizationLogic: '',
    currency: 'INR',
    authorizationLimit: '',
    receiveAlerts: false,
  };

  users: UserDetails[];

  constructor(private selfOnboardingService: SelfOnboardingService) {}

  ngOnInit(): void {
    this.users = this.selfOnboardingService.selfOnboarding.userDetails;
  }

  onAddUser() {
    this.users.push({ ...this.user });

    this.onAddUserCancel();
  }

  onAddUserCancel() {
    this.user = {
      firstName: '',
      lastName: '',
      userId: '',
      gender: '',
      emailId: '',
      mobileNumber: '',
      accessRole: '',
      profile: '',
      authorizationLogic: '',
      currency: 'INR',
      authorizationLimit: '',
      receiveAlerts: false,
    };
    this.addUserSidebar = false;
    this.editUserSidebar = false;
    this.editUserIndex = null;
  }

  onSaveEditUser() {
    this.users[this.editUserIndex] = { ...this.user };
    this.onAddUserCancel();
  }

  onDeleteUser(i: number) {
    this.users.splice(i, 1);
  }

  onEditUser(user: any, i: number) {
    this.user = user;
    this.editUserSidebar = true;
    this.editUserIndex = i;
  }

  getUserInitials(user: any) {
    return user.firstName.substring(0, 1) + user.lastName.substring(0, 1);
  }

  isValidate() {
    return this.users.length > 0;
  }

  ngOnDestroy() {
    this.selfOnboardingService.selfOnboarding.userDetails = this.users;
  }
}
