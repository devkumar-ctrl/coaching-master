import { CloudinaryDiagnostic } from "@/components/cloudinary-diagnostic"

export default function TestPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Cloudinary Configuration Test</h1>
      <CloudinaryDiagnostic />
      
      <div className="mt-8 text-center">
        <p className="text-muted-foreground">
          Use this page to diagnose Cloudinary configuration issues in production.
        </p>
      </div>
    </div>
  )
}
