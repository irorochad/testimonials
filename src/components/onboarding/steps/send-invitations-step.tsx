"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, X } from "lucide-react";
import { OnboardingData } from "../onboarding-flow";

interface SendInvitationsStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface Invitation {
  name: string;
  email: string;
}

export function SendInvitationsStep({ data, updateData, onNext, onBack }: SendInvitationsStepProps) {
  const [invitations, setInvitations] = useState<Invitation[]>([
    { name: '', email: '' },
    { name: '', email: '' },
    { name: '', email: '' }
  ]);
  const [isSending, setIsSending] = useState(false);

  const addInvitation = () => {
    setInvitations([...invitations, { name: '', email: '' }]);
  };

  const removeInvitation = (index: number) => {
    if (invitations.length > 1) {
      setInvitations(invitations.filter((_, i) => i !== index));
    }
  };

  const sanitizeInput = (input: string, maxLength: number) => {
    return input.trim().replace(/[<>\"'&]/g, '').substring(0, maxLength);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const updateInvitation = (index: number, field: 'name' | 'email', value: string) => {
    const updated = [...invitations];
    const sanitizedValue = field === 'name' 
      ? sanitizeInput(value, 255) 
      : sanitizeInput(value, 255);
    updated[index][field] = sanitizedValue;
    setInvitations(updated);
  };

  const validInvitations = invitations.filter(inv => 
    inv.name.trim() && inv.email.trim() && validateEmail(inv.email.trim())
  );

  const handleSend = async () => {
    if (validInvitations.length === 0) return;
    
    setIsSending(true);
    // Simulate sending invitations
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    updateData({ invitationsSent: validInvitations.length });
    setIsSending(false);
    onNext();
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Invite your best customers</CardTitle>
        <CardDescription>
          Send personalized invitations to customers you'd like testimonials from
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {invitations.map((invitation, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Input
                placeholder="Customer name"
                value={invitation.name}
                onChange={(e) => updateInvitation(index, 'name', e.target.value)}
                className="flex-1"
              />
              <Input
                type="email"
                placeholder="email@example.com"
                value={invitation.email}
                onChange={(e) => updateInvitation(index, 'email', e.target.value)}
                className="flex-1"
              />
              {invitations.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeInvitation(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          onClick={addInvitation}
          className="w-full flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add another customer</span>
        </Button>

        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Email Preview:</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p><strong>Subject:</strong> Would you share your experience with {data.projectName}?</p>
            <p><strong>Message:</strong> Hi [Name], we'd love to hear about your experience with our service. Your feedback helps us improve and helps other customers make informed decisions...</p>
          </div>
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
            onClick={handleSend}
            className="flex-1"
            size="lg"
            disabled={validInvitations.length === 0 || isSending}
          >
            {isSending ? 'Sending...' : `Send ${validInvitations.length} invitations`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}