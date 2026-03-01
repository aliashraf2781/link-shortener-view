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
  FiLink,
  FiLogOut,
} from "react-icons/fi";
import { ServerStatus } from "./ServerStatus";

const frontendFeatures = [
  {
    icon: FiLock,
    title: "Authentication",
    description: "Secure login/register with NextAuth credentials provider and JWT tokens",
  },
  {
    icon: FiLock,
    title: "Password Recovery",
    description: "3-step forgot password flow: request → verify with OTP → reset",
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
  {
    icon: FiUsers,
    title: "User Management",
    description: "Profile management with session handling",
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
    description: "Every click captured with rich metadata and geolocation",
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
    path: "/api/register",
    description: "Register a new user",
    auth: false,
  },
  {
    method: "POST",
    path: "/api/login",
    description: "Login and receive token",
    auth: false,
  },
  {
    method: "POST",
    path: "/api/logout",
    description: "Revoke current token",
    auth: true,
  },
  {
    method: "GET",
    path: "/api/links",
    description: "List all user's links with visits",
    auth: true,
  },
  {
    method: "POST",
    path: "/api/generate",
    description: "Generate a new short link",
    auth: true,
  },
  {
    method: "GET",
    path: "/api/overview",
    description: "Global analytics summary",
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
    <div className="group rounded-lg border border-gray-200 p-5 transition-all hover:border-teal hover:shadow-lg hover:shadow-teal/10">
      <div className="inline-flex rounded-lg bg-teal/10 p-3 group-hover:bg-teal/20 transition-colors">
        <Icon className="h-5 w-5 text-teal" />
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
        <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-teal/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-teal/5 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal/10 px-4 py-2 text-sm font-semibold text-teal mb-6">
              <FiZap className="h-4 w-4" />
              Full-Stack Documentation
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
              <a
                href="/auth/login"
                className="inline-flex items-center gap-2 rounded-lg bg-teal px-8 py-3 font-semibold text-white hover:bg-teal-dark transition-colors"
              >
                Sign In
                <FiArrowRight className="h-5 w-5" />
              </a>
              <a
                href="/auth/register"
                className="inline-flex items-center gap-2 rounded-lg border border-teal px-8 py-3 font-semibold text-teal hover:bg-teal/5 transition-colors"
              >
                Create Account
              </a>
              <a
                href="#api-endpoints"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <FiBookOpen className="h-5 w-5" />
                API Reference
              </a>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <span className="text-sm font-medium text-gray-500">View Source:</span>
              <a
                href="https://github.com/aliashraf2781/link-shortener-view"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <FiCode className="h-4 w-4" />
                Frontend
                <FiExternalLink className="h-3 w-3" />
              </a>
              <a
                href="https://github.com/Abdelrahman-Abdullah/SaaS-Link-Management-API"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <FiServer className="h-4 w-4" />
                Backend
                <FiExternalLink className="h-3 w-3" />
              </a>
              <a
                href="https://github.com/MohamedEmad223/Dashboard-For-Url-Shortner-"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
              >
                <FiGlobe className="h-4 w-4" />
                Flutter
                <FiExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-3 mb-8">
            <FiTool className="h-8 w-8 text-teal" />
            <h2 className="text-3xl font-bold text-gray-900">Tech Stack</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-gray-200 p-6">
              <FiCode className="h-8 w-8 text-teal mb-3" />
              <h3 className="font-semibold text-gray-900">Frontend</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>• Next.js 16 App Router</li>
                <li>• React 19 with Compiler</li>
                <li>• Tailwind CSS v4</li>
                <li>• NextAuth.js</li>
                <li>• React Query (TanStack)</li>
              </ul>
            </div>
            <div className="rounded-lg border border-gray-200 p-6">
              <FiServer className="h-8 w-8 text-teal mb-3" />
              <h3 className="font-semibold text-gray-900">Backend</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>• Laravel (PHP)</li>
                <li>• Laravel Sanctum Auth</li>
                <li>• MySQL Database</li>
                <li>• RESTful JSON API</li>
                <li>• GeoLocation & Device Detection</li>
              </ul>
            </div>
            <div className="rounded-lg border border-gray-200 p-6">
              <FiDatabase className="h-8 w-8 text-teal mb-3" />
              <h3 className="font-semibold text-gray-900">Infrastructure</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>• MySQL Database</li>
                <li>• Sanctum Token Auth</li>
                <li>• Geo IP Database</li>
                <li>• User Agent Detection</li>
                <li>• Rate Limiting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* UI Components Section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <FiSquare className="h-8 w-8 text-teal" />
              <h2 className="text-3xl font-bold text-gray-900">Dashboard UI</h2>
            </div>
            <p className="mt-2 text-lg text-gray-600">Beautiful dashboard with modern navigation and controls</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 p-6">
              <FiLink className="h-8 w-8 text-teal mb-3" />
              <h3 className="font-semibold text-gray-900">Logo & Branding</h3>
              <ul className="mt-4 space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="h-2 w-2 bg-teal rounded-full mt-1.5 shrink-0" />
                  <span>Custom SVG logo integrated in dashboard header</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-2 w-2 bg-teal rounded-full mt-1.5 shrink-0" />
                  <span>Responsive design works on mobile and tablet</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-2 w-2 bg-teal rounded-full mt-1.5 shrink-0" />
                  <span>Optimized with Next.js Image component</span>
                </li>
              </ul>
            </div>
            <div className="rounded-lg border border-gray-200 p-6">
              <FiLogOut className="h-8 w-8 text-teal mb-3" />
              <h3 className="font-semibold text-gray-900">Logout Button</h3>
              <ul className="mt-4 space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="h-2 w-2 bg-teal rounded-full mt-1.5 shrink-0" />
                  <span>Beautiful red gradient styling with hover effects</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-2 w-2 bg-teal rounded-full mt-1.5 shrink-0" />
                  <span>Icon scales smoothly on hover for interactivity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-2 w-2 bg-teal rounded-full mt-1.5 shrink-0" />
                  <span>Located in sidebar footer with shadow effects</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-2 w-2 bg-teal rounded-full mt-1.5 shrink-0" />
                  <span>Safely revokes session and redirects to login</span>
                </li>
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
              <FiSquare className="h-8 w-8 text-teal" />
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
              <FiSettings className="h-8 w-8 text-teal" />
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
              <FiWifi className="h-8 w-8 text-teal" />
              <h2 className="text-3xl font-bold text-gray-900">API Endpoints</h2>
            </div>
            <p className="mt-2 text-lg text-gray-600">All endpoints are prefixed with <code>/api</code>. Protected routes 🔒 require <code>Authorization: Bearer token</code></p>
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
                    <td className="px-6 py-4 text-sm font-mono text-teal">{endpoint.path}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{endpoint.description}</td>
                    <td className="px-6 py-4">
                      <span className={endpoint.auth ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                        {endpoint.auth ? "🔒" : "✓"}
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
              <FiAward className="h-8 w-8 text-teal" />
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
          <div className="rounded-lg border border-teal/20 bg-teal/5 p-8">
            <div className="flex items-start gap-4">
              <FiShield className="h-8 w-8 text-teal shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Security & Rate Limiting</h2>
                <ul className="mt-4 space-y-3 text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-teal rounded-full" />
                    All operations are scoped to authenticated users
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-teal rounded-full" />
                    Link status toggle is rate limited to once every 2 days
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-teal rounded-full" />
                    Form Request validation prevents invalid or abusive values
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-teal rounded-full" />
                    Secure JWT tokens via Laravel Sanctum
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
