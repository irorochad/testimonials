"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { OnboardingData } from "../onboarding-flow";

interface EmbedCodeStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function EmbedCodeStep({ data, updateData, onNext, onBack }: EmbedCodeStepProps) {
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // Generate embed code using actual project data
  const embedCode = `<div id="proofflow-widget" data-project-id="${data.projectId}" data-domain="${new URL(data.websiteUrl).hostname}"></div>
<script src="https://widget.proofflow.com/embed.js"></script>`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };

  const handleNext = () => {
    updateData({ embedAdded: confirmed });
    onNext();
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Add testimonials to your website</CardTitle>
        <CardDescription>
          Copy and paste this code into your website to start collecting testimonials
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Embed Code</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="flex items-center space-x-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </Button>
          </div>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{embedCode}</pre>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">How to add this to your site:</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Copy the code above</li>
            <li>Paste it into your website's HTML where you want testimonials to appear</li>
            <li>The widget will automatically start displaying testimonials</li>
          </ol>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium mb-2">Widget Preview</h3>
          <div className="bg-white border rounded-lg p-4 text-center text-gray-500">
            <div className="space-y-2">
              <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
              <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
            </div>
            <p className="text-xs mt-3">Your testimonials will appear here</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="embed-confirmed"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="embed-confirmed" className="text-sm">
            I've added the code to my website
          </label>
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
            onClick={handleNext}
            className="flex-1"
            size="lg"
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}