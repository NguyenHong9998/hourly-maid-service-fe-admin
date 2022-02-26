import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterModule } from '@angular/router';
import { RandomcolorModule } from 'angular-randomcolor';
import { ChartsModule } from 'ng2-charts';
import { MaterialExampleModule } from 'src/app/material.module';
import { DashboardPage } from './dashboard.page';

@NgModule({
  declarations: [DashboardPage],
  imports: [
    CommonModule,
    MaterialExampleModule,
    ChartsModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    RandomcolorModule,
    
    RouterModule.forChild([
      {
        path: '/dasboard',
        component: DashboardPage,
        data: {
          title: 'Dashboard',
          robots: 'noindex, nofollow',
        },
      },
    ]),
  ],
})
export class DashboardModule { }
