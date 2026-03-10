import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
  {
    path: 'splash',
    loadComponent: () => import('./pages/splash/splash.page').then( m => m.SplashPage)
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./pages/onboarding/onboarding.page').then( m => m.OnboardingPage)
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/auth/login/login.page').then( m => m.LoginPage)
      },
      {
        path: 'registration',
        loadComponent: () => import('./pages/auth/registration/registration.page').then( m => m.RegistrationPage)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./pages/auth/forgot-password/forgot-password.page').then( m => m.ForgotPasswordPage)
      },
    ]
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'news-detail/:id',
    loadComponent: () => import('./pages/news-detail/news-detail.page').then( m => m.NewsDetailPage)
  },
  {
    path: 'event-detail/:id',
    loadComponent: () => import('./pages/event-detail/event-detail.page').then( m => m.EventDetailPage)
  },
  {
    path: 'event-registration/:id',
    loadComponent: () => import('./pages/event-registration/event-registration.page').then( m => m.EventRegistrationPage)
  },
  {
    path: 'registration-success/:id',
    loadComponent: () => import('./pages/registration-success/registration-success.page').then( m => m.RegistrationSuccessPage)
  },
  {
    path: 'my-registrations',
    loadComponent: () => import('./pages/my-registrations/my-registrations.page').then( m => m.MyRegistrationsPage)
  },
  {
    path: 'notification-preferences',
    loadComponent: () => import('./pages/notification-preferences/notification-preferences.page').then( m => m.NotificationPreferencesPage)
  },
  {
    path: 'account-privacy',
    loadComponent: () => import('./pages/account-privacy/account-privacy.page').then( m => m.AccountPrivacyPage)
  },
  {
    path: 'data-storage',
    loadComponent: () => import('./pages/data-storage/data-storage.page').then( m => m.DataStoragePage)
  },
  {
    path: 'language-selector',
    loadComponent: () => import('./pages/language-selector/language-selector.page').then( m => m.LanguageSelectorPage)
  },
];
