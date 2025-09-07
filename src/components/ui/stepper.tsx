
'use client';

import * as React from 'react';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface StepperProps {
  initialStep?: number;
  steps: {
    label: string;
    icon: React.ElementType;
  }[];
  children: React.ReactNode;
  className?: string;
}

interface StepperContextValue {
  activeStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
}

const StepperContext = React.createContext<StepperContextValue | null>(null);

export const useStepper = () => {
  const context = React.useContext(StepperContext);
  if (!context) {
    throw new Error('useStepper must be used within a StepperProvider');
  }
  return context;
};

export const Stepper = ({ initialStep = 0, steps, children, className }: StepperProps) => {
  const [activeStep, setActiveStep] = React.useState(initialStep);
  const totalSteps = steps.length;

  const nextStep = () => setActiveStep((prev) => Math.min(prev + 1, totalSteps - 1));
  const prevStep = () => setActiveStep((prev) => Math.max(prev - 1, 0));
  const goToStep = (step: number) => setActiveStep(Math.max(0, Math.min(step, totalSteps - 1)));

  return (
    <StepperContext.Provider value={{ activeStep, totalSteps, nextStep, prevStep, goToStep }}>
      <div className={cn("w-full flex flex-col gap-4", className)}>
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = index === activeStep;
            const isCompleted = index < activeStep;
            const Icon = step.icon;
            return (
              <React.Fragment key={step.label}>
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                      isActive ? "bg-primary text-primary-foreground" :
                      isCompleted ? "bg-primary/80 text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? <Check className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                  </div>
                  <p className={cn(
                      "text-xs font-semibold text-center",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                    >
                    {step.label}
                    </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                      "flex-1 h-1 rounded-full mx-2 transition-colors",
                      isCompleted ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
        {React.Children.map(children, (child, index) => (
          <div className={cn(index === activeStep ? 'block' : 'hidden')}>
            {child}
          </div>
        ))}
      </div>
    </StepperContext.Provider>
  );
};

export const Step = ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
};
