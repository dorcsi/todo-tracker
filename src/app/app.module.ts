import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { AgGridModule } from 'ag-grid-angular';
import { AppComponent } from './app.component';
import { DeleteRowRenderer } from './ag-grid-components/delete-row-renderer/delete-row-renderer.component';
import { DateTimeRenderer } from './ag-grid-components/date-time-renderer/date-time-renderer.component';
import { CalendarViewComponent } from './components/calendar-view-component/calendar-view.component';
import { MonthSelectorRenderer } from './ag-grid-components/month-selector-renderer/month-selector-renderer.component';
import { MessagingService } from './messaging-service/messaging.service'
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
 declarations: [
   AppComponent,
   DeleteRowRenderer,
   DateTimeRenderer,
   CalendarViewComponent,
   MonthSelectorRenderer
 ],
 imports: [
   BrowserModule,
   HttpClientModule,
   AgGridModule,
   NoopAnimationsModule,
   MatInputModule,
   MatFormFieldModule,
   FormsModule,
   ReactiveFormsModule
 ],
 providers: [MessagingService],
 bootstrap: [AppComponent]
})
export class AppModule { }
