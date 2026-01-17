# Sentry.io Guide for SpeakLabs

## What is Sentry?

**Sentry** is an error monitoring and performance tracking platform that helps you:
- **Catch errors** before users report them
- **See full stack traces** with source code context
- **Track performance** issues (slow API calls, page loads)
- **Monitor releases** and see which deployments introduced bugs
- **Get alerts** when errors spike
- **Debug with context** - user actions, browser info, network requests

Think of it as a "black box recorder" for your application - it automatically captures what went wrong and why.

---

## How Sentry Works

```
Your App → Error Occurs → Sentry SDK Captures → Sentry Dashboard
   ↓            ↓                ↓                    ↓
Frontend    Exception      Stack trace,        You see the
Backend     or Error      user context,       error with full
            happens       breadcrumbs         debugging info
```

### Key Concepts:

1. **DSN (Data Source Name)**: Your unique Sentry project URL - tells the SDK where to send errors
2. **Events**: Each error/exception captured is an "event"
3. **Issues**: Grouped similar errors become "issues"
4. **Breadcrumbs**: User actions leading up to the error (clicks, API calls, navigation)
5. **Context**: Additional data (user ID, environment, tags)

---

## Current Setup Status

### ✅ Already Configured:

**Backend (FastAPI):**
- Sentry SDK installed (`sentry-sdk[fastapi]`)
- Initialized in `backend/main.py`
- Error capturing in all API endpoints using `sentry_sdk.capture_exception(e)`

**Frontend (Next.js):**
- Sentry SDK installed (`@sentry/nextjs`)
- Client-side config: `frontend/sentry.client.config.ts`
- Server-side config: `frontend/sentry.server.config.ts`
- Error capturing in components using `Sentry.captureException(error)`
- Next.js config wrapped with Sentry

### ❌ Missing:

1. **Sentry Account & Project** - You need to create a free account
2. **DSN Keys** - Need to add to environment variables
3. **Source Maps** (optional) - For better stack traces in production

---

## Step-by-Step Setup

### 1. Create Sentry Account

1. Go to [sentry.io](https://sentry.io)
2. Sign up for free (Developer plan is free forever)
3. Create a new project:
   - Select **Next.js** for frontend
   - Select **Python** for backend
4. Copy your **DSN** (Data Source Name) - looks like: `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`

### 2. Configure Backend

Add to `backend/.env`:
```bash
SENTRY_DSN=https://your-backend-dsn@sentry.io/your-project-id
SENTRY_TRACES_SAMPLE_RATE=0.1
SENTRY_PROFILES_SAMPLE_RATE=0.1
```

### 3. Configure Frontend

Add to `frontend/.env.local`:
```bash
NEXT_PUBLIC_SENTRY_DSN=https://your-frontend-dsn@sentry.io/your-project-id
NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=0.1
NEXT_PUBLIC_SENTRY_TRACE_PROPAGATION_TARGETS=http://localhost:8000
```

For production builds (optional):
```bash
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=your-project-slug
```

### 4. Test It!

Add a test error to see if it works:

**Backend test** (`backend/main.py`):
```python
@app.get("/test-error")
def test_error():
    try:
        raise ValueError("This is a test error for Sentry!")
    except Exception as e:
        sentry_sdk.capture_exception(e)
        raise HTTPException(status_code=500, detail=str(e))
```

**Frontend test** (`frontend/app/page.tsx`):
```typescript
// Add a test button
<button onClick={() => {
  throw new Error("Test Sentry error!");
}}>Test Error</button>
```

Visit the endpoint or click the button, then check your Sentry dashboard!

---

## How to Use Sentry for Debugging

### 1. Automatic Error Capture

Errors are **already being captured** in your code:

**Backend** (`backend/main.py`):
```python
try:
    # Your code
except Exception as e:
    sentry_sdk.capture_exception(e)  # ← Automatically sends to Sentry
    raise HTTPException(status_code=500, detail=str(e))
```

**Frontend** (`frontend/components/AudioRecorder.tsx`):
```typescript
try {
    // Your code
} catch (error) {
    Sentry.captureException(error);  // ← Automatically sends to Sentry
    alert('Failed to access microphone');
}
```

### 2. Manual Error Reporting

You can also manually capture errors with context:

**Backend:**
```python
import sentry_sdk

# Capture exception with context
try:
    result = risky_operation()
except Exception as e:
    sentry_sdk.set_context("user", {"id": user_id, "email": user_email})
    sentry_sdk.set_tag("feature", "audio_upload")
    sentry_sdk.capture_exception(e)
```

**Frontend:**
```typescript
import * as Sentry from '@sentry/nextjs';

try {
    await uploadAudio();
} catch (error) {
    Sentry.setContext("recording", {
        duration: recordingTime,
        format: "webm",
        size: audioBlob.size
    });
    Sentry.setTag("component", "AudioRecorder");
    Sentry.captureException(error);
}
```

### 3. Capture Messages (Non-Errors)

For important events that aren't errors:

**Backend:**
```python
sentry_sdk.capture_message("User completed speech analysis", level="info")
```

**Frontend:**
```typescript
Sentry.captureMessage("Recording started", "info");
```

### 4. Add User Context

Identify which user encountered the error:

**Backend:**
```python
sentry_sdk.set_user({
    "id": user_id,
    "email": user_email,
    "username": username
})
```

**Frontend:**
```typescript
Sentry.setUser({
    id: sessionId,
    email: userEmail,
    username: userName
});
```

### 5. Performance Monitoring

Sentry automatically tracks:
- API endpoint performance (FastAPI)
- Page load times (Next.js)
- Database query times
- External API calls

View in Sentry dashboard under **Performance**.

### 6. Breadcrumbs (User Actions)

Sentry automatically captures:
- Console logs
- Network requests
- DOM interactions
- Navigation events

You can add custom breadcrumbs:

**Frontend:**
```typescript
Sentry.addBreadcrumb({
    category: 'user',
    message: 'User clicked start recording',
    level: 'info',
    data: { timestamp: Date.now() }
});
```

---

## What You'll See in Sentry Dashboard

When an error occurs, Sentry shows you:

1. **Error Message** - What went wrong
2. **Stack Trace** - Exact line of code that failed
3. **Breadcrumbs** - What the user did before the error
4. **User Info** - Who encountered it (if set)
5. **Environment** - Development/Production
6. **Release** - Which version of your code
7. **Tags** - Custom labels you added
8. **Context** - Additional data you provided
9. **Frequency** - How many times it happened
10. **Affected Users** - How many users hit this error

---

## Best Practices

### 1. Don't Capture Everything

Only capture meaningful errors:
```typescript
// ❌ Bad - captures user input validation errors
if (!email.includes('@')) {
    Sentry.captureException(new Error("Invalid email"));
}

// ✅ Good - only capture unexpected errors
try {
    await processPayment();
} catch (error) {
    if (error instanceof ValidationError) {
        // User error, don't send to Sentry
        return { error: "Invalid input" };
    }
    // Unexpected error, send to Sentry
    Sentry.captureException(error);
}
```

### 2. Add Context Before Capturing

```typescript
// ✅ Good - provides debugging context
Sentry.setContext("audio", {
    format: "webm",
    duration: 30,
    size: blob.size
});
Sentry.setTag("feature", "recording");
Sentry.captureException(error);
```

### 3. Use Different DSNs for Dev/Prod

```bash
# Development
NEXT_PUBLIC_SENTRY_DSN=https://dev-dsn@sentry.io/...

# Production
NEXT_PUBLIC_SENTRY_DSN=https://prod-dsn@sentry.io/...
```

### 4. Filter Sensitive Data

Sentry automatically filters:
- Passwords
- Credit cards
- API keys (if in headers)

You can add custom filters in Sentry dashboard settings.

### 5. Set Up Alerts

In Sentry dashboard:
- Go to **Alerts** → **Create Alert Rule**
- Get notified when errors spike
- Set up Slack/Email notifications

---

## Example: Enhanced Error Handling

Here's how you could improve your current error handling:

**Before:**
```typescript
catch (error) {
    console.error('Error:', error);
    Sentry.captureException(error);
    alert('Failed');
}
```

**After:**
```typescript
catch (error) {
    // Add context for debugging
    Sentry.setContext("recording", {
        sessionId: sessionId,
        recordingTime: recordingTime,
        blobSize: audioBlob?.size,
        timestamp: new Date().toISOString()
    });
    
    Sentry.setTag("component", "AudioRecorder");
    Sentry.setTag("action", "upload");
    
    // Capture with additional info
    Sentry.captureException(error, {
        extra: {
            apiUrl: process.env.NEXT_PUBLIC_API_URL,
            userAgent: navigator.userAgent
        }
    });
    
    // User-friendly error message
    alert('Failed to upload recording. Please try again.');
}
```

---

## Troubleshooting

### Errors Not Appearing?

1. **Check DSN is set:**
   ```bash
   echo $NEXT_PUBLIC_SENTRY_DSN  # Should not be empty
   ```

2. **Check network tab** - Look for requests to `sentry.io`

3. **Check Sentry dashboard** - Make sure you're looking at the right project

4. **Check browser console** - Sentry logs initialization errors

### Too Many Errors?

Adjust sample rate in `.env`:
```bash
NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=0.01  # Only 1% of transactions
```

### Want to Disable in Development?

```typescript
Sentry.init({
    dsn: process.env.NODE_ENV === 'production' 
        ? process.env.NEXT_PUBLIC_SENTRY_DSN 
        : undefined,
    // ...
});
```

---

## Next Steps

1. ✅ Create Sentry account
2. ✅ Add DSN to environment variables
3. ✅ Test with a sample error
4. ✅ Set up alerts for critical errors
5. ✅ Add user context to identify affected users
6. ✅ Monitor performance in production

---

## Resources

- [Sentry Documentation](https://docs.sentry.io/)
- [Next.js Sentry Setup](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Python/FastAPI Sentry Setup](https://docs.sentry.io/platforms/python/guides/fastapi/)
- [Sentry Dashboard](https://sentry.io)

---

## Quick Reference

**Backend:**
```python
import sentry_sdk

# Capture exception
sentry_sdk.capture_exception(e)

# Capture message
sentry_sdk.capture_message("Info message", level="info")

# Set user
sentry_sdk.set_user({"id": user_id})

# Set context
sentry_sdk.set_context("key", {"data": "value"})

# Set tag
sentry_sdk.set_tag("feature", "audio")
```

**Frontend:**
```typescript
import * as Sentry from '@sentry/nextjs';

// Capture exception
Sentry.captureException(error);

// Capture message
Sentry.captureMessage("Info", "info");

// Set user
Sentry.setUser({ id: userId });

// Set context
Sentry.setContext("key", { data: "value" });

// Set tag
Sentry.setTag("feature", "audio");
```
