# Keycloak UI Customization – Technical Implementation

This repository provides detailed documentation on customizing Keycloak’s UI for user authentication workflows, covering installation, configuration, and frontend integration.


---

## Table of Contents
1. [Task Overview](#project-overview)  
2. [System Requirements](#system-requirements)  
3. [Installation & Setup](#installation--setup)  
4. [Realm & Client Configuration](#realm--client-configuration)  
5. [Custom Theme Development](#custom-theme-development)  
6. [Frontend Integration](#frontend-integration)  
7. [Email and SMTP Configuration](#email-and-smtp-configuration)  
8. [References](#references)  

---

## Task Overview

Keycloak UI customization was implemented to:  
- The goal of this project is to design and implement a fully customized Keycloak theme that aligns with the organization’s branding and improves the overall user experience.
- Keycloak, as an identity and access management solution, provides customizable login, registration, and account management pages. This project focuses on tailoring these UI components to create a cohesive and intuitive authentication experience for end users.

The approach involves creating a custom Keycloak theme, configuring authentication flows, email verification, and ensuring proper session management and redirect handling.

---

## System Requirements

| Component | Version / Requirement |
|-----------|---------------------|
| Operating System | Windows / macOS / Linux |
| Java Development Kit | OpenJDK 8 or higher |
| Node.js & npm | Node 20+, npm 10+ (for Angular integration) |
| Keycloak | 24.x+ |
| Tools | Git, IDE (VSCode/IntelliJ), Docker (optional) |

---

## Installation & Setup

#### Docker Images
The following Docker images were used for the setup:
- **Keycloak server image:** `quay.io/keycloak/keycloak:latest`
- **SMTP server image:** `haravich/fake-smtp-server` 
These images provide the runtime environment for Keycloak and the email server used for testing email verification.
### Docker Commands for Keycloak
```bash

docker run --name keycloak_local -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  -v C:\keycloak-themes\themes:/opt/keycloak/themes \
  quay.io/keycloak/keycloak:latest start-dev


```
- **-v C:\keycloak-themes\themes:/opt/keycloak/themes** - This mounts your local folder C:\keycloak-themes\themes into the Keycloak container at /opt/keycloak/themes, allowing Keycloak to use your custom themes.

(When customizing Keycloak themes, the filenames in your theme must match the base theme files. Source of Base Theme can find in - https://github.com/keycloak/keycloak/tree/main/themes/src/main/resources/theme/base)

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
Keycloak themes support inheritance, allowing your custom theme to extend an existing theme.  
This is configured in the `theme.properties` file using:

```
parent=<value>
```

Below is the explanation of all three options: `none`, `base`, and `keycloak`.

## 1. parent=none

**Meaning:**  
No inheritance. Your theme does **not** reuse any files from Keycloak.  
You must provide **every** required template, message file, and resource manually.

**Example Directory Structure:**

```
themes/
  my-theme/
    login/
      theme.properties        # parent=none
      login.ftl
      register.ftl
      messages.properties
      resources/
        css/
        js/
        img/
```

**Use Case:**  
Use this only when building a fully custom theme from scratch.

---

## 2. parent=base

**Meaning:**  
Inherits from Keycloak’s minimal `base` theme, which includes:
- Basic templates
- Basic logic
- No advanced styling

You only override what you want to customize.
![Parent = base theme](https://github.com/user-attachments/assets/ee435305-2896-4687-8b2a-2b419a179a14)



**Example Directory Structure:**

```
themes/
  my-theme/
    login/
      theme.properties        # parent=base
      resources/
        css/custom.css
```

**What You Automatically Inherit:**
- All default `.ftl` files
- Basic layout structure
- Message bundles

**Use Case:**  
Use this when you want to add:
- Custom CSS
- Minor layout overrides
- Small template changes

---

## 3. parent=keycloak

**Meaning:**  
Inherits from Keycloak’s official fully styled theme.  
This includes:
- Modern UI styling
- Layouts
- JS logic
- Responsive design

You only override what you want.
![Parent = keycloak theme](https://github.com/user-attachments/assets/3431e8bc-e3d7-48fa-b3f0-9b1cad9cf155)


**Example Directory Structure:**

```
themes/
  my-theme/
    login/
      theme.properties        # parent=keycloak
      resources/
        css/my-style.css
```

**Use Case:**  
Use this when you want:
- Branding changes (colors, fonts, logos)
- Light UI customizations
- Styling variations without rewriting pages

---


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

![SMTP configuration in Keycloak](https://github.com/delnajose/Keycloak_china/blob/main/Images/email1.png?raw=true)
![Testing email connectivity in Keycloak](https://github.com/delnajose/Keycloak_china/blob/main/Images/email2.png?raw=true)





---

## References
- [Keycloak Official Documentation](https://www.keycloak.org/documentation)  
- [Keycloak Theme Development Guide](https://www.keycloak.org/docs/latest/server_development/#_themes)  
- [Keycloak GitHub Repository](https://github.com/keycloak/keycloak)
