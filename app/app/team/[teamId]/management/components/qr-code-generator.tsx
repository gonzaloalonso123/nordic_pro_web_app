"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRCodeGeneratorProps {
  teamId: string;
}

export function QRCodeGenerator({ teamId }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const registrationUrl = `https://app.nordicpro.se/register/${teamId}`;

  useEffect(() => {
    generateQRCode();
  }, [teamId]);

  const generateQRCode = async () => {
    if (!canvasRef.current) return;

    try {
      // Using QR Server API for QR code generation
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(registrationUrl)}`;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = 200;
        canvas.height = 200;
        ctx.drawImage(img, 0, 0, 200, 200);
      };
      img.src = qrUrl;
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      });
    }
  };

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(registrationUrl);
      toast({
        title: "Copied!",
        description: "Registration URL copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy URL",
        variant: "destructive",
      });
    }
  };

  const downloadQR = () => {
    if (!canvasRef.current) return;

    const link = document.createElement("a");
    link.download = `team-${teamId}-qr.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="p-4 bg-white rounded-lg border">
        <canvas ref={canvasRef} className="block" />
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm font-medium">Registration URL:</p>
        <p className="text-xs text-muted-foreground break-all px-2">
          {registrationUrl}
        </p>
      </div>

      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={copyUrl}>
          <Copy className="h-4 w-4 mr-2" />
          Copy URL
        </Button>
        <Button variant="outline" size="sm" onClick={downloadQR}>
          <Download className="h-4 w-4 mr-2" />
          Download QR
        </Button>
      </div>
    </div>
  );
}
