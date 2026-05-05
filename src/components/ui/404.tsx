import Link from "next/link";
import { Button } from "@/components/ui/button";

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-slate-800 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">
            Page Not Found
          </h2>
          <p className="text-slate-600 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to access it.
          </p>
        </div>

        <div className="space-y-4">
          <Button variant="mybutton" className="w-full" asChild>
            <Link href="/Auth/Login">
              Sign In to Continue
            </Link>
          </Button>
          
          <Button variant="mycancel" className="w-full" asChild>
            <Link href="/">
              Go to Homepage
            </Link>
          </Button>
        </div>

        <p className="text-sm text-slate-500 mt-8">
          If you think this is an error, please contact support.
        </p>
      </div>
    </div>
  );
}

export default NotFound;
