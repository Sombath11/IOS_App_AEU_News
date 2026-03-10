import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'events',
        loadComponent: () =>
          import('../pages/events/events.page').then((m) => m.EventsPage),
      },
      {
        path: 'alerts',
        loadComponent: () =>
          import('../pages/alerts/alerts.page').then((m) => m.AlertsPage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../pages/profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('../pages/settings/settings.page').then((m) => m.SettingsPage),
      },
      {
        path: 'bookmarks',
        loadComponent: () =>
          import('../pages/bookmarks/bookmarks.page').then((m) => m.BookmarksPage),
      },
      {
        path: 'academic-records',
        loadComponent: () =>
          import('../pages/academic-records/academic-records.page').then((m) => m.AcademicRecordsPage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
];
