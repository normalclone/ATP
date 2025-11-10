import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import {
  LucideAngularModule,
  Gauge,
  Database,
  BarChart3,
  CalendarClock,
  Bell,
  Users,
  AlertTriangle,
  Play,
  FlaskConical,
  ChevronDown,
  Search,
  X,
  Layers,
  Calendar,
  Clock3,
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      LucideAngularModule.pick({
        Gauge,
        Database,
        BarChart3,
        CalendarClock,
        Bell,
        Users,
        AlertTriangle,
        Play,
        FlaskConical,
        ChevronDown,
        Search,
        X,
        Layers,
        Calendar,
        Clock3,
      })
    ),
  ],
};
