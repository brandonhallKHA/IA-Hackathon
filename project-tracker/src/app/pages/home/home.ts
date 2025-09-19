import { Component } from '@angular/core';
import { ProjectTrackerComponent } from '../../shared/components/project-tracker/project-tracker.component';

@Component({
  selector: 'app-home',
  imports: [ProjectTrackerComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
