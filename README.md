# Keycloak UI Customization – Technical Implementation

This repository documents the comprehensive customization of Keycloak’s UI for login, registration, and email verification workflows, including installation, configuration, and integration with frontend applications.

---

## Table of Contents
1. [Project Overview](#project-overview)  
2. [System Requirements](#system-requirements)  
3. [Installation & Setup](#installation--setup)  
4. [Realm & Client Configuration](#realm--client-configuration)  
5. [Custom Theme Development](#custom-theme-development)  
6. [Frontend Integration](#frontend-integration)  
7. [Email and SMTP Configuration](#email-and-smtp-configuration)  
8. [Token Configuration and Management](#token-configuration-and-management)  
9. [References](#references)  

---

## Project Overview

Keycloak UI customization was implemented to:  
- Align the authentication interface with corporate branding.  
- Enhance user experience during login, registration, and email verification.  
- Integrate seamlessly with Angular-based frontend applications.  

The approach involves creating a custom Keycloak theme, configuring authentication flows, email verification, and ensuring proper session management and redirect handling.

---

## System Requirements

| Component | Version / Requirement |
|-----------|---------------------|
| Operating System | Windows / macOS / Linux |
| Java Development Kit | OpenJDK 8 or higher |
| Node.js & npm | Node 20+, npm 10+ (for Angular integration) |
| Keycloak | 21.x+ |
| Tools | Git, IDE (VSCode/IntelliJ), Docker (optional) |

---

## Installation & Setup

### Docker Commands for Keycloak
```bash
docker rm -f keycloak_local
docker run --name keycloak_local -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  -v C:\keycloak-themes\themes:/opt/keycloak/themes \
  quay.io/keycloak/keycloak:latest start-dev

docker restart keycloak_local
```
#### Docker Images
The following Docker images were used for the setup:
- **Keycloak server image:** `quay.io/keycloak/keycloak:latest`
- **SMTP server image:** `haravich/fake-smtp-server` or `test-smtp-local`
These images provide the runtime environment for Keycloak and the email server used for testing email verification.

### 1. Java Installation
```bash
java -version
```
Ensure OpenJDK 8+ is installed and properly configured in `PATH`.

### 2. Node.js & Angular Setup
```bash
node -v
npm -v
npm install -g @angular/cli
```


## Realm & Client Configuration

### 1. Create Realm
- Navigate to Admin Console → **Add Realm**
- Provide `Realm Name` and `Display Name`.

### 2. Configure Client
- Add new client with:
  - Client Protocol: `openid-connect`
  - Valid Redirect URIs: `http://localhost:4200/*`
  - Web Origins: `http://localhost:4200`
  - Root URL: Angular app URL


### 3. Authentication Flows
- Customize login, registration, and email verification flows.
- Enable or disable features as per application requirements.

---

## Custom Theme Development

### 1. Theme Directory Structure
```text
keycloak-themes/
└── my-custom-theme/
    ├── login/
    │   ├── theme.properties
    │   ├── resources/
    │   │   ├── css/
    │   │   ├── js/
    │   │   └── img/
```
*Note: This theme only includes a `login` folder; `account` and `common` folders are not used.*

### 2. theme.properties Configuration
```properties
parent=keycloak
import=common/keycloak
styles=css/login.css css/styles.css
scripts=js/authChecker.js js/custom.js
```

- **parent=keycloak**: Inherits all templates, styles, and scripts from the default Keycloak theme.
- **import=common/keycloak**: Imports shared components and templates from Keycloak's common folder for consistent layout.
- **styles=css/login.css css/styles.css**: Specifies CSS files to style the login page and any additional theme-wide styles.
- **scripts=js/authChecker.js js/custom.js**: Specifies JavaScript files to add custom client-side behavior.
  

### 3. Enable Theme in Keycloak
- Admin Console → **Realm Settings → Themes → Login Theme** → Select `my-custom-theme`

### 4. Development Notes
- Use FreeMarker templates (`*.ftl`) for page rendering.
- CSS, JS, and images can be included in the theme’s `/resources` folder.
- Ensure proper cache clearing when updating themes:
```bash
./bin/kc.sh stop
./bin/kc.sh start-dev --cache-clear
```

---

## Frontend Integration (Angular)

### 1. Install Keycloak Adapter
```bash
npm install keycloak-angular keycloak-js
```

### 2. main.ts Configuration
```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideKeycloak } from 'keycloak-angular';

bootstrapApplication(App, {
  providers: [
    provideKeycloak({
      config: {
        url: 'http://localhost:8080',
        realm: 'myrealm',
        clientId: 'siemens-portal'
      },
      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false
      }
    }),
    ...appConfig.providers
  ]
}).catch(err => console.error(err));
```

### 3. Handle Login/Logout
- Redirect users to Keycloak login page.
- Use `keycloak.logout()` to clear sessions and cookies.

---

## Email and SMTP Configuration

Keycloak email functionality (for registration verification, etc.) was configured with a local SMTP server.

### SMTP Setup

- Network Settings:
  - SMTP ports exposed: `1025/tcp` and `1080/tcp`
  - IP assigned to container: `172.17.0.3`

### Keycloak Email Configuration
- Go to **Realm Settings → Email**
- Set SMTP host, port, and sender email (`From` address)
- Example:
  - Host: `localhost`
  - Port: `1025`
  - From: `noreply@example.com`
- Verify connectivity using **Test Connection** in Keycloak console.

---

![Email setup](https://github.com/delnajose/Keycloak_china/blob/main/Images/email1.png)
![Email setup](https://github.com/delnajose/Keycloak_china/blob/main/Images/email2.png)

## Token Configuration and Management

### ID, Access, and Refresh Tokens
These tokens are automatically issued for any client using the **OpenID Connect** protocol. To ensure they are enabled and properly configured:

#### 1. Verify OIDC Client Configuration
- Go to: **Clients → <your-client> → Settings**
- Ensure **Client Protocol = OpenID Connect**
- Enable **Standard Flow** (required for issuing ID and access tokens)

#### 2. Manage Token Lifespans
Go to: **Realm Settings → Tokens**
- **Access Token Lifespan** (default: ~5 minutes)



### JWK (JSON Web Keys)
These are **public keys** used to verify token signatures. They are enabled by default.

#### Where to find them
```
/realms/<realm>/protocol/openid-connect/certs
```


## References
- [Keycloak Official Documentation](https://www.keycloak.org/documentation)  
- [Keycloak Theme Development Guide](https://www.keycloak.org/docs/latest/server_development/#_themes)  
- [Keycloak GitHub Repository](https://github.com/keycloak/keycloak)
