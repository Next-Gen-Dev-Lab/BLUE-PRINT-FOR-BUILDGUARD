import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-server-error',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './server-error.html',
  styleUrls: ['../../error-pages.css']
})
export class ServerErrorComponent {
  // Mock debug trace stack
  stackTrace = `Error: DB connection to safety_compliance_database failed
  at Pool.connect (/server/db/pool.js:24:11)
  at runNextTicks (node:internal/process/task_queues:60:5)
  at process.processTimers (node:internal/timers:509:9)
  at async Object.querySafetyAlerts (/server/controllers/alerts.js:14:8)
  at async handleRequest (/server/router.js:42:15)`;
}
