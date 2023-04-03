import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/menu/menu.page').then(m => m.MenuPage),
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
      },
      {
        path: '',
        loadComponent: () => import('./pages/tabs/tabs.page').then( m => m.TabsPage),
        children: [
          {
            path: '',
            redirectTo: 'tuner',
            pathMatch: 'full',
          },
          {
            path: 'tuner',
            loadComponent: () => import('./pages/tuner/tuner.page').then( m => m.TunerPage)
          },
          {
            path: 'metronome',
            loadComponent: () => import('./pages/metronome/metronome.page').then( m => m.MetronomePage)
          },
          {
            path: 'songs',
            loadComponent: () => import('./pages/songs/songs.page').then( m => m.SongsPage)
          },
        ]
      }
    ]
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then( m => m.SettingsPage)
  },
  {
    path: 'help',
    loadComponent: () => import('./pages/help/help.page').then( m => m.HelpPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
];
