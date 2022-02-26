import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, NoAuthGuard } from '@core/guards';
import { ROUTER_UTILS } from '@core/utils/router.utils';
import { NotFoundModule } from '@shell/ui/not-found/not-found.module';
import { FooterModule } from '../ui/footer/footer.module';
import { HeaderModule } from '../ui/header/header.module';
import { LayoutModule } from '../ui/layout/layout.module';
import { NotFoundPage } from '../ui/not-found/not-found.page';

const APP_ROUTES: Routes = [
  {
    path: ROUTER_UTILS.config.auth.root,
    loadChildren: async () =>
      (await import('@pages/auth/auth.module')).AuthModule,
    canLoad: [NoAuthGuard],
  },
  {
    path: ROUTER_UTILS.config.base.home,
    loadChildren: async () =>
    (await import('@pages/home/home.module')).HomeModule,
    canLoad: [NoAuthGuard],

  },
  {
    path: ROUTER_UTILS.config.base.dashboard,
    loadChildren: async () =>
      (await import('@pages/dashboard/dashboard.module')).DashboardModule,
    canLoad: [AuthGuard],
  },
  {
    path: ROUTER_UTILS.config.settings.root,
    loadChildren: async () =>
      (await import('@pages/settings/settings.module')).SettingsModule,
    canLoad: [AuthGuard],
  },
  {
    path: ROUTER_UTILS.config.user.root,
    loadChildren: async () =>
      (await import('@pages/user/user.module')).UserModule,
    canLoad: [AuthGuard],
  },
  {
    path: ROUTER_UTILS.config.employee.root,
    loadChildren: async () =>
      (await import('@pages/employee/employee.module')).EmployeeModule,
    canLoad: [AuthGuard],
  },
  {
    path: ROUTER_UTILS.config.clean_service.root,
    loadChildren: async () =>
      (await import('@pages/clean-service/clean-service.module')).CleanServiceModule,
    canLoad: [AuthGuard],
  },
  {
    path: ROUTER_UTILS.config.discount_service.root,
    loadChildren: async () =>
      (await import('@pages/discount-service/discount-service.module')).DiscountServiceModule,
    canLoad: [AuthGuard],
  },
  {
    path: ROUTER_UTILS.config.task.root,
    loadChildren: async () =>
      (await import('@pages/task/task.module')).TaskModule,
    canLoad: [AuthGuard],
  },
  {
    path: ROUTER_UTILS.config.notify.root,
    loadChildren: async () =>
      (await import('@pages/notify/notify.module')).NotifyModule,
    canLoad: [AuthGuard],
  },
  {
    path: ROUTER_UTILS.config.calendar.root,
    loadChildren: async () =>
      (await import('@pages/calendar/calendar.module')).CalendarsModule,
    canLoad: [AuthGuard],
  },
  {
    path: '**',
    loadChildren: async () =>
      (await import('@shell/ui/not-found/not-found.module')).NotFoundModule,
    component: NotFoundPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(APP_ROUTES),
    FooterModule,
    HeaderModule,
    LayoutModule,
    NotFoundModule,
  ],
  exports: [
    RouterModule,
    FooterModule,
    HeaderModule,
    LayoutModule,
    NotFoundModule,
  ],
})
export class WebShellModule { }
