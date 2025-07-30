# Angular 20 Starter Pack

A comprehensive Angular 20 starter pack featuring modern UI components, dynamic themes, charts, forms, AI chatbot, and responsive design.

## 🚀 Features

### Core Features
- **Angular 20** - Latest version with standalone components
- **Angular Material** - Latest Material Design components
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Chart.js** - Beautiful and interactive charts
- **TypeScript** - Strong typing and modern JavaScript features

### UI Components
- **Dynamic Header** - Responsive header with theme switcher and user menu
- **Sidebar Navigation** - Collapsible sidebar with nested menu support
- **Footer** - Clean footer with responsive design
- **Theme System** - Light, dark, and auto themes with smooth transitions

### Dashboard & Analytics
- **Interactive Dashboard** - Multiple chart types (Line, Bar, Doughnut, Polar, Radar)
- **Real-time Metrics** - Key performance indicators with trend indicators
- **Responsive Layout** - Mobile-first design that works on all devices

### Forms & Validation
- **Dynamic Forms** - Type-safe reactive forms with multiple field types
- **Form Validation** - Comprehensive validation with custom error messages
- **Field Types** - Text, Email, Password, Select, Multi-select, Date, Slider, Toggle, Chips

### AI Features
- **Chatbot Interface** - Modern chat UI with typing indicators
- **Smart Responses** - Context-aware AI responses
- **Quick Replies** - Predefined response options
- **Chat Export** - Download conversation history

### Authentication
- **Login System** - Secure authentication with form validation
- **Route Guards** - Protected routes with redirect functionality
- **User Management** - User profiles and role-based access

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Angular CLI** (v20 or higher)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd angular-starter-pack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

## 🎯 Demo Credentials

Use these credentials to test the application:

### Admin User
- **Username:** `admin`
- **Password:** `password`

### Regular User
- **Username:** `user`
- **Password:** `password`

## 📱 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run unit tests
- `npm run lint` - Run linting

## 🎨 Theme System

The application supports three theme modes:

1. **Light Theme** - Clean, bright interface
2. **Dark Theme** - Easy on the eyes, modern dark interface
3. **Auto Theme** - Automatically switches based on system preference

Themes can be switched using the theme toggle in the header or login page.

## 📊 Dashboard Features

### Chart Types
- **Line Charts** - Revenue trends and time-series data
- **Bar Charts** - Category comparisons and rankings
- **Doughnut Charts** - Percentage breakdowns and distributions
- **Polar Charts** - Feature usage and multi-dimensional data
- **Radar Charts** - Performance metrics and comparisons
- **Area Charts** - User activity and engagement metrics

### Metrics Cards
- Real-time data updates
- Trend indicators (up/down)
- Responsive grid layout
- Hover effects and animations

## 📝 Dynamic Forms

### Supported Field Types
- **Text Input** - Single-line text fields
- **Email** - Email validation
- **Password** - Secure password input
- **Number** - Numeric input with min/max validation
- **Textarea** - Multi-line text input
- **Select** - Single selection dropdown
- **Multi-select** - Multiple selection dropdown
- **Checkbox** - Boolean toggle
- **Radio** - Single choice from multiple options
- **Date Picker** - Calendar date selection
- **Slider** - Numeric range input
- **Toggle Switch** - Boolean slide toggle
- **Chips** - Tag-style selection

### Form Features
- Real-time validation
- Custom error messages
- Form reset functionality
- Data preview
- Responsive layout

## 🤖 AI Chatbot

### Features
- **Smart Mode** - Enhanced AI responses with context awareness
- **Quick Replies** - Predefined response options
- **Typing Indicators** - Real-time typing animation
- **Message History** - Persistent conversation history
- **Export Chat** - Download conversations as JSON
- **Responsive Design** - Works on mobile and desktop

### Suggested Prompts
- Quantum computing explanations
- JavaScript debugging help
- Creative writing assistance
- Remote work analysis
- Mobile app ideas
- Machine learning concepts

## 🎯 Responsive Design

The application is fully responsive and optimized for:
- **Desktop** - Full feature set with sidebar navigation
- **Tablet** - Adapted layout with collapsible sidebar
- **Mobile** - Touch-friendly interface with drawer navigation

### Breakpoints
- **Small** - 768px and below
- **Medium** - 769px to 1024px
- **Large** - 1025px and above

## 🔒 Security Features

- **Route Guards** - Protected routes requiring authentication
- **Form Validation** - Client-side input validation
- **CSRF Protection** - Built-in Angular security features
- **XSS Protection** - Sanitized content rendering

## 🏗️ Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── header/           # Header component with theme switcher
│   │   ├── sidebar/          # Navigation sidebar with nested menus
│   │   ├── footer/           # Footer component
│   │   ├── login/            # Authentication component
│   │   ├── dashboard/        # Dashboard with charts and metrics
│   │   ├── dynamic-forms/    # Dynamic form builder
│   │   └── chatbot/          # AI chatbot interface
│   ├── services/
│   │   ├── auth.service.ts   # Authentication service
│   │   └── theme.service.ts  # Theme management service
│   ├── guards/
│   │   └── auth.guard.ts     # Route protection
│   ├── app.component.ts      # Main app component
│   └── app.routes.ts         # Application routing
├── environments/             # Environment configurations
├── styles.scss              # Global styles and themes
└── index.html               # Main HTML file
```

## 🎨 Customization

### Adding New Themes
1. Define theme variables in `src/styles.scss`
2. Update `ThemeService` to include new theme
3. Add theme option to header component

### Adding New Chart Types
1. Import Chart.js chart type
2. Create new chart method in dashboard component
3. Add chart container to template

### Creating Custom Forms
1. Define form configuration in `DynamicFormsComponent`
2. Add new field types if needed
3. Update form validation logic

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Environment Configuration
Update environment files for different deployments:
- `src/environments/environment.ts` - Development
- `src/environments/environment.prod.ts` - Production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Angular Team** - For the amazing framework
- **Material Design** - For the beautiful components
- **Chart.js** - For the powerful charting library
- **Tailwind CSS** - For the utility-first CSS framework

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the demo credentials above

---

**Happy coding!** 🎉