"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OnboardingData } from "../onboarding-flow";

interface WelcomeStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
}

export function WelcomeStep({ data, updateData, onNext }: WelcomeStepProps) {
  const [projectName, setProjectName] = useState(data.projectName);
  const [websiteUrl, setWebsiteUrl] = useState(data.websiteUrl);
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const sanitizeInput = (input: string, maxLength: number) => {
    return input.trim().replace(/[<>\"'&]/g, '').substring(0, maxLength);
  };

  const validateUrl = (url: string) => {
    if (!url.trim()) return false;

    try {
      // Create URL object to validate
      const testUrl = new URL(url.startsWith('http') ? url : `https://${url}`);

      // Check if hostname is valid
      const hostname = testUrl.hostname;

      // Allow localhost for development
      if (hostname === 'localhost' || hostname.startsWith('localhost:')) {
        return true;
      }

      // Allow IP addresses for development
      if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
        return true;
      }

      // Validate domain format (supports subdomains)
      const domainPattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

      return domainPattern.test(hostname);
    } catch {
      return false;
    }
  };

  const handleNext = async () => {
    // Sanitize inputs
    const sanitizedProjectName = sanitizeInput(projectName, 255);
    const sanitizedWebsiteUrl = sanitizeInput(websiteUrl, 500);

    const isValid = validateUrl(sanitizedWebsiteUrl);
    setIsValidUrl(isValid);

    if (isValid && sanitizedProjectName) {
      setIsLoading(true);
      try {
        // Create project in database
        const response = await fetch('/api/projects/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectName: sanitizedProjectName,
            websiteUrl: sanitizedWebsiteUrl.startsWith('http') ? sanitizedWebsiteUrl : `https://${sanitizedWebsiteUrl}`,
          }),
        });

        const result = await response.json();

        if (result.success) {
          // Mark onboarding as complete immediately after project creation
          const onboardingResponse = await fetch('/api/onboarding/complete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (onboardingResponse.ok) {
            updateData({
              projectName: sanitizedProjectName,
              websiteUrl: result.project.websiteUrl,
              projectId: result.project.id,
            });
            onNext();
          } else {
            console.error('Failed to complete onboarding');
            setIsValidUrl(false);
          }
        } else {
          console.error('Failed to create project:', result.error);
          setIsValidUrl(false);
        }
      } catch (error) {
        console.error('Error creating project:', error);
        setIsValidUrl(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Let's set up your first project</CardTitle>
        <CardDescription className="mt-2">
          We'll help you get started with collecting testimonials in just a few steps
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="projectName">What should we call this project?</Label>
          <Input
            id="projectName"
            placeholder="My Business"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="text-lg"
          />
          <p className="text-sm text-gray-500">
            This helps with organization if you have multiple websites later
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="websiteUrl">Where will you display testimonials?</Label>
          <div className="flex items-center space-x-2">
            {websiteUrl && isValidUrl && getFaviconUrl(websiteUrl) && (
              <img
                src={getFaviconUrl(websiteUrl)!}
                alt="Website favicon"
                className="w-6 h-6"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <Input
              id="websiteUrl"
              placeholder="example.com"
              value={websiteUrl}
              onChange={(e) => {
                setWebsiteUrl(e.target.value);
                setIsValidUrl(true);
              }}
              className={`text-lg flex-1 ${!isValidUrl ? 'border-red-500' : ''}`}
            />
          </div>
          {!isValidUrl && (
            <p className="text-sm text-red-500">
              Please enter a valid website URL
            </p>
          )}
          <p className="text-sm text-gray-500">
            We'll use this for widget setup and domain verification
          </p>
        </div>

        <Button
          onClick={handleNext}
          className="w-full"
          size="lg"
          disabled={!projectName.trim() || !websiteUrl.trim() || isLoading}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Creating project...</span>
            </div>
          ) : (
            'Continue'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}