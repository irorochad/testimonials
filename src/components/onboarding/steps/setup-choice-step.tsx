"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Upload, Mail, Code, ArrowLeft } from "lucide-react";
import { OnboardingData } from "../onboarding-flow";

interface SetupChoiceStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: (choice: 'import' | 'invite' | 'embed') => void;
  onBack: () => void;
}

export function SetupChoiceStep({ onNext, onBack }: SetupChoiceStepProps) {
  const [selectedChoice, setSelectedChoice] = useState<'import' | 'invite' | 'embed' | ''>('');

  const choices = [
    {
      id: 'import' as const,
      icon: Upload,
      title: 'I want to import existing testimonials',
      description: 'Upload testimonials you already have via CSV',
      details: 'Perfect if you have testimonials from emails, reviews, or other sources'
    },
    {
      id: 'invite' as const,
      icon: Mail,
      title: 'I want to send invitations to customers',
      description: 'Email your best customers to request testimonials',
      details: 'Great for getting fresh testimonials from happy customers'
    },
    {
      id: 'embed' as const,
      icon: Code,
      title: 'I just want to get the embed code',
      description: 'Add the widget to your site and start collecting',
      details: 'Quick setup to start collecting testimonials immediately'
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">How do you want to start?</CardTitle>
        <CardDescription>
          Choose the option that best fits your current situation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {choices.map((choice) => {
            const Icon = choice.icon;
            const isSelected = selectedChoice === choice.id;
            return (
              <div
                key={choice.id}
                className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${isSelected
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-400'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                onClick={() => setSelectedChoice(choice.id)}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${isSelected
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300 dark:border-gray-600'
                  }`}>
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <div className="flex items-start space-x-3 flex-1">
                  <Icon className={`w-6 h-6 mt-1 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                    }`} />
                  <div className="flex-1">
                    <h3 className={`font-medium ${isSelected
                        ? 'text-blue-900 dark:text-blue-100'
                        : 'text-gray-900 dark:text-gray-100'
                      }`}>
                      {choice.title}
                    </h3>
                    <p className={`text-sm mt-1 ${isSelected
                        ? 'text-blue-700 dark:text-blue-200'
                        : 'text-gray-600 dark:text-gray-300'
                      }`}>
                      {choice.description}
                    </p>
                    <p className={`text-xs mt-2 ${isSelected
                        ? 'text-blue-600 dark:text-blue-300'
                        : 'text-gray-500 dark:text-gray-400'
                      }`}>
                      {choice.details}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <Button
            onClick={() => onNext(selectedChoice as 'import' | 'invite' | 'embed')}
            className="flex-1"
            size="lg"
            disabled={!selectedChoice}
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}