import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Cookie Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page will contain our cookie policy.</p>
        </CardContent>
      </Card>
    </div>
  );
}