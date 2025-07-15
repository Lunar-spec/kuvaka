"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowRight } from "lucide-react";
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
import { useToast } from "@/hooks/useToast";
import { CountrySelector } from "./CountrySelector";
import { OTPForm } from "./OTPForm";
import type { Country } from "@/types/auth";

const loginSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d+$/, "Phone number must contain only digits")
    .min(6, "Phone number must be at least 6 digits")
    .max(15, "Phone number must be at most 15 digits"),
  countryCode: z.string().min(1, "Country is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [showOTP, setShowOTP] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const { showError, showSuccess, showInfo } = useToast();
  const { sendOtp, isLoading, otpSent } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setValue("countryCode", country.code);
    setCountryCode(country.code);
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      setPhoneNumber(data.phone);
      setCountryCode(data.countryCode);

      await sendOtp(data.phone, data.countryCode);

      showSuccess(
        "OTP Sent",
        `Verification code sent to ${selectedCountry?.dialCode} ${data.phone}`
      );

      setShowOTP(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      showError("Failed to send OTP", "Please try again later.");
    }
  };

  const handleOTPSuccess = () => {
    router.push("/dashboard");
  };

  const handleBackToPhone = () => {
    setShowOTP(false);
  };

  if (showOTP) {
    return (
      <OTPForm
        phoneNumber={phoneNumber}
        countryCode={countryCode}
        country={selectedCountry}
        onSuccess={handleOTPSuccess}
        onBack={handleBackToPhone}
      />
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>
          Enter your phone number to sign in to your account
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Country Selector */}
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <CountrySelector
              value={selectedCountry?.code}
              onSelect={handleCountrySelect}
              placeholder="Select your country"
              disabled={isLoading}
            />
            {errors.countryCode && (
              <p className="text-sm text-destructive">
                {errors.countryCode.message}
              </p>
            )}
          </div>

          {/* Phone Number Input */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex">
              {selectedCountry && (
                <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                  <span className="text-sm text-muted-foreground">
                    {selectedCountry.dialCode}
                  </span>
                </div>
              )}
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                className={selectedCountry ? "rounded-l-none" : ""}
                disabled={isLoading}
                {...register("phone")}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !selectedCountry}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending OTP...
              </>
            ) : (
              <>
                Send OTP
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Button
            variant="link"
            className="p-0 h-auto font-normal"
            onClick={() => router.push("/signup")}
          >
            Sign up
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
