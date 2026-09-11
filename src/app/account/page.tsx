import { PageHeader } from "@/components/page-header";

export default function AccountPage() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <PageHeader title="Account" fallbackHref="/you" />
      <div className="space-y-2 p-4 md:p-6">
        <h2 className="text-lg font-medium">Your account</h2>
        <p className="text-sm text-muted-foreground">
          Profile, location, notifications, and payment settings will live here.
        </p>
      </div>
    </div>
  );
}
