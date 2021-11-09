import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { AddComponent } from './components/add/add.component';
import { ListComponent } from './components/list/list.component';
import { UserRoutingModule } from './user-routing.module';
import { EditComponent } from './components/edit/edit.component';
import { UserProfileComponent } from './components/user-profile/components/user-profile/user-profile.component';
import { ProfileEditComponent } from './components/user-profile/components/edit/profile-edit.component';
import { UserProfileService } from './components/user-profile/userprofile.service';
import { EditProfileResolveService } from './components/user-profile/resolver/edit-profile-resolve.service';
import { AuthService } from '../../auth/auth.service';

@NgModule({
  declarations: [
    ListComponent,
    EditComponent,
    AddComponent,
    UserProfileComponent,
    ProfileEditComponent,
  ],
  imports: [CommonModule, UserRoutingModule, SharedModule],
  providers: [UserProfileService, EditProfileResolveService, AuthService],
})
export class UserModule {}
