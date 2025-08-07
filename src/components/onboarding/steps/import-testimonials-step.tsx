"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, Download } from "lucide-react";
import { OnboardingData } from "../onboarding-flow";

interface ImportTestimonialsStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ImportTestimonialsStep({ data, updateData, onNext, onBack }: ImportTestimonialsStepProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      // Here you would parse the CSV and show preview
      // For now, we'll simulate it
      setPreviewData([
        { name: 'John Doe', email: 'john@example.com', testimonial: 'Great service!', rating: 5 },
        { name: 'Jane Smith', email: 'jane@example.com', testimonial: 'Highly recommend!', rating: 5 },
      ]);
    }
  };

  const handleImport = async () => {
    if (!file) return;
    
    setIsUploading(true);
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    updateData({ importedCount: previewData.length });
    setIsUploading(false);
    onNext();
  };

  const downloadSample = () => {
    const csvContent = `Name,Email,Testimonial,Rating
John Doe,john@example.com,"Great service! Very professional and timely.",5
Jane Smith,jane@example.com,"Exceeded my expectations. Will definitely use again.",5
Bob Johnson,bob@example.com,"Good quality work at a fair price.",4`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'testimonials-sample.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Upload your existing testimonials</CardTitle>
        <CardDescription>
          Import testimonials from a CSV file to get started quickly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          {!file ? (
            <div className="space-y-4">
              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-lg font-medium text-gray-900">Upload CSV file</p>
                <p className="text-sm text-gray-500">Drag and drop or click to browse</p>
              </div>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <Button asChild variant="outline">
                <label htmlFor="csv-upload" className="cursor-pointer">
                  Choose File
                </label>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-green-600">
                <Upload className="w-8 h-8 mx-auto" />
                <p className="font-medium">{file.name}</p>
                <p className="text-sm">Ready to import {previewData.length} testimonials</p>
              </div>
            </div>
          )}
        </div>

        {previewData.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium">Preview:</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 max-h-40 overflow-y-auto">
              {previewData.slice(0, 3).map((item, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium">{item.name}</span> - &quot;{item.testimonial.substring(0, 50)}...&quot;
                </div>
              ))}
              {previewData.length > 3 && (
                <p className="text-xs text-gray-500">...and {previewData.length - 3} more</p>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <span>Need help formatting your data?</span>
          <Button variant="link" onClick={downloadSample} className="p-0 h-auto">
            <Download className="w-4 h-4 mr-1" />
            Download sample format
          </Button>
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
            onClick={handleImport}
            className="flex-1"
            size="lg"
            disabled={!file || isUploading}
          >
            {isUploading ? 'Importing...' : `Import ${previewData.length} testimonials`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}