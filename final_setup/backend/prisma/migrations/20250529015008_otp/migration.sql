-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isOTPVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "otp" TEXT,
ADD COLUMN     "otpExpiry" TIMESTAMP(3);
