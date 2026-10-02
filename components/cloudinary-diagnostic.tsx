"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export function CloudinaryDiagnostic() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testCloudinary = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-cloudinary')
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: 'Failed to connect to test endpoint',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }
    setLoading(false)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🌤️ Cloudinary Configuration Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testCloudinary} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing Configuration...
            </>
          ) : (
            'Test Cloudinary Setup'
          )}
        </Button>

        {result && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {result.success ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <Badge className="bg-green-100 text-green-800">Configuration OK</Badge>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  <Badge variant="destructive">Configuration Error</Badge>
                </>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Details:</h4>
              <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>

            {!result.success && result.missingVars && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <h5 className="font-semibold text-red-800 mb-2">Missing Environment Variables:</h5>
                <ul className="list-disc list-inside text-red-700">
                  {result.missingVars.map((varName: string) => (
                    <li key={varName}>{varName}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          <p>This diagnostic tool helps identify configuration issues with Cloudinary in production.</p>
        </div>
      </CardContent>
    </Card>
  )
}
