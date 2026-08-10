# UDS Graphic Design Academy — Full Website

This build runs without React, Vite or external npm packages. It includes a Node.js backend, persistent academy data, admin login, registration records, payment-status tracking, portfolio management and image-upload API.

## Run

1. Install Node.js 18+.
2. In this folder run:
   `ADMIN_PASSWORD="YourStrongPassword" npm start`
3. On Windows PowerShell:
   `$env:ADMIN_PASSWORD="YourStrongPassword"; npm start`
4. Open `http://localhost:3000`.

Admin username is `admin`. Use the password you set in `ADMIN_PASSWORD`.

Data: `data/database.json`  |  Uploads: `public/uploads/`

For live payment processing, add the credentials for your chosen Ghana payment provider on the server. Never put secret keys in browser JavaScript.
