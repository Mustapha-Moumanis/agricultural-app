# 🌾 CropAlert - Agricultural Alert Platform

## Overview

CropAlert is a collaborative platform that connects agronomists and farmers through real-time agricultural alerts and geolocated notifications. The platform enables agronomists to publish critical agricultural information while allowing farmers to receive relevant alerts based on their location and crop types.

## 🎯 Key Features

### ✅ Core MVP Features
- **Two-Role Authentication**: Separate dashboards for Agronomists and Farmers
- **Geolocated Alert Publishing**: Agronomists can publish alerts with precise location targeting
- **Smart Alert Feed**: Farmers receive filtered alerts based on location, crop types, and proximity
- **Interactive Map View**: Visual representation of alerts with real-time updates
- **Real-time Notifications**: WebSocket-based instant notifications
- **Mobile-Responsive Design**: Optimized UX for mobile devices

### 🚀 Advanced Features
- **Email Verification System**: Secure account verification with PIN codes
- **Location Setup Wizard**: Guided location configuration with GPS support
- **Alert Severity Levels**: Critical, High, Medium, Low priority system
- **Crop-Specific Filtering**: Filter alerts by specific crop types
- **Coverage Radius**: Customizable alert radius (1km to 50km)
- **Real-time WebSocket Updates**: Live alert updates without page refresh

## 🏗️ Technology Stack

### Backend (Django + DRF)
- **Framework**: Django 5.2.3 with Django REST Framework
- **Authentication**: dj-rest-auth with JWT tokens
- **WebSockets**: Django Channels for real-time communication
- **Database**: PostgreSQL/SQLite support
- **Email**: Configurable SMTP integration
- **API**: RESTful API with comprehensive endpoints

### Frontend (React + TypeScript)
- **Framework**: React 19 with TypeScript
- **Routing**: React Router DOM 7
- **UI Components**: Radix UI with Tailwind CSS 4
- **State Management**: React Hooks + Context API
- **Forms**: React Hook Form with Zod validation
- **Maps**: Leaflet integration for interactive maps
- **Notifications**: Sonner for toast notifications

### DevOps & Deployment
- **Containerization**: Docker & Docker Compose
- **Development**: Hot reload for both frontend and backend
- **Environment**: Configurable via environment variables

## 📦 Quick Start Guide

### Prerequisites
- Docker and Docker Compose installed
- Git for cloning the repository
- Modern web browser with geolocation support

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd agricultural-app
```

### 2. Environment Setup

Create environment files:

**Root `.env` file:**
```env
SECRET_KEY=your-super-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Database (SQLite for demo)
DATABASE_URL=sqlite:///db.sqlite3

# Superuser (for admin access)
DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_FIRSTNAME=Admin
DJANGO_SUPERUSER_LASTNAME=User
DJANGO_SUPERUSER_EMAIL=admin@cropalert.com
DJANGO_SUPERUSER_PASSWORD=admin123

# Email Configuration (optional for demo)
EMAIL_URL=smtp://user:password@localhost:25
```

**Frontend `.env` file** (`frontend/.env-frontend`):
```env
REACT_APP_API_URL=http://localhost:8000
```

### 3. Build and Run
```bash
# Build and start all services
make up

# Or manually with docker-compose
docker-compose up --build
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Django Admin**: http://localhost:8000/admin

## 👥 Demo User Accounts

### Quick Demo Setup
The application will automatically create demo data. You can also manually create accounts:

**Agronomist Account:**
- Role: Agronomist (can publish alerts)
- Features: Alert creation, map management, analytics dashboard

**Farmer Account:**
- Role: Farmer (receives alerts)
- Features: Alert feed, location-based filtering, notification preferences

## 🎮 Demo Scenarios

### Scenario 1: Agronomist Publishing an Alert
1. **Register as Agronomist**: Sign up with agronomist role
2. **Complete Location Setup**: Set your location using GPS or manual entry
3. **Create Alert**: 
   - Navigate to "New Alert" button
   - Fill in alert details (title, crop type, severity, description)
   - Set location coordinates and coverage radius
   - Preview and publish the alert
4. **Monitor Dashboard**: View published alerts and their statistics

### Scenario 2: Farmer Receiving Alerts
1. **Register as Farmer**: Sign up with farmer role
2. **Set Farm Location**: Configure your location for personalized alerts
3. **Browse Alert Feed**: 
   - View alerts filtered by proximity and crop relevance
   - Use filter options (crop type, severity, time range)
   - Save important alerts for later reference
4. **Interactive Map**: Explore alerts geographically and see coverage areas

### Scenario 3: Real-time Notifications
1. **Open Multiple Browser Windows**: One as agronomist, one as farmer
2. **Publish Alert**: Create and publish an alert as agronomist
3. **Observe Real-time Updates**: Watch the farmer's feed update instantly
4. **WebSocket Demo**: No page refresh needed - updates appear automatically

## 🔧 Development Commands

### Using Makefile (Recommended)
```bash
# Start all services
make up

# Build containers
make build

# Stop all services
make down

# View logs
make logs

# Restart services
make restart

# Clean up everything
make remove-all
```

### Manual Docker Commands
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild specific service
docker-compose build backend
docker-compose build frontend
```

### Backend Development
```bash
# Enter backend container
docker-compose exec backend bash

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run tests
python manage.py test
```

## 🗺️ API Documentation

### Core Endpoints

#### Authentication
- `POST /auth/login/` - User login
- `POST /auth/registration/` - User registration
- `POST /auth/logout/` - User logout
- `POST /auth/verify-email/` - Email verification
- `GET /auth/user/` - Current user details

#### Alerts
- `GET /alerts/` - List alerts (with location filtering)
- `POST /alerts/` - Create new alert
- `GET /alerts/{id}/` - Get specific alert
- `PUT /alerts/{id}/` - Update alert
- `DELETE /alerts/{id}/` - Delete alert
- `GET /alerts/my-alerts/` - User's published alerts

#### User Management
- `PUT /user/location/` - Update user location
- `GET /user/stats/` - User statistics

#### WebSocket Endpoints
- `ws://localhost:8000/ws/alerts/` - Real-time alert updates

### Sample API Usage

**Create Alert:**
```bash
curl -X POST http://localhost:8000/alerts/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Aphid Outbreak Warning",
    "description": "Severe aphid infestation detected in wheat fields",
    "crop": "Wheat",
    "category": "pest",
    "severity": "High",
    "latitude": 33.5731,
    "longitude": -7.5898,
    "radius": 5000,
    "date": "2025-06-24"
  }'
```

## 🎨 UI/UX Features

### Mobile-First Design
- Responsive layout optimized for mobile devices
- Touch-friendly interface elements
- GPS integration for easy location setup
- Optimized forms and navigation

### Real-time Experience
- Instant alert notifications
- Live map updates
- Real-time feed refresh
- WebSocket connection status indicator

### Accessibility
- ARIA-compliant interface
- Keyboard navigation support
- High contrast mode support
- Screen reader optimization

## 🔍 Testing the Platform

### Functional Testing Checklist

**Authentication Flow:**
- [ ] Register as different user types
- [ ] Email verification process
- [ ] Login/logout functionality
- [ ] Role-based dashboard access

**Alert Management:**
- [ ] Create alerts with different severities
- [ ] Test location-based filtering
- [ ] Verify real-time updates
- [ ] Test alert editing and deletion

**Location Features:**
- [ ] GPS location detection
- [ ] Manual location entry
- [ ] Radius-based alert filtering
- [ ] Map interaction and visualization

**Real-time Features:**
- [ ] WebSocket connection establishment
- [ ] Live alert notifications
- [ ] Instant feed updates
- [ ] Connection status handling

## 📱 Mobile Testing

### Browser Testing
Test on mobile browsers:
- Chrome Mobile
- Safari Mobile
- Firefox Mobile
- Samsung Internet

### Key Mobile Features
- GPS location access
- Touch-optimized maps
- Responsive alert cards
- Mobile-friendly forms

## 🔧 Troubleshooting

### Common Issues

**Backend not starting:**
```bash
# Check logs
docker-compose logs backend

# Rebuild backend
docker-compose build backend --no-cache
```

**Frontend build issues:**
```bash
# Clear node modules and rebuild
docker-compose down
docker-compose build frontend --no-cache
docker-compose up
```

**Database issues:**
```bash
# Reset database
docker-compose down
docker volume rm agricultural-app_db_data
docker-compose up --build
```

**WebSocket connection issues:**
- Ensure both backend and frontend are running
- Check CORS settings in backend
- Verify WebSocket URL in frontend configuration

### Performance Optimization

**Frontend:**
- React.memo for expensive components
- Debounced search inputs
- Lazy loading for map components
- Optimized image loading

**Backend:**
- Database query optimization
- Paginated API responses
- Efficient location filtering
- WebSocket connection pooling

## 🚀 Deployment Considerations

### Production Environment
```env
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
SECRET_KEY=production-secret-key
DATABASE_URL=postgresql://user:pass@host:port/dbname
EMAIL_URL=smtp://user:pass@smtp.provider.com:587
```

### Security Checklist
- [ ] Environment variables for secrets
- [ ] HTTPS configuration
- [ ] CORS settings
- [ ] Rate limiting
- [ ] Input validation
- [ ] SQL injection protection

## 📈 Analytics & Monitoring

### Built-in Analytics
- Alert publication statistics
- User engagement metrics
- Geographic distribution
- Response time tracking

### Monitoring Endpoints
- `/health/` - Health check
- `/admin/` - Admin interface
- WebSocket connection status

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

### Code Standards
- Python: PEP 8 compliance
- TypeScript: ESLint configuration
- React: Component best practices
- Git: Conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues and support:
1. Check the troubleshooting section
2. Review Docker logs
3. Check API documentation
4. Verify environment configuration

---

## 🎉 Demo Success Metrics

Your CropAlert demo should demonstrate:
- ✅ **Two-role authentication system**
- ✅ **Real-time alert publishing and receiving**
- ✅ **Location-based filtering (< 2km accuracy)**
- ✅ **Interactive map with alert visualization**
- ✅ **WebSocket real-time updates**
- ✅ **Mobile-responsive design**
- ✅ **Comprehensive API coverage**

**Quick Demo Time**: ~5 minutes to show all core features
**Setup Time**: ~3 minutes for complete environment setup

Enjoy exploring CropAlert! 🌾📱