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
          {
            path: 'songs/sheet',
            loadComponent: () => import('./pages/sheet/sheet.page').then( m => m.SheetPage)
          },
        ]
      }
    ],
    runGuardsAndResolvers: 'always'
  }
];
