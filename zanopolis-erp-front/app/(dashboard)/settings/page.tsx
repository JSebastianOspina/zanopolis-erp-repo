import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/shared/ui/page-header";

export default function SettingsPage() {
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK === "true";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

  return (
    <div className="space-y-6">
      <PageHeader title="Configuración" description="Preferencias del sistema" />
      <Card className="max-w-lg shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading text-base">Conexión API</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="text-muted-foreground">Modo: </span>
            <span className="font-medium">{useMock ? "Mock (local)" : "Producción"}</span>
          </p>
          <p>
            <span className="text-muted-foreground">URL base: </span>
            <span className="font-mono text-xs">{apiUrl}</span>
          </p>
          <p className="text-xs text-muted-foreground pt-2">
            Cambia <code className="rounded bg-muted px-1">NEXT_PUBLIC_USE_MOCK</code> y{" "}
            <code className="rounded bg-muted px-1">NEXT_PUBLIC_API_URL</code> en{" "}
            <code className="rounded bg-muted px-1">.env.local</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
