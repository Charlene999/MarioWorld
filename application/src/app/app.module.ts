import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ItemsComponent } from './items/items.component';
import { CharactersComponent } from './characters/characters.component';
import { ClassesComponent } from './classes/classes.component';
import { UsersComponent } from './users/users.component';
import { ViewUsersComponent } from './view-users/view-users.component';
import { AdminAddComponent } from './admin-add/admin-add.component';
import { AdminDeleteComponent } from './admin-delete/admin-delete.component';
import { CreateCharactersComponent } from './characters/create-characters/create-characters.component';
import { PasswordComponent } from './users/users-edit/password/password.component';
import { NameComponent } from './users/users-edit/name/name.component';
import { EmailComponent } from './users/users-edit/email/email.component';
import { CharactersItemsComponent } from './characters/characters-items/characters-items.component';
import { HelpComponent } from './help/help.component';
import { UnoGamePlayComponent } from './uno-game-play/uno-game-play.component';
import { MinesweeperGamePlayComponent } from './minesweeper-game-play/minesweeper-game-play.component';

@NgModule({
  //Components
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ItemsComponent,
    CharactersComponent,
    ClassesComponent,
    UsersComponent,
    CreateCharactersComponent,
    ViewUsersComponent,
    AdminAddComponent,
    AdminDeleteComponent,
    PasswordComponent,
    NameComponent,
    EmailComponent,
    HomeComponent,
    CharactersItemsComponent,
    HelpComponent,
    UnoGamePlayComponent,
    MinesweeperGamePlayComponent,
  ],
  //Modules
  imports: [
    BrowserModule,
	  HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    Ng2SearchPipeModule
  ],
  //Services and Injectables
  providers: [],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
