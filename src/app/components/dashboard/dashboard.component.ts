import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

interface DashboardCard {
  title: string;
  value: string | number;
  change: number;
  icon: string;
  color: string;
  subtitle?: string;
}

interface ChartData {
  labels: string[];
  datasets: any[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressBarModule,
    MatChipsModule,
    MatGridListModule
  ],
  template: `
    <div class="dashboard-container fade-in">
      <!-- Dashboard Header -->
      <div class="dashboard-header">
        <div class="header-content">
          <h1 class="dashboard-title">
            <mat-icon class="title-icon">dashboard</mat-icon>
            Dashboard Overview
          </h1>
          <p class="dashboard-subtitle">Welcome back! Here's what's happening with your data.</p>
        </div>
        <div class="header-actions">
          <mat-select value="7days" class="time-selector">
            <mat-option value="24h">Last 24 Hours</mat-option>
            <mat-option value="7days">Last 7 Days</mat-option>
            <mat-option value="30days">Last 30 Days</mat-option>
            <mat-option value="90days">Last 90 Days</mat-option>
          </mat-select>
        </div>
      </div>

      <!-- Key Metrics Cards -->
      <div class="metrics-grid">
        <mat-card *ngFor="let card of dashboardCards" class="metric-card" [ngClass]="'card-' + card.color">
          <div class="metric-content">
            <div class="metric-info">
              <div class="metric-header">
                <span class="metric-title">{{ card.title }}</span>
                <mat-icon class="metric-icon" [ngClass]="'icon-' + card.color">{{ card.icon }}</mat-icon>
              </div>
              <div class="metric-value">{{ card.value }}</div>
              <div class="metric-subtitle" *ngIf="card.subtitle">{{ card.subtitle }}</div>
            </div>
            <div class="metric-change" [ngClass]="card.change >= 0 ? 'positive' : 'negative'">
              <mat-icon class="change-icon">
                {{ card.change >= 0 ? 'trending_up' : 'trending_down' }}
              </mat-icon>
              <span class="change-value">{{ Math.abs(card.change) }}%</span>
            </div>
          </div>
        </mat-card>
      </div>

      <!-- Charts Section -->
      <div class="charts-section">
        <!-- Main Charts Row -->
        <div class="charts-row">
          <!-- Line Chart -->
          <mat-card class="chart-card large-chart">
            <mat-card-header>
              <mat-card-title>Revenue Trends</mat-card-title>
              <mat-card-subtitle>Monthly revenue over the past year</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="chart-container">
                <canvas #lineChart></canvas>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Bar Chart -->
          <mat-card class="chart-card medium-chart">
            <mat-card-header>
              <mat-card-title>Category Performance</mat-card-title>
              <mat-card-subtitle>Sales by category</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="chart-container">
                <canvas #barChart></canvas>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Second Charts Row -->
        <div class="charts-row">
          <!-- Doughnut Chart -->
          <mat-card class="chart-card medium-chart">
            <mat-card-header>
              <mat-card-title>Traffic Sources</mat-card-title>
              <mat-card-subtitle>Website traffic breakdown</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="chart-container">
                <canvas #doughnutChart></canvas>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Area Chart -->
          <mat-card class="chart-card medium-chart">
            <mat-card-header>
              <mat-card-title>User Activity</mat-card-title>
              <mat-card-subtitle>Daily active users</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="chart-container">
                <canvas #areaChart></canvas>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Polar Area Chart -->
          <mat-card class="chart-card medium-chart">
            <mat-card-header>
              <mat-card-title>Feature Usage</mat-card-title>
              <mat-card-subtitle>Popular features</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="chart-container">
                <canvas #polarChart></canvas>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Third Charts Row -->
        <div class="charts-row">
          <!-- Radar Chart -->
          <mat-card class="chart-card medium-chart">
            <mat-card-header>
              <mat-card-title>Performance Metrics</mat-card-title>
              <mat-card-subtitle>System performance overview</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="chart-container">
                <canvas #radarChart></canvas>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Recent Activity -->
          <mat-card class="chart-card medium-chart activity-card">
            <mat-card-header>
              <mat-card-title>Recent Activity</mat-card-title>
              <mat-card-subtitle>Latest system activities</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="activity-list">
                <div *ngFor="let activity of recentActivities" class="activity-item">
                  <div class="activity-icon">
                    <mat-icon [ngClass]="'activity-' + activity.type">{{ activity.icon }}</mat-icon>
                  </div>
                  <div class="activity-content">
                    <div class="activity-text">{{ activity.text }}</div>
                    <div class="activity-time">{{ activity.time }}</div>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 0;
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
      gap: 20px;
    }

    .header-content {
      flex: 1;
    }

    .dashboard-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 2rem;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: var(--text-primary);
    }

    .title-icon {
      color: #3b82f6;
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .dashboard-subtitle {
      color: var(--text-secondary);
      margin: 0;
      font-size: 1rem;
    }

    .header-actions {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .time-selector {
      min-width: 150px;
    }

    /* Metrics Grid */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .metric-card {
      transition: all 0.3s ease;
      border-radius: 12px;
      overflow: hidden;
    }

    .metric-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .metric-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 20px;
    }

    .metric-info {
      flex: 1;
    }

    .metric-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .metric-title {
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .metric-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .icon-blue { color: #3b82f6; }
    .icon-green { color: #10b981; }
    .icon-purple { color: #8b5cf6; }
    .icon-orange { color: #f59e0b; }

    .metric-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 4px;
    }

    .metric-subtitle {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .metric-change {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .metric-change.positive {
      color: #10b981;
    }

    .metric-change.negative {
      color: #ef4444;
    }

    .change-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    /* Charts Section */
    .charts-section {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .charts-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 20px;
    }

    .chart-card {
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .chart-card:hover {
      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
    }

    .large-chart {
      grid-column: span 2;
    }

    .chart-container {
      position: relative;
      height: 300px;
      width: 100%;
    }

    .chart-container canvas {
      max-height: 300px;
    }

    /* Activity Card */
    .activity-card .chart-container {
      height: auto;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-height: 300px;
      overflow-y: auto;
    }

    .activity-item {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      padding: 12px;
      border-radius: 8px;
      background-color: var(--bg-secondary);
      transition: all 0.2s ease;
    }

    .activity-item:hover {
      background-color: rgba(59, 130, 246, 0.05);
    }

    .activity-icon {
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgba(59, 130, 246, 0.1);
    }

    .activity-icon mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .activity-success { color: #10b981; background-color: rgba(16, 185, 129, 0.1); }
    .activity-warning { color: #f59e0b; background-color: rgba(245, 158, 11, 0.1); }
    .activity-error { color: #ef4444; background-color: rgba(239, 68, 68, 0.1); }
    .activity-info { color: #3b82f6; background-color: rgba(59, 130, 246, 0.1); }

    .activity-content {
      flex: 1;
    }

    .activity-text {
      font-size: 0.875rem;
      color: var(--text-primary);
      margin-bottom: 4px;
    }

    .activity-time {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
      .large-chart {
        grid-column: span 1;
      }
    }

    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        gap: 16px;
      }

      .dashboard-title {
        font-size: 1.5rem;
      }

      .metrics-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .charts-row {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .chart-container {
        height: 250px;
      }
    }

    /* Card Color Variations */
    .card-blue {
      border-left: 4px solid #3b82f6;
    }

    .card-green {
      border-left: 4px solid #10b981;
    }

    .card-purple {
      border-left: 4px solid #8b5cf6;
    }

    .card-orange {
      border-left: 4px solid #f59e0b;
    }

    /* Animation */
    .fade-in {
      animation: fadeIn 0.6s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('lineChart') lineChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barChart') barChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('doughnutChart') doughnutChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('areaChart') areaChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('polarChart') polarChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('radarChart') radarChartRef!: ElementRef<HTMLCanvasElement>;

  Math = Math;

  dashboardCards: DashboardCard[] = [
    {
      title: 'Total Revenue',
      value: '$124,532',
      change: 12.5,
      icon: 'attach_money',
      color: 'blue',
      subtitle: 'vs last month'
    },
    {
      title: 'Active Users',
      value: '8,492',
      change: 8.2,
      icon: 'people',
      color: 'green',
      subtitle: '2,341 new this month'
    },
    {
      title: 'Orders',
      value: '2,847',
      change: -3.1,
      icon: 'shopping_cart',
      color: 'purple',
      subtitle: '156 pending'
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: 1.8,
      icon: 'trending_up',
      color: 'orange',
      subtitle: 'avg 2.91%'
    }
  ];

  recentActivities = [
    {
      text: 'New user registration completed',
      time: '2 minutes ago',
      icon: 'person_add',
      type: 'success'
    },
    {
      text: 'Payment processing failed',
      time: '5 minutes ago',
      icon: 'error',
      type: 'error'
    },
    {
      text: 'Database backup completed',
      time: '1 hour ago',
      icon: 'backup',
      type: 'success'
    },
    {
      text: 'High CPU usage detected',
      time: '2 hours ago',
      icon: 'warning',
      type: 'warning'
    },
    {
      text: 'New feature deployed',
      time: '3 hours ago',
      icon: 'rocket_launch',
      type: 'info'
    }
  ];

  private charts: Chart[] = [];

  ngOnInit() {
    // Component initialization
  }

  ngAfterViewInit() {
    this.createCharts();
  }

  private createCharts() {
    this.createLineChart();
    this.createBarChart();
    this.createDoughnutChart();
    this.createAreaChart();
    this.createPolarChart();
    this.createRadarChart();
  }

  private createLineChart() {
    const ctx = this.lineChartRef.nativeElement.getContext('2d');
    if (ctx) {
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Revenue',
            data: [65000, 59000, 80000, 81000, 56000, 85000, 90000, 95000, 88000, 92000, 98000, 105000],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
      this.charts.push(chart);
    }
  }

  private createBarChart() {
    const ctx = this.barChartRef.nativeElement.getContext('2d');
    if (ctx) {
      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'],
          datasets: [{
            label: 'Sales',
            data: [12000, 19000, 8000, 15000, 10000],
            backgroundColor: [
              '#3b82f6',
              '#10b981',
              '#8b5cf6',
              '#f59e0b',
              '#ef4444'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
      this.charts.push(chart);
    }
  }

  private createDoughnutChart() {
    const ctx = this.doughnutChartRef.nativeElement.getContext('2d');
    if (ctx) {
      const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Direct', 'Social', 'Email', 'Search', 'Referral'],
          datasets: [{
            data: [35, 25, 20, 15, 5],
            backgroundColor: [
              '#3b82f6',
              '#10b981',
              '#8b5cf6',
              '#f59e0b',
              '#ef4444'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
      this.charts.push(chart);
    }
  }

  private createAreaChart() {
    const ctx = this.areaChartRef.nativeElement.getContext('2d');
    if (ctx) {
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Active Users',
            data: [1200, 1900, 1500, 2100, 1800, 2400, 2200],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
      this.charts.push(chart);
    }
  }

  private createPolarChart() {
    const ctx = this.polarChartRef.nativeElement.getContext('2d');
    if (ctx) {
      const chart = new Chart(ctx, {
        type: 'polarArea',
        data: {
          labels: ['Dashboard', 'Analytics', 'Reports', 'Settings', 'Profile'],
          datasets: [{
            data: [45, 35, 25, 20, 15],
            backgroundColor: [
              'rgba(59, 130, 246, 0.7)',
              'rgba(16, 185, 129, 0.7)',
              'rgba(139, 92, 246, 0.7)',
              'rgba(245, 158, 11, 0.7)',
              'rgba(239, 68, 68, 0.7)'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
      this.charts.push(chart);
    }
  }

  private createRadarChart() {
    const ctx = this.radarChartRef.nativeElement.getContext('2d');
    if (ctx) {
      const chart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['CPU', 'Memory', 'Disk', 'Network', 'Database', 'Cache'],
          datasets: [{
            label: 'Performance',
            data: [85, 75, 90, 80, 95, 88],
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            pointBackgroundColor: '#8b5cf6'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            r: {
              beginAtZero: true,
              max: 100
            }
          }
        }
      });
      this.charts.push(chart);
    }
  }
}