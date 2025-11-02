import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="flex items-center gap-2">
                <Image
                  src="/logo.svg"
                  alt="logo"
                  height={24}
                  width={30}
                />
                <span className="text-primary-100 font-semibold">PrepWise Admin</span>
              </Link>
            </div>

            <nav className="flex items-center gap-6">
              <Link
                href="/admin/dashboard"
                className="text-gray-700 hover:text-primary-100 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/create-interview"
                className="text-gray-700 hover:text-primary-100 transition-colors"
              >
                Create Interview
              </Link>
              <Link
                href="/admin/feedback"
                className="text-gray-700 hover:text-primary-100 transition-colors"
              >
                All Feedback
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <Button variant="outline" size="sm" asChild>
                <Link href="/sign-in">Logout</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
