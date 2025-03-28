import { Routes } from '@angular/router';
import { ROUTE_SECTIONS, hasUnsavedChangesGuardFn, leavingRunningSchemeGuardFn } from '@app/shared-misc';
import { NotFoundPageComponent } from '@app/not-found';

export const ROUTES: Routes = [
  {
    path: ROUTE_SECTIONS.root,
    loadComponent: () => import('@app/main').then((m) => m.MainPageComponent),
    pathMatch: 'full',
  },
  {
    path: ROUTE_SECTIONS.about,
    loadComponent: () => import('@app/about').then((m) => m.AboutPageComponent),
    pathMatch: 'full',
  },
  {
    path: ROUTE_SECTIONS.help,
    loadComponent: () => import('@app/help').then((m) => m.HelpPageComponent),
    pathMatch: 'full',
  },
  {
    path: ROUTE_SECTIONS.steamDeckInstallationManual,
    loadComponent: () => import('@app/help').then((m) => m.SteamDeckHelpPageComponent),
    pathMatch: 'full',
  },
  {
    path: ROUTE_SECTIONS.controllers,
    children: [
      {
        path: '',
        loadComponent: () => import('@app/controllers-list').then((m) => m.ControllersListPageComponent),
        pathMatch: 'full',
      },
      {
        path: [':id'].join('/'),
        loadComponent: () => import('@app/controller-view').then((m) => m.ControllerViewPageComponent),
        pathMatch: 'full',
      },
    ],
  },
  {
    path: ROUTE_SECTIONS.hubs,
    children: [
      {
        path: '',
        loadComponent: () => import('@app/hubs-list').then((m) => m.HubsListPageComponent),
        pathMatch: 'full',
      },
      {
        path: [':id'].join('/'),
        loadComponent: () => import('@app/hub-view').then((m) => m.HubViewPageComponent),
        pathMatch: 'full',
      },
      {
        path: [':id', ROUTE_SECTIONS.hubEdit].join('/'),
        loadComponent: () => import('@app/hub-edit').then((m) => m.HubEditPageComponent),
        pathMatch: 'full',
        canDeactivate: [hasUnsavedChangesGuardFn],
      },
    ],
  },
  {
    path: ROUTE_SECTIONS.controlSchemes,
    children: [
      {
        path: '',
        loadComponent: () => import('@app/control-schemes-list').then((m) => m.ControlSchemeListPageComponent),
        pathMatch: 'full',
      },
      {
        path: [':schemeName'].join('/'),
        loadComponent: () => import('@app/control-scheme-view').then((m) => m.ControlSchemePageComponent),
        pathMatch: 'full',
        canDeactivate: [leavingRunningSchemeGuardFn],
      },
      {
        path: [':schemeName', ROUTE_SECTIONS.binding, ':bindingId'].join('/'),
        loadComponent: () => import('@app/control-scheme-binding-edit').then((m) => m.BindingEditPageComponent),
        pathMatch: 'full',
        canDeactivate: [hasUnsavedChangesGuardFn],
      },
      {
        path: [':schemeName', ROUTE_SECTIONS.bindingCreate].join('/'),
        loadComponent: () => import('@app/control-scheme-binding-create').then((m) => m.BindingCreatePageComponent),
        pathMatch: 'full',
        canDeactivate: [hasUnsavedChangesGuardFn],
      },
      {
        path: [':schemeName', ROUTE_SECTIONS.hubEdit, ':hubId', ROUTE_SECTIONS.portEdit, ':portId'].join('/'),
        loadComponent: () => import('@app/control-scheme-port-config-edit').then((m) => m.PortConfigEditPageComponent),
        pathMatch: 'full',
        canDeactivate: [hasUnsavedChangesGuardFn],
      },
      {
        path: [':schemeName', ROUTE_SECTIONS.controlSchemeRename].join('/'),
        loadComponent: () => import('@app/control-scheme-rename').then((m) => m.ControlSchemeRenamePageComponent),
        pathMatch: 'full',
        canDeactivate: [hasUnsavedChangesGuardFn],
      },
    ],
  },
  {
    path: ROUTE_SECTIONS.settings,
    loadComponent: () => import('@app/settings').then((m) => m.SettingsPageComponent),
    pathMatch: 'full',
  },
  {
    path: '**',
    component: NotFoundPageComponent,
  },
];
