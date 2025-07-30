"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WelcomeStep } from "./steps/welcome-step";
import { SetupChoiceStep } from "./steps/setup-choice-step";
import { ImportTestimonialsStep } from "./steps/import-testimonials-step";
import { SendInvitationsStep } from "./steps/send-invitations-step";
import { EmbedCodeStep } from "./steps/embed-code-step";
import { SuccessStep } from "./steps/success-step";
import { StepIndicator } from "./step-indicator";

export type OnboardingData = {
  projectName: string;
  websiteUrl: string;
  setupChoice: 'import' | 'invite' | 'embed' | null;
  projectId?: string; // Store the created project ID
  // Additional data based on choice
  importedCount?: number;
  invitationsSent?: number;
  embedAdded?: boolean;
};

export type OnboardingStep = 'welcome' | 'setup-choice' | 'import' | 'invite' | 'embed' | 'success';

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [data, setData] = useState<OnboardingData>({
    projectName: '',
    websiteUrl: '',
    setupChoice: null,
  });
  const router = useRouter();

  // Step mapping for indicator
  const stepMap = {
    'welcome': 1,
    'setup-choice': 2,
    'import': 3,
    'invite': 3,
    'embed': 3,
    'success': 4,
  };

  const stepTitles = ['Project Info', 'Setup Choice', 'Configuration', 'Complete'];

  const updateData = (newData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = (step: OnboardingStep) => {
    setCurrentStep(step);
  };

  const completeOnboarding = async () => {
    // Onboarding is already marked complete after project creation
    // Just redirect to dashboard
    router.push('/dashboard');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <WelcomeStep
            data={data}
            updateData={updateData}
            onNext={() => nextStep('setup-choice')}
          />
        );
      case 'setup-choice':
        return (
          <SetupChoiceStep
            data={data}
            updateData={updateData}
            onNext={(choice) => {
              updateData({ setupChoice: choice });
              nextStep(choice);
            }}
            onBack={() => nextStep('welcome')}
          />
        );
      case 'import':
        return (
          <ImportTestimonialsStep
            data={data}
            updateData={updateData}
            onNext={() => nextStep('success')}
            onBack={() => nextStep('setup-choice')}
          />
        );
      case 'invite':
        return (
          <SendInvitationsStep
            data={data}
            updateData={updateData}
            onNext={() => nextStep('success')}
            onBack={() => nextStep('setup-choice')}
          />
        );
      case 'embed':
        return (
          <EmbedCodeStep
            data={data}
            updateData={updateData}
            onNext={() => nextStep('success')}
            onBack={() => nextStep('setup-choice')}
          />
        );
      case 'success':
        return (
          <SuccessStep
            data={data}
            onComplete={completeOnboarding}
            onSkip={completeOnboarding}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <StepIndicator
          currentStep={stepMap[currentStep]}
          totalSteps={4}
          stepTitles={stepTitles}
        />
        {renderStep()}
      </div>
    </div>
  );
}