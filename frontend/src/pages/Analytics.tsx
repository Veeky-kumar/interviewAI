import { Download, Users, FileText, Target, Calendar, CheckCircle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, FunnelChart, Funnel, LabelList } from 'recharts';
import Navbar from '@/components/layout/Navbar';
import { mockAnalytics } from '@/data/mockData';

const Analytics = () => {
  const statCards = [
    { 
      icon: FileText, 
      label: 'Total Jobs Created', 
      value: mockAnalytics.totalJobs,
      change: '+3 this month'
    },
    { 
      icon: Users, 
      label: 'Resumes Processed', 
      value: mockAnalytics.resumesProcessed.toLocaleString(),
      change: '+247 this week'
    },
    { 
      icon: Target, 
      label: 'Avg Match Score', 
      value: `${mockAnalytics.avgMatchScore}%`,
      change: '+2.3% from last month'
    },
    { 
      icon: Calendar, 
      label: 'Interviews Scheduled', 
      value: mockAnalytics.interviewsScheduled,
      change: '+12 this week'
    },
    { 
      icon: CheckCircle, 
      label: 'Interviews Completed', 
      value: mockAnalytics.interviewsCompleted,
      change: '75% completion rate'
    },
    { 
      icon: TrendingUp, 
      label: 'Hire Rate', 
      value: `${mockAnalytics.hireRate}%`,
      change: '+5% improvement'
    },
  ];

  const outcomeColors = {
    hired: 'hsl(150, 70%, 45%)',
    rejected: 'hsl(0, 62%, 50%)',
    pending: 'hsl(40, 90%, 50%)',
  };

  const pieData = [
    { name: 'Hired', value: mockAnalytics.hireRate, color: 'hsl(150, 70%, 45%)' },
    { name: 'Rejected', value: mockAnalytics.rejectRate, color: 'hsl(0, 62%, 50%)' },
    { name: 'Consider', value: mockAnalytics.considerRate, color: 'hsl(40, 90%, 50%)' },
  ];

  const handleExportReport = () => {
    alert('Exporting analytics report...');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-12">
        <div className="container px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Hiring Analytics</h1>
              <p className="text-muted-foreground">
                Overview of your hiring pipeline and performance metrics.
              </p>
            </div>
            <Button onClick={handleExportReport} className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {statCards.map((stat, i) => (
              <Card key={i} className="glass border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                  <div className="text-xs text-primary mt-2">{stat.change}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Match Score Distribution */}
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">Match Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockAnalytics.matchDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                      <XAxis 
                        dataKey="range" 
                        stroke="hsl(215, 20%, 55%)"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="hsl(215, 20%, 55%)"
                        fontSize={12}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(220, 15%, 10%)', 
                          border: '1px solid hsl(220, 15%, 18%)',
                          borderRadius: '8px',
                          color: 'hsl(210, 40%, 98%)'
                        }}
                      />
                      <Bar 
                        dataKey="count" 
                        fill="hsl(185, 80%, 50%)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Interview Outcomes */}
            <Card className="glass border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">Interview Outcomes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(220, 15%, 10%)', 
                          border: '1px solid hsl(220, 15%, 18%)',
                          borderRadius: '8px',
                          color: 'hsl(210, 40%, 98%)'
                        }}
                        formatter={(value: number) => `${value.toFixed(1)}%`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  {pieData.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Outcomes by Job */}
          <Card className="glass border-border/50 mb-8">
            <CardHeader>
              <CardTitle className="text-foreground">Interview Outcomes by Job</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockAnalytics.outcomesByJob} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                    <XAxis type="number" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                    <YAxis 
                      type="category" 
                      dataKey="job" 
                      stroke="hsl(215, 20%, 55%)" 
                      fontSize={12}
                      width={120}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(220, 15%, 10%)', 
                        border: '1px solid hsl(220, 15%, 18%)',
                        borderRadius: '8px',
                        color: 'hsl(210, 40%, 98%)'
                      }}
                    />
                    <Bar dataKey="hired" stackId="a" fill={outcomeColors.hired} radius={[0, 0, 0, 0]} />
                    <Bar dataKey="pending" stackId="a" fill={outcomeColors.pending} radius={[0, 0, 0, 0]} />
                    <Bar dataKey="rejected" stackId="a" fill={outcomeColors.rejected} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: outcomeColors.hired }} />
                  <span className="text-sm text-muted-foreground">Hired</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: outcomeColors.pending }} />
                  <span className="text-sm text-muted-foreground">Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: outcomeColors.rejected }} />
                  <span className="text-sm text-muted-foreground">Rejected</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hiring Funnel */}
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="text-foreground">Hiring Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockAnalytics.hiringFunnel.map((stage, i) => {
                  const maxCount = mockAnalytics.hiringFunnel[0].count;
                  const percentage = (stage.count / maxCount) * 100;
                  const conversionRate = i > 0 
                    ? ((stage.count / mockAnalytics.hiringFunnel[i - 1].count) * 100).toFixed(1)
                    : '100';
                  
                  return (
                    <div key={i} className="relative">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">{stage.stage}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">{stage.count.toLocaleString()}</span>
                          {i > 0 && (
                            <span className="text-xs text-primary">({conversionRate}%)</span>
                          )}
                        </div>
                      </div>
                      <div className="h-8 bg-secondary rounded-lg overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-accent rounded-lg transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
