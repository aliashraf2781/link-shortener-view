"use client";
import {
  FiZap,
  FiLock,
  FiLink2,
  FiGlobe,
  FiRotateCw,
  FiUsers,
  FiDatabase,
  FiCode,
  FiServer,
  FiArrowRight,
  FiBarChart,
  FiCheckCircle,
  FiBookOpen,
  FiTool,
  FiSquare,
  FiSettings,
  FiWifi,
  FiAward,
  FiShield,
  FiExternalLink,
} from "react-icons/fi";
import { ServerStatus } from "./ServerStatus";
import Link from "next/link";

const frontendFeatures = [
  {
    icon: FiLock,
    title: "Authentication",
    description: "Secure login/register with NextAuth credentials provider and JWT tokens",
  },
  {
    icon: FiLock,
    title: "Password Recovery",
    description: "3-step forgot password flow: request â†’ verify with OTP â†’ reset",
  },
  {
    icon: FiCheckCircle,
    title: "Protected Routes",
    description: "Middleware-based route protection for authenticated users only",
  },
  {
    icon: FiBarChart,
    title: "Analytics Dashboard",
    description: "Beautiful dashboard with charts, click trends, and deep insights",
  },
  {
    icon: FiZap,
    title: "Real-Time Updates",
    description: "React Query for efficient data fetching and caching",
  },
];

const backendFeatures = [
  {
    icon: FiLock,
    title: "Authentication",
    description: "Register, login, and logout via Laravel Sanctum",
  },
  {
    icon: FiLink2,
    title: "Short Link Generation",
    description: "Generate unique short codes for any URL with custom alias",
  },
  {
    icon: FiGlobe,
    title: "Smart Redirection",
    description: "Every click captured with rich metadata and geolocation. URLs structured as /go/{shortcode} for better organization",
  },
  {
    icon: FiRotateCw,
    title: "Link Status Toggle",
    description: "Activate/deactivate links with rate limiting (once every 2 days)",
  },
  {
    icon: FiBarChart,
    title: "Analytics",
    description: "Global overview, per-link deep analytics, trends, and live clicks feed",
  },
  {
    icon: FiUsers,
    title: "Multi-Tenant",
    description: "Each user can only access and manage their own links",
  },
];

const apiEndpoints = [
  {
    method: "POST",
    path: "/register",
    description: "Register a new user account",
    auth: false,
  },
  {
    method: "POST",
    path: "/login",
    description: "Authenticate user and receive access token",
    auth: false,
  },
  {
    method: "POST",
    path: "/logout",
    description: "Revoke current authentication token",
    auth: true,
  },
  {
    method: "POST",
    path: "/forgot-password",
    description: "Request password reset with email verification",
    auth: false,
  },
  {
    method: "POST",
    path: "/forgot-password/verify",
    description: "Verify reset code and get verification token",
    auth: false,
  },
  {
    method: "POST",
    path: "/reset-password",
    description: "Complete password reset with new password",
    auth: false,
  },
  {
    method: "GET",
    path: "/links",
    description: "List all user's shortened links with click statistics",
    auth: true,
  },
  {
    method: "POST",
    path: "/generate",
    description: "Generate a new short link with optional custom alias",
    auth: true,
  },
  {
    method: "DELETE",
    path: "/links/:id",
    description: "Delete a specific shortened link",
    auth: true,
  },
  {
    method: "PUT",
    path: "/links/:id/toggle",
    description: "Toggle link active/inactive status",
    auth: true,
  },
  {
    method: "GET",
    path: "/redirect",
    description: "Redirect to original URL and record click analytics. Accessed via /go/{shortcode} or /{shortcode}",
    auth: false,
  },
  {
    method: "GET",
    path: "/overview",
    description: "Get global analytics summary and dashboard metrics",
    auth: true,
  },
  {
    method: "GET",
    path: "/clicks-over-time",
    description: "Get click trends over specified period (week/month/year)",
    auth: true,
  },
  {
    method: "GET",
    path: "/link-analytics/:id",
    description: "Get detailed analytics for a specific link",
    auth: true,
  },
  {
    method: "GET",
    path: "/recent-clicks",
    description: "Get latest click events with metadata",
    auth: true,
  },
];

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-lg border border-gray-200 p-5 transition-all hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/10">
      <div className="inline-flex rounded-lg bg-teal-50 p-3 group-hover:bg-teal-100 transition-colors">
        <Icon className="h-5 w-5 text-teal-600" />
      </div>
      <h3 className="mt-3 font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
    </div>
  );
}

function MethodBadge({ method }: { method: string }) {
  const colors = {
    GET: "bg-blue-100 text-blue-700",
    POST: "bg-green-100 text-green-700",
    PUT: "bg-yellow-100 text-yellow-700",
    DELETE: "bg-red-100 text-red-700",
    PATCH: "bg-purple-100 text-purple-700",
  };
  return (
    <span className={`inline-flex items-center rounded px-2.5 py-0.5 text-xs font-semibold ${colors[method as keyof typeof colors] || colors.GET}`}>
      {method}
    </span>
  );
}

export function Documentation() {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-teal-300/5 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-600 mb-6">
              <FiZap className="h-4 w-4" />
              Project Documentation
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              SaaS Link Management
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              A complete full-stack solution for generating, managing, and analyzing short links with rich click analytics.
            </p>
            <div className="mx-auto mt-8 max-w-sm">
              <ServerStatus />
            </div>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-teal-600 to-teal-500 px-8 py-3 font-semibold text-white hover:from-teal-700 hover:to-teal-600 transition-colors shadow-md shadow-teal-600/20"
              >
                Sign In
                <FiArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 rounded-lg border border-teal-500 px-8 py-3 font-semibold text-teal-600 hover:bg-teal-50 transition-colors"
              >
                Create Account
              </Link>
              <Link
                href="#api-endpoints"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <FiBookOpen className="h-5 w-5" />
                API Reference
              </Link>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <span className="text-sm font-medium text-gray-500">View Source:</span>
              <Link
                href="https://github.com/aliashraf2781/link-shortener-view"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <FiCode className="h-4 w-4" />
                Frontend
                <FiExternalLink className="h-3 w-3" />
              </Link>
              <Link
                href="https://github.com/Abdelrahman-Abdullah/SaaS-Link-Management-API"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <FiServer className="h-4 w-4" />
                Backend
                <FiExternalLink className="h-3 w-3" />
              </Link>
              <Link
                href="https://github.com/MohamedEmad223/Dashboard-For-Url-Shortner-"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <FiGlobe className="h-4 w-4" />
                Flutter
                <FiExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-3 mb-8">
            <FiTool className="h-8 w-8 text-teal-600" />
            <h2 className="text-3xl font-bold text-gray-900">Tech Stack</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-gray-200 p-6">
              <FiCode className="h-8 w-8 text-teal-600 mb-3" />
              <h3 className="font-semibold text-gray-900">Frontend</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>â€¢ Next.js 16 App Router</li>
                <li>â€¢ React 19 with Compiler</li>
                <li>â€¢ Tailwind CSS v4</li>
                <li>â€¢ NextAuth.js</li>
                <li>â€¢ React Query (TanStack)</li>
              </ul>
            </div>
            <div className="rounded-lg border border-gray-200 p-6">
              <FiServer className="h-8 w-8 text-teal-600 mb-3" />
              <h3 className="font-semibold text-gray-900">Backend</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>â€¢ Laravel (PHP)</li>
                <li>â€¢ Laravel Sanctum Auth</li>
                <li>â€¢ MySQL Database</li>
                <li>â€¢ RESTful JSON API</li>
                <li>â€¢ GeoLocation & Device Detection</li>
              </ul>
            </div>
            <div className="rounded-lg border border-gray-200 p-6">
              <FiDatabase className="h-8 w-8 text-teal-600 mb-3" />
              <h3 className="font-semibold text-gray-900">Infrastructure</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>â€¢ MySQL Database</li>
                <li>â€¢ Sanctum Token Auth</li>
                <li>â€¢ Geo IP Database</li>
                <li>â€¢ User Agent Detection</li>
                <li>â€¢ Rate Limiting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Frontend Features */}
      <div className="px-4 py-16 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <FiSquare className="h-8 w-8 text-teal-600" />
              <h2 className="text-3xl font-bold text-gray-900">Frontend Features</h2>
            </div>
            <p className="mt-2 text-lg text-gray-600">Beautiful, responsive Next.js application with modern UX</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {frontendFeatures.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </div>

      {/* Backend Features */}
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <FiSettings className="h-8 w-8 text-teal-600" />
              <h2 className="text-3xl font-bold text-gray-900">Backend Features</h2>
            </div>
            <p className="mt-2 text-lg text-gray-600">Robust Laravel API with comprehensive analytics and security</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {backendFeatures.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </div>

      {/* API Endpoints */}
      <div className="px-4 py-16 sm:px-6 lg:px-8 bg-white" id="api-endpoints">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <FiWifi className="h-8 w-8 text-teal-600" />
              <h2 className="text-3xl font-bold text-gray-900">API Endpoints</h2>
            </div>
            <p className="mt-2 text-lg text-gray-600">All endpoints are prefixed with <code className="bg-gray-100 px-2 py-1 rounded text-teal-700">/api</code>. Protected routes require <FiLock className="inline h-5 w-5 text-red-600 mx-1" /> and bearer token.</p>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Method</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Endpoint</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Auth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {apiEndpoints.map((endpoint) => (
                  <tr key={endpoint.path} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <MethodBadge method={endpoint.method} />
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-teal-700">{endpoint.path}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{endpoint.description}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1">
                        {endpoint.auth ? (
                          <>
                            <FiLock className="h-4 w-4 text-red-600" />
                            <span className="text-xs font-semibold text-red-600">Required</span>
                          </>
                        ) : (
                          <>
                            <FiCheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-xs font-semibold text-green-600">Public</span>
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Code Example */}
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <FiAward className="h-8 w-8 text-teal-600" />
              <h2 className="text-3xl font-bold text-gray-900">Example: Generate Short Link</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-lg bg-gray-900 p-6 text-white font-mono text-sm overflow-x-auto">
              <pre>{`POST /api/generate
Authorization: Bearer {token}
Content-Type: application/json

{
  "original_url": "https://google.com",
  "title": "Google",
  "custom_alias": "my-google"
}`}</pre>
            </div>
            <div className="rounded-lg bg-gray-900 p-6 text-white font-mono text-sm overflow-x-auto">
              <pre>{`{
  "message": "Short link created",
  "status": "success",
  "data": {
    "id": 1,
    "original_link": "https://google.com",
    "short_code": "6nBf9w",
    "title": "Google",
    "custom_alias": "my-google",
    "clicks_count": 0
  }
}`}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-lg border border-teal-200/30 bg-teal-50 p-8">
            <div className="flex items-start gap-4">
              <FiShield className="h-8 w-8 text-teal-600 shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Security & Rate Limiting</h2>
                <ul className="mt-4 space-y-3 text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-teal-500 rounded-full" />
                    All operations are scoped to authenticated users
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-teal-500 rounded-full" />
                    Link status toggle is rate limited to once every 2 days
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-teal-500 rounded-full" />
                    Form Request validation prevents invalid or abusive values
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
