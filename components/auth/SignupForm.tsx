"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowRight, UserPlus } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/useToast";
import { CountrySelector } from "./CountrySelector";
import { OTPForm } from "./OTPForm";
import type { Country } from "@/types/auth";

const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d+$/, "Phone number must contain only digits")
    .min(6, "Phone number must be at least 6 digits")
    .max(15, "Phone number must be at most 15 digits"),
  countryCode: z.string().min(1, "Country is required"),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [showOTP, setShowOTP] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [userName, setUserName] = useState("");

  const { sendOtp, isLoading } = useAuthStore();
  const { showError, showSuccess, showInfo } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const watchedAcceptTerms = watch("acceptTerms");

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setValue("countryCode", country.code);
    setCountryCode(country.code);
  };

  const onSubmit = async (data: SignupFormData) => {
    try {
      setPhoneNumber(data.phone);
      setCountryCode(data.countryCode);
      setUserName(data.name);

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
    showSuccess("Account Created", "You are now logged in.");
    router.push("/dashboard");
  };

  const handleBackToSignup = () => {
    setShowOTP(false);
  };

  if (showOTP) {
    return (
      <OTPForm
        phoneNumber={phoneNumber}
        countryCode={countryCode}
        country={selectedCountry}
        onSuccess={handleOTPSuccess}
        onBack={handleBackToSignup}
      />
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold flex items-center">
          <UserPlus className="mr-2 h-5 w-5" />
          Create Account
        </CardTitle>
        <CardDescription>
          Sign up to start chatting with Gemini AI
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              disabled={isLoading}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

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

          {/* Terms and Conditions */}
          <div className="space-y-2">
            <div className="flex items-center space-x-1">
              <Checkbox
                id="acceptTerms"
                checked={watchedAcceptTerms}
                onCheckedChange={(checked) =>
                  setValue("acceptTerms", checked as boolean)
                }
                disabled={isLoading}
              />
              <Label
                htmlFor="acceptTerms"
                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal underline"
                  onClick={(e) => {
                    e.preventDefault();
                    // In a real app, this would open terms modal or page
                    showInfo(
                      "Terms & Conditions",
                      "Terms and conditions would be displayed here."
                    );
                  }}
                >
                  Terms & Conditions
                </Button>{" "}
                and{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal underline"
                  onClick={(e) => {
                    e.preventDefault();
                    // In a real app, this would open privacy policy modal or page
                    showInfo(
                      "Privacy Policy",
                      "Privacy policy would be displayed here."
                    );
                  }}
                >
                  Privacy Policy
                </Button>
              </Label>
            </div>
            {errors.acceptTerms && (
              <p className="text-sm text-destructive">
                {errors.acceptTerms.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !selectedCountry || !watchedAcceptTerms}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {/* Sign In Link */}
        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            Already have an account?{" "}
          </span>
          <Button
            variant="link"
            className="p-0 h-auto font-normal"
            onClick={() => router.push("/login")}
          >
            Sign in
          </Button>
        </div>

        {/* Additional Info */}
        <div className="text-center text-xs text-muted-foreground">
          <p>By creating an account, you'll be able to:</p>
          <ul className="mt-1 space-y-1">
            <li>• Chat with Gemini AI</li>
            <li>• Create multiple chatrooms</li>
            <li>• Upload and share images</li>
            <li>• Access your chat history</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
