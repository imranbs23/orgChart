import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListViewComponent } from './organizational-chart/list-view/list-view.component';
import { HttpClientModule } from '@angular/common/http';
import { ChartViewComponent } from './organizational-chart/chart-view/chart-view.component';
import { ChartViewTestComponent } from './organizational-chart/chart-view-test/chart-view-test.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChartViewComponent, ListViewComponent, HttpClientModule,ChartViewTestComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'organizationalChart';
}
