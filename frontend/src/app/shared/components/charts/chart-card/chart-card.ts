import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

interface BarData {
  label: string;
  value: number;
  height: number;
  x: number;
  y: number;
}

interface LinePoint {
  x: number;
  y: number;
  value: number;
  label: string;
}

@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-card.html',
  styleUrls: ['./chart-card.css']
})
export class ChartCardComponent implements OnInit, OnChanges {
  @Input() title: string = '';
  @Input() chartType: 'line' | 'bar' | 'gauge' = 'line';
  @Input() data: number[] = [];
  @Input() labels: string[] = [];
  @Input() score: number = 0; // For circular gauge
  @Input() height: number = 220;

  // Render variables
  svgWidth = 500;
  svgHeight = 220;
  padding = 40;

  bars: BarData[] = [];
  linePoints: LinePoint[] = [];
  linePath: string = '';
  lineAreaPath: string = '';
  gridLines: number[] = [25, 50, 75, 100]; // Grid lines for Y axis (percentages)

  // Circular gauge values
  gaugeRadius = 70;
  gaugeCircumference = 2 * Math.PI * 70; // 2 * pi * r
  gaugeStrokeDashoffset = 0;

  ngOnInit(): void {
    this.calculateDimensions();
    this.generateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['labels'] || changes['score']) {
      this.calculateDimensions();
      this.generateChart();
    }
  }

  calculateDimensions(): void {
    this.svgHeight = this.height;
    // Circular gauge properties
    const scoreVal = Math.min(100, Math.max(0, this.score));
    this.gaugeStrokeDashoffset = this.gaugeCircumference - (scoreVal / 100) * this.gaugeCircumference;
  }

  generateChart(): void {
    if (this.chartType === 'gauge') return;
    if (!this.data || this.data.length === 0) return;

    const chartWidth = this.svgWidth - this.padding * 2;
    const chartHeight = this.svgHeight - this.padding * 2;
    const maxVal = Math.max(...this.data, 10); // Don't divide by 0

    if (this.chartType === 'bar') {
      const barWidth = (chartWidth / this.data.length) * 0.6;
      const spacing = (chartWidth / this.data.length) * 0.4;
      
      this.bars = this.data.map((val, idx) => {
        const h = (val / maxVal) * chartHeight;
        const x = this.padding + idx * (barWidth + spacing) + spacing / 2;
        const y = this.svgHeight - this.padding - h;
        return {
          label: this.labels[idx] || '',
          value: val,
          height: h,
          x: x,
          y: y
        };
      });
    } else if (this.chartType === 'line') {
      const stepX = chartWidth / (this.data.length - 1 || 1);
      
      this.linePoints = this.data.map((val, idx) => {
        const x = this.padding + idx * stepX;
        const y = this.svgHeight - this.padding - (val / maxVal) * chartHeight;
        return {
          x,
          y,
          value: val,
          label: this.labels[idx] || ''
        };
      });

      // Generate SVG path string
      if (this.linePoints.length > 0) {
        this.linePath = `M ${this.linePoints[0].x} ${this.linePoints[0].y} ` +
          this.linePoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');

        // Area path string (goes to bottom of chart to close the area shape)
        const first = this.linePoints[0];
        const last = this.linePoints.at(-1);
        this.lineAreaPath = `${this.linePath} L ${last.x} ${this.svgHeight - this.padding} L ${first.x} ${this.svgHeight - this.padding} Z`;
      }
    }
  }

  getYGridCoord(percent: number): number {
    const chartHeight = this.svgHeight - this.padding * 2;
    return this.svgHeight - this.padding - (percent / 100) * chartHeight;
  }
}
