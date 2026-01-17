import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Set tracesSampleRate to capture transactions for performance monitoring.
  // Adjust this value in production (0.1 = 10%, 1.0 = 100%)
  tracesSampleRate: parseFloat(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE || '0.1'),
  
  // Set `tracePropagationTargets` to control which URLs distributed tracing should be enabled for.
  tracePropagationTargets: [
    "localhost",
    /^https:\/\/[a-zA-Z0-9-]+\.yourdomain\.com\/api/,
    process.env.NEXT_PUBLIC_API_URL || '',
  ].filter(Boolean),
  
  // Capture Replay for 10% of all sessions,
  // plus 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});
