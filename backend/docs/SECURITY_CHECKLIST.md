# 🔒 Security Checklist for 6ixminds Labs Admin Panel

## Pre-Deployment Checklist

### ✅ Authentication & Authorization

- [ ] **Change Default Password**
  - Login with default credentials (`6ixmindslabs` / `6@Minds^Labs`)
  - Navigate to Admin Panel → Settings → Security
  - Change password to a strong, unique password (minimum 16 characters)
  - Use a password manager to store credentials securely

- [ ] **Force Password Change**
  - Ensure `mustChangePassword` flag is working
  - Test that users are prompted to change password on first login

- [ ] **JWT Configuration**
  - Generate cryptographically secure JWT secrets:
    ```bash
    node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
    ```
  - Set `JWT_SECRET` and `JWT_REFRESH_SECRET` in `.env`
  - Configure appropriate token expiry times (recommend 24h for access, 7d for refresh)

- [ ] **Session Management**
  - Implement token refresh mechanism
  - Auto-logout on token expiration
  - Invalidate tokens on logout (maintain blacklist if using stateless JWT)

---

### ✅ Database Security

- [ ] **MongoDB Configuration**
  - Use MongoDB Atlas or managed database service in production
  - Enable authentication and authorization
  - Create database user with minimal required permissions
  - Enable encryption at rest
  - Regular backups configured (daily recommended)

- [ ] **Connection Security**
  - Use connection string with credentials stored in environment variables
  - Enable SSL/TLS for database connections
  - Restrict database access by IP whitelist if possible

- [ ] **Data Validation**
  - Implement schema validation in MongoDB
  - Sanitize all user inputs to prevent NoSQL injection
  - Use Mongoose schema validators

---

### ✅ Network Security

- [ ] **HTTPS Enforcement**
  - Obtain SSL/TLS certificate (Let's Encrypt recommended)
  - Configure web server (Nginx/Apache) to redirect HTTP → HTTPS
  - Enable HSTS (HTTP Strict Transport Security)
  - Set `Strict-Transport-Security` header: `max-age=31536000; includeSubDomains; preload`

- [ ] **CORS Configuration**
  - Restrict `Access-Control-Allow-Origin` to your frontend domain only
  - Do NOT use `*` in production
  - Configure in backend:
    ```javascript
    const allowedOrigins = ['https://6ixmindslabs.com', 'https://www.6ixmindslabs.com'];
    ```

- [ ] **Security Headers**
  - Implement the following headers (use `helmet` package):
    ```javascript
    app.use(helmet());
    app.use(helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"]
      }
    }));
    ```

---

### ✅ API Security

- [ ] **Rate Limiting**
  - Implement rate limiting on all API endpoints
  - Login endpoint: Maximum 5 attempts per 15 minutes per IP
  - General API: 100 requests/minute for authenticated users
  - Use `express-rate-limit` package

- [ ] **Input Validation**
  - Validate all request payloads using libraries like `joi` or `express-validator`
  - Reject malformed requests with 400 Bad Request
  - Sanitize HTML/SQL/NoSQL inputs

- [ ] **Error Handling**
  - Never expose stack traces or sensitive error details in production
  - Use generic error messages for authentication failures
  - Log detailed errors server-side only

- [ ] **Request Size Limits**
  - Limit request body size (e.g., 10MB for file uploads, 1MB for JSON)
  - Use `express.json({ limit: '1mb' })` and multer limits

---

### ✅ File Upload Security

- [ ] **File Validation**
  - Validate file types (whitelist: jpg, png, pdf, etc.)
  - Check file size limits
  - Scan files for malware (use ClamAV or VirusTotal API)

- [ ] **Storage Configuration**
  - Use cloud storage (AWS S3, Cloudinary) instead of local filesystem
  - Generate unique, unguessable filenames
  - Store files outside public web directory
  - Set appropriate S3 bucket policies (private by default)

- [ ] **File Serving**
  - Serve uploaded files through CDN with signed URLs
  - Never execute uploaded files
  - Set `Content-Disposition: attachment` for downloads

---

### ✅ Environment & Configuration

- [ ] **Environment Variables**
  - Never commit `.env` file to git (add to `.gitignore`)
  - Use different `.env` files for dev/staging/production
  - Store secrets in secure secret management (AWS Secrets Manager, HashiCorp Vault)

- [ ] **Logging & Monitoring**
  - Enable structured logging (use Winston or Pino)
  - Log all admin actions (audit trail)
  - Monitor failed login attempts
  - Set up alerts for suspicious activity

- [ ] **Dependencies**
  - Run `npm audit` regularly and fix vulnerabilities
  - Keep all dependencies up to date
  - Use `npm audit fix` or `npm update`
  - Review dependency licenses

---

### ✅ Access Control

- [ ] **IP Whitelisting (Optional but Recommended)**
  - Restrict admin panel access to specific IP addresses
  - Configure firewall rules or use middleware
  - Implement in Nginx/Apache or application layer

- [ ] **Role-Based Access Control (RBAC)**
  - Implement different roles: super-admin, admin, editor
  - Restrict sensitive operations to super-admin only
  - Verify user permissions on every API call

- [ ] **Two-Factor Authentication (Recommended)**
  - Implement 2FA using TOTP (Google Authenticator, Authy)
  - Use libraries like `speakeasy` and `qrcode`
  - Force 2FA for super-admin accounts

---

### ✅ Code Security

- [ ] **Code Quality**
  - Run ESLint with security rules
  - Use `eslint-plugin-security` to detect vulnerabilities
  - Perform code review before deployment

- [ ] **Secrets Management**
  - Never hardcode API keys, passwords, or tokens
  - Use environment variables or secret managers
  - Rotate secrets regularly (every 90 days recommended)

- [ ] **SQL/NoSQL Injection Prevention**
  - Use parameterized queries (Mongoose automatically does this)
  - Never concatenate user input into queries
  - Use `validator.escape()` for additional safety

---

### ✅ Server & Hosting

- [ ] **Server Hardening**
  - Disable unnecessary services and ports
  - Keep OS and software updated
  - Use firewall (UFW, iptables)
  - Disable root SSH login
  - Use SSH keys instead of passwords

- [ ] **Reverse Proxy**
  - Use Nginx or Apache as reverse proxy
  - Hide backend implementation details
  - Enable request filtering and rate limiting at proxy level

- [ ] **Process Management**
  - Use PM2 or systemd to manage Node.js process
  - Enable auto-restart on crashes
  - Configure process clustering for better performance

---

### ✅ Backup & Recovery

- [ ] **Database Backups**
  - Automated daily backups
  - Store backups in separate location (different region)
  - Test backup restoration regularly
  - Encrypt backup files

- [ ] **Code Backups**
  - Use Git for version control
  - Push to remote repository (GitHub, GitLab)
  - Tag production releases

---

### ✅ Compliance & Privacy

- [ ] **Data Protection**
  - Encrypt sensitive data at rest (user emails, personal info)
  - Use HTTPS for data in transit
  - Implement data retention policies

- [ ] **GDPR Compliance** (if applicable)
  - Allow users to request data deletion
  - Provide data export functionality
  - Document data processing activities

- [ ] **Audit Logging**
  - Log all admin actions with timestamps
  - Store logs securely and immutably
  - Retain logs for required duration (6-12 months minimum)

---

## Production Deployment Steps

1. **Pre-Deployment**
   ```bash
   # Run security audit
   npm audit
   
   # Run tests
   npm test
   
   # Build frontend
   npm run build
   ```

2. **Environment Setup**
   ```bash
   # Set NODE_ENV to production
   export NODE_ENV=production
   
   # Verify environment variables
   env | grep -E 'JWT|MONGO|AWS'
   ```

3. **Database Migration**
   ```bash
   # Run seed script to create admin user
   node backend/scripts/seedAdminUser.js
   ```

4. **First Login**
   - Login with seeded credentials
   - **Immediately change password**
   - Configure 2FA if available
   - Review all settings

5. **Post-Deployment**
   - Test all admin panel features
   - Verify rate limiting is working
   - Check error logging
   - Monitor server resources

---

## Security Monitoring

### Daily Checks
- [ ] Review failed login attempts
- [ ] Check system resource usage
- [ ] Review error logs for anomalies

### Weekly Checks
- [ ] Run `npm audit`
- [ ] Review audit logs
- [ ] Check backup integrity

### Monthly Checks
- [ ] Update dependencies
- [ ] Review and rotate API keys/secrets
- [ ] Security penetration testing
- [ ] Review user access permissions

---

## Common Vulnerabilities to Avoid

❌ **DO NOT:**
- Commit `.env` files or secrets to git
- Use default or weak passwords
- Expose error stack traces in production
- Allow unlimited file uploads
- Trust user input without validation
- Use outdated dependencies with known vulnerabilities
- Hardcode API keys or credentials
- Use HTTP in production
- Allow unrestricted CORS (`*`)
- Store passwords in plaintext

✅ **DO:**
- Use strong, unique passwords (16+ characters)
- Implement rate limiting
- Validate and sanitize all inputs
- Use HTTPS everywhere
- Keep dependencies updated
- Enable logging and monitoring
- Use environment variables for secrets
- Implement RBAC
- Regular security audits
- Backup regularly

---

## Emergency Response Plan

If a security breach is suspected:

1. **Immediate Actions**
   - Disable affected admin accounts
   - Rotate all secrets (JWT keys, database passwords, API keys)
   - Review audit logs for suspicious activity
   - Take database backup before investigation

2. **Investigation**
   - Check server access logs
   - Review application logs
   - Identify the attack vector

3. **Remediation**
   - Patch vulnerability
   - Reset all admin passwords
   - Notify affected users (if personal data compromised)
   - Deploy security fix

4. **Post-Incident**
   - Document incident and response
   - Update security procedures
   - Conduct team training

---

## Support & Resources

- **Node.js Security Best Practices:** https://nodejs.org/en/docs/guides/security/
- **OWASP Top 10:** https://owasp.org/www-project-top-ten/
- **MongoDB Security Checklist:** https://docs.mongodb.com/manual/administration/security-checklist/
- **npm Security Advisories:** https://www.npmjs.com/advisories

---

**Last Updated:** 2025-12-12  
**Version:** 1.0  
**Maintained by:** 6ixminds Labs Development Team
