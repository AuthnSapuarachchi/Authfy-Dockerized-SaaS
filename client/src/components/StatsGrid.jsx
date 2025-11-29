import React, { useEffect, useState } from 'react';
import { Key, Activity, ShieldAlert, CheckCircle, TrendingUp } from 'lucide-react';

const StatsGrid = ({ totalKeys = 0, totalRequests = 0 }) => {
  const [animatedValues, setAnimatedValues] = useState({
    keys: 0,
    requests: 0,
    activeKeys: 0,
    successRate: 0
  });

  // Calculate derived stats
  const activeKeysCount = totalKeys; // Assuming all keys are active for now
  const successRate = 99.2; // Mock success rate

  // Animate numbers on mount
  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setAnimatedValues({
        keys: Math.floor(totalKeys * progress),
        requests: Math.floor(totalRequests * progress),
        activeKeys: Math.floor(activeKeysCount * progress),
        successRate: Math.floor(successRate * progress)
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedValues({
          keys: totalKeys,
          requests: totalRequests,
          activeKeys: activeKeysCount,
          successRate: successRate
        });
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [totalKeys, totalRequests, activeKeysCount]);

  const stats = [
    { 
      label: 'Total API Keys', 
      value: animatedValues.keys,
      icon: Key,
      iconBg: 'bg-primary',
      iconColor: 'text-white',
      trend: '+2 this week',
      trendUp: true
    },
    { 
      label: 'API Requests', 
      value: animatedValues.requests.toLocaleString(),
      icon: Activity,
      iconBg: 'bg-success',
      iconColor: 'text-white',
      trend: '+12% from last week',
      trendUp: true
    },
    { 
      label: 'Active Keys', 
      value: animatedValues.activeKeys,
      icon: CheckCircle,
      iconBg: 'bg-info',
      iconColor: 'text-white',
      trend: 'All systems operational',
      trendUp: true
    },
    { 
      label: 'Success Rate', 
      value: `${animatedValues.successRate}%`,
      icon: ShieldAlert,
      iconBg: 'bg-warning',
      iconColor: 'text-white',
      trend: 'Excellent performance',
      trendUp: true
    },
  ];

  return (
    <div className="row g-4 mb-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="col-12 col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm h-100 hover-lift" style={{ transition: 'transform 0.2s' }}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="flex-grow-1">
                    <p className="text-muted small mb-1 text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>
                      {stat.label}
                    </p>
                    <h2 className="mb-0 fw-bold" style={{ fontSize: '2rem' }}>
                      {stat.value}
                    </h2>
                  </div>
                  <div className={`${stat.iconBg} ${stat.iconColor} rounded-3 p-3 d-flex align-items-center justify-content-center`} 
                       style={{ width: '56px', height: '56px' }}>
                    <Icon size={28} />
                  </div>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <TrendingUp size={14} className={stat.trendUp ? 'text-success' : 'text-danger'} />
                  <span className="text-muted small">{stat.trend}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsGrid;