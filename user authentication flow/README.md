# Keycloak Authentication Flows: Mechanics & Variants

This document provides a clear and practical overview of Keycloak’s built-in authentication flows, how they work, and where they are used. It is designed for anyone exploring authentication flow customization in an auth server.

---

## 1. What Are Authentication Flows?
Authentication flows define **how a user is authenticated**. Each flow is a sequence of steps (executions) such as forms, conditions, or credentials. Keycloak lets you use its built-in flows or clone and customize them.

---

## 2. Built-In Flow Variants
Below are the main variants available in Keycloak, with diagrams and examples included under each.

### **2.1 Browser Flow**
- Used when a user logs in through a web browser.
- Involves redirects, login forms, OTP, social login, etc.

**Typical steps:**
- Cookie check
- Identity Provider redirect (optional)
- Username form
- Password form
- OTP validation (optional)
- Consent
- Profile review

**Diagram:**
```
User → Browser → Keycloak Login Page
         ↓
   Username/Password
         ↓
   [Optional OTP]
         ↓
      Auth Success
         ↓
   Redirect back to client
```

**Example scenario:** Add OTP to Browser Flow
1. Clone **Browser** flow
2. Add execution: *OTP Form*
3. Mark it as **REQUIRED**
4. Set the cloned flow as the new browser flow

**Result:** All users must enter OTP after password.

---

### **2.2 Direct Grant Flow**
- Used in non-browser scenarios.
- Client sends **username + password** directly to Keycloak’s token endpoint.

**Diagram:**
```
Client App → Token Endpoint → Validate Credentials → Issue Tokens
```

**Example scenario:** CLI or mobile app login
- App sends credentials via REST API to Keycloak
- Receives token without any UI interaction

---

### **2.3 Client Authentication Flow**
- Used when the **client itself** (not the user) authenticates.
- Mechanisms: client secret, mTLS, JWT assertion

**Typical use case:** Microservices or service accounts requesting tokens

**Diagram:**
```
Client App → Keycloak → Authenticate Client → Issue Token
```

---

### **2.4 Docker Auth Flow**
- Used when Docker clients interact with a registry protected by Keycloak

**Diagram:**
```
Docker CLI → Keycloak Token Endpoint → Validate Credentials → Issue Token → Registry Access
```

**Example scenario:** Authenticate private Docker registry using Keycloak token

---

### **2.5 Registration Flow**
- Handles **new user sign-up**.

**Typical steps:**
- Registration form
- Profile validation
- Password policy enforcement
- Email verification
- Required actions (e.g., configure OTP)

**Diagram:**
```
User → Registration Form → Profile & Password Validation → Email Verification → Registration Success
```

**Example scenario:** Add Captcha to Registration
1. Clone **Registration** flow
2. Add execution: *Recaptcha*
3. Enable Recaptcha in Realm → Security Defenses

**Result:** Bots can’t register.

---

### **2.6 Reset Credentials Flow**
- Handles “Forgot Password” functionality

**Typical steps:**
- Username or email input
- Email reset link
- New password form
- OTP validation (optional)

**Diagram:**
```
User → Enter Username → Email Link → Reset Password Form → Auth Success
```

**Example scenario:** Custom password reset steps
- Add OTP validation to Reset Credentials flow
- Enforce password policy checks

---

### **2.7 First Broker Login Flow**
- Used during login via an **identity provider** (Google, GitHub, SAML, etc.)

**Typical steps:**
- Receive IdP identity
- Find or create user
- Ask for linking with existing account (if needed)
- Validate email
- Update missing profile fields
- Required actions (optional)

**Diagram:**
```
User → External Identity Provider (Google) → Keycloak
         ↓
  First-time login checks
         ↓
 Account linking / profile update
         ↓
       Login success
```

**Example scenario:** Extra Check for First Broker Login
1. Clone **First Broker Login**.
2. Add execution: *Verify Existing Account*
3. Add execution: *Update Email Verification*

**Result:** Users logging in via Google for the first time must verify their email.

---

## 3. Can You Customize These Flows?
Yes. Keycloak lets you:
- Clone any built-in flow
- Add or remove execution steps
- Change the requirement of each step (REQUIRED, OPTIONAL, ALTERNATIVE)
- Add conditional authenticators (ex:: "if user has OTP then skip this step")
- Add custom authenticators using custom SPI extensions

You can also assign different flows to:
- Browser login
- Direct Grant
- Client Authentication
- Registration
- Reset Password
- First Broker Login

---

## 4. Where to Configure Them
**Realm Settings → Authentication → Flows**

You can:
- View built-in flows
- Clone flows
- Edit execution steps
- Bind flows to specific actions


