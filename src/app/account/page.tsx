import { PageContainer } from "@/components/page-container";
import { PageHeader } from "@/components/page-header";

export default function AccountPage() {
  return (
    <PageContainer width="narrow">
      <PageHeader title="Account" fallbackHref="/you" />
      <div className="space-y-2 p-4 md:p-6">
        <h2>Your account</h2>
        <p className="text-muted-foreground">
          Profile, location, notifications, and payment settings will live here.
        </p>
      </div>
    </PageContainer>
  );
}
