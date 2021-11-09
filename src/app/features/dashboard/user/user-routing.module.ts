import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddComponent } from './components/add/add.component';
import { ListComponent } from './components/list/list.component';
import { EditComponent } from './components/edit/edit.component';
import { ProfileEditComponent } from './components/user-profile/components/edit/profile-edit.component';
import { UserProfileComponent } from './components/user-profile/components/user-profile/user-profile.component';
import { EditProfileResolveService } from './components/user-profile/resolver/edit-profile-resolve.service';

const routes: Routes = [
  { path: '', component: ListComponent, data: { title: 'All' } },
  { path: ':id/edit', component: EditComponent, data: { title: 'Edit' } },
  {
    path: ':id/add-role',
    component: AddComponent,
    data: { title: 'Add Role' },
  },
  {
    path: 'edit/profile',
    component: ProfileEditComponent,
    data: { title: 'Profile Edit' },
    resolve: {
      user: EditProfileResolveService,
    },
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    data: { title: 'Profile' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
