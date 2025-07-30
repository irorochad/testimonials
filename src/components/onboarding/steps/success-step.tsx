"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Settings, Mail, BarChart3 } from "lucide-react";
import { OnboardingData } from "../onboarding-flow";

interface SuccessStepProps {
  data: OnboardingData;
  onComplete: () => void;
  onSkip: () => void;
}

export function SuccessStep({ data, onComplete, onSkip }: SuccessStepProps) {
  const getSuccessMessage = () => {
    switch (data.setupChoice) {
      case 'import':
        return {
          title: "Testimonials imported successfully! 🎉",
          description: `${data.importedCount} testimonials have been imported. Your widget is now live with real testimonials!`
        };
      case 'invite':
        return {
          title: "Invitations sent! 🎉",
          description: `${data.invitationsSent} invitations have been sent. You'll get notified when customers respond.`
        };
      case 'embed':
        return {
          title: "Widget setup complete! 🎉",
          description: data.embedAdded 
            ? "Your widget is now live! Customers can start seeing testimonials on your website."
            : "Your embed code is ready! Add it to your website when you're ready to start displaying testimonials."
        };
      default:
        return {
          title: "You're all set! 🎉",
          description: "Your testimonial collection system is ready to go."
        };
    }
  };

  const { title, description } = getSuccessMessage();

  const nextSteps = [
    {
      icon: Settings,
      title: "Customize your widget",
      description: "Change colors, layout, and display options",
      action: "Customize widget"
    },
    {
      icon: Mail,
      title: "Send more invitations",
      description: "Invite additional customers to leave testimonials",
      action: "Send invitations"
    },
    {
      icon: BarChart3,
      title: "View your dashboard",
      description: "Monitor testimonials and track performance",
      action: "Go to dashboard"
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="text-lg">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium text-center">What would you like to do next?</h3>
          <div className="grid gap-4">
            {nextSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    // In a real app, these would navigate to specific pages
                    onComplete();
                  }}
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{step.title}</h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    {step.action}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button
            onClick={onSkip}
            variant="link"
            className="w-full text-gray-500"
          >
            I'll explore on my own
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}