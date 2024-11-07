import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListViewComponent } from './organizational-chart/list-view/list-view.component';
import { HttpClientModule } from '@angular/common/http';
import { ChartViewComponent } from './organizational-chart/chart-view/chart-view.component';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { OrganizationChartEvent, OrganizationChartEventArgs, OrganizationRole } from './role';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChartViewComponent, ListViewComponent, HttpClientModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'organizationalChart';
  protected listData$ = new Subject<OrganizationChartEventArgs>();
  onActionComplete(data: OrganizationChartEventArgs) {
    this.listData$.next(data);
  }
}
