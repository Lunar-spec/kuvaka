"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowLeft, RotateCcw } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/useToast";
import type { Country } from "@/types/auth";

const otpSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only digits"),
});

type OTPFormData = z.infer<typeof otpSchema>;

interface OTPFormProps {
  phoneNumber: string;
  countryCode: string;
  country: Country | null;
  onSuccess: () => void;
  onBack: () => void;
}

export function OTPForm({
  phoneNumber,
  countryCode,
  country,
  onSuccess,
  onBack,
}: OTPFormProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const { verifyOtp, sendOtp, login, isLoading } = useAuthStore();
  const { showSuccess, showError, showInfo } = useToast();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
  });

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleOTPChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (newOtp.every((digit) => digit !== "") && newOtp.join("").length === 6) {
      handleVerifyOTP(newOtp.join(""));
    }

    // Clear errors when user starts typing
    if (errors.otp) {
      clearErrors("otp");
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle paste
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, "").slice(0, 6).split("");
        const newOtp = [...otp];
        digits.forEach((digit, i) => {
          if (i < 6) newOtp[i] = digit;
        });
        setOtp(newOtp);

        // Focus appropriate input
        const nextEmptyIndex = newOtp.findIndex((digit) => digit === "");
        if (nextEmptyIndex !== -1) {
          inputRefs.current[nextEmptyIndex]?.focus();
        } else {
          inputRefs.current[5]?.focus();
        }
      });
    }
  };

  const handleVerifyOTP = async (otpCode: string) => {
    try {
      const isValid = await verifyOtp(otpCode);

      if (isValid) {
        // Login the user
        login(phoneNumber, countryCode);

        showSuccess("OTP Verified", "You are now logged in.");
        setOtp(["", "", "", "", "", ""]); // Clear OTP inputs

        onSuccess();
      } else {
        setError("otp", { message: "Invalid OTP. Please try again." });
        showError("Invalid OTP", "Please check the code and try again.");

        // Clear OTP inputs
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("otp", { message: "Failed to verify OTP. Please try again." });
      showError("Verification Failed", "Please try again later.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResendOTP = async () => {
    try {
      setResendLoading(true);
      await sendOtp(phoneNumber, countryCode);

      showInfo("OTP Resent", "A new verification code has been sent.");

      // Reset timer
      setTimeLeft(30);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error("Error resending OTP:", error);
      showError("Failed to resend OTP", "Please try again later.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setResendLoading(false);
    }
  };

  const onSubmit = async (data: OTPFormData) => {
    await handleVerifyOTP(data.otp);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          Enter verification code
        </CardTitle>
        <CardDescription>
          We've sent a 6-digit code to{" "}
          <span className="font-medium">
            {country?.dialCode} {phoneNumber}
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* OTP Input */}
          <div className="space-y-2">
            <Label>Verification Code</Label>
            <div className="flex space-x-2 justify-center">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-medium"
                  disabled={isLoading}
                />
              ))}
            </div>
            {errors.otp && (
              <p className="text-sm text-destructive text-center">
                {errors.otp.message}
              </p>
            )}
          </div>

          {/* Resend OTP */}
          <div className="text-center">
            {canResend ? (
              <Button
                type="button"
                variant="link"
                onClick={handleResendOTP}
                disabled={resendLoading}
                className="p-0 h-auto"
              >
                {resendLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resending...
                  </>
                ) : (
                  <>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Resend code
                  </>
                )}
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Resend code in {timeLeft}s
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || otp.some((digit) => digit === "")}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Code"
            )}
          </Button>
        </form>

        {/* Back Button */}
        <Button
          variant="outline"
          onClick={onBack}
          className="w-full"
          disabled={isLoading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to phone number
        </Button>

        {/* Help Text */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Didn't receive the code? Check your messages or try resending.</p>
          <p className="mt-1">
            <span className="font-medium">Tip:</span> Use code{" "}
            <span className="font-mono underline">123456</span> for testing
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
