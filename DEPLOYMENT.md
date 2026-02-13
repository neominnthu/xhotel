# XHotel PMS - Production Deployment Guide

## 🎉 System Overview

XHotel PMS is a comprehensive Property Management System built with Laravel 12 and React/TypeScript, designed for Myanmar hotel operations with English fallback support.

### ✅ Core Features Completed
- **Reservations Management**: Complete booking lifecycle
- **Front Desk Operations**: Check-in/check-out workflows
- **Advanced Billing**: Multi-payment processing and invoicing
- **Housekeeping Management**: Room maintenance and staff coordination
- **Admin Management**: User administration and system oversight

### 🏗️ Technical Stack
- **Backend**: Laravel 12.x, PHP 8.2, MySQL
- **Frontend**: React 19, TypeScript, Inertia.js, Tailwind CSS v4
- **Authentication**: Laravel Fortify with role-based access
- **Testing**: PHPUnit (129 tests, 600 assertions)

## 🚀 Deployment Instructions

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- MySQL 8.0+
- Git

### 1. Environment Setup

```bash
# Clone the repository
git clone <repository-url> xhotel
cd xhotel

# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 2. Database Configuration

```bash
# Configure your .env file with database credentials
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=xhotel
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Run migrations
php artisan migrate

# Seed the database (optional - for development data)
php artisan db:seed
```

### 3. Build Assets

```bash
# Build frontend assets for production
npm run build

# Or for development
npm run dev
```

### 4. Storage Setup

```bash
# Create symbolic link for file storage
php artisan storage:link
```

### 5. Start the Application

```bash
# Using Laravel Sail (recommended for development)
./vendor/bin/sail up

# Or using built-in server
php artisan serve
```

## 👥 User Roles & Permissions

### Available Roles
- **admin**: Full system access, user management
- **reservation_manager**: Reservation and guest management
- **front_desk**: Check-in/check-out operations
- **housekeeping**: Room maintenance tasks

### Default Admin User
After deployment, create your first admin user:
```bash
php artisan tinker
```
```php
User::create([
    'name' => 'Admin User',
    'email' => 'admin@xhotel.com',
    'password' => Hash::make('password'),
    'role' => 'admin',
    'email_verified_at' => now(),
]);
```

## 🔧 Configuration

### Environment Variables
Key configuration options in `.env`:

```env
# Application
APP_NAME="XHotel PMS"
APP_ENV=production
APP_KEY=base64:your-generated-key
APP_DEBUG=false
APP_URL=http://localhost

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=xhotel
DB_USERNAME=user
DB_PASSWORD=password

# Mail Configuration (for notifications)
MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null

# Currency (Myanmar Kyat)
CURRENCY_CODE=MMK
CURRENCY_SYMBOL=K
```

### Multi-Language Support
The system supports Myanmar (primary) and English languages. Language files are located in `resources/lang/`.

## 📊 System Monitoring

### Health Checks
```bash
# Run system health check
php artisan tinker
```
```php
// Check database connection
DB::connection()->getPdo();

// Check cache
Cache::store('redis')->getStore();

// Check queue (if using queues)
Queue::size();
```

### Logs
- Application logs: `storage/logs/laravel.log`
- Audit logs: Database table `audit_logs`
- Browser logs: Available in admin panel

## 🔒 Security Features

- **Role-Based Access Control**: Granular permissions per user role
- **Audit Logging**: All admin actions are logged with timestamps
- **CSRF Protection**: Automatic CSRF token validation
- **SQL Injection Prevention**: Eloquent ORM with prepared statements
- **XSS Protection**: Automatic output escaping
- **Password Security**: Bcrypt hashing with strength requirements

## 🧪 Testing

```bash
# Run all tests
php artisan test

# Run specific test suite
php artisan test tests/Feature/Admin/
php artisan test tests/Feature/Reservations/

# Run with coverage
php artisan test --coverage
```

## 📈 Performance Optimization

### Database Optimization
```bash
# Run database optimizations
php artisan db:monitor
php artisan migrate:status

# Cache configurations
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Frontend Optimization
```bash
# Production build with optimizations
npm run build

# Analyze bundle size
npm run build -- --analyze
```

## 🆘 Troubleshooting

### Common Issues

1. **Permission Errors**
   ```bash
   # Fix storage permissions
   chmod -R 755 storage/
   chmod -R 755 bootstrap/cache/
   ```

2. **Database Connection Issues**
   ```bash
   # Test database connection
   php artisan tinker
   DB::connection()->getPdo();
   ```

3. **Asset Compilation Issues**
   ```bash
   # Clear all caches
   php artisan view:clear
   php artisan config:clear
   php artisan cache:clear

   # Rebuild assets
   npm run build
   ```

4. **Queue Issues** (if using queues)
   ```bash
   # Start queue worker
   php artisan queue:work

   # Monitor failed jobs
   php artisan queue:failed
   ```

## 📞 Support & Maintenance

### Regular Maintenance Tasks
- **Daily**: Monitor application logs
- **Weekly**: Run test suite, check database performance
- **Monthly**: Update dependencies, review security patches
- **Quarterly**: Performance audits, backup verification

### Backup Strategy
```bash
# Database backup
mysqldump -u username -p database_name > backup.sql

# File backup
tar -czf backup.tar.gz storage/ public/uploads/

# Automated backups (crontab example)
0 2 * * * /path/to/backup-script.sh
```

## 🎯 Next Steps

The XHotel PMS v1 is production-ready. Future enhancements may include:
- Restaurant POS integration
- Spa management system
- KTV entertainment booking
- Smart lock integration
- Mobile companion app
- Advanced analytics dashboard

---

**Deployment Date**: February 13, 2026
**Version**: 1.0.0
**Status**: ✅ Production Ready