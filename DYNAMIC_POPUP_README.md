# Dynamic Popup System - Complete Guide

## Overview
The Dynamic Popup System is a comprehensive solution that allows admins to create MCQ questions for templates and shows these questions to users when they visit layout pages. The system collects user information and quiz responses, storing them in the database.

## Features

### 🎯 Core Functionality
- **Admin Question Management**: Create, edit, and delete MCQ questions for templates
- **User Information Collection**: Collect name, email, and password from users
- **Quiz System**: Present MCQ questions to users with automatic scoring
- **One-time Completion**: Users only need to complete questions once per template
- **Response Analytics**: Admin dashboard to view user responses and scores
- **Automatic Page Refresh**: Page refreshes after successful submission

### 📊 Data Collection
- User personal information (name, email, password)
- MCQ responses with correctness tracking
- Template-specific question sets
- Completion status tracking

## Database Schema

### TemplateQuestions Collection
```javascript
{
  templateId: ObjectId (ref: Template),
  questions: [{
    questionText: String,
    options: [{
      text: String,
      isCorrect: Boolean
    }],
    required: Boolean,
    order: Number
  }],
  isActive: Boolean,
  createdBy: ObjectId (ref: User),
  timestamps
}
```

### UserResponse Collection
```javascript
{
  templateId: ObjectId (ref: Template),
  userId: ObjectId (ref: User),
  userInfo: {
    name: String,
    email: String,
    password: String
  },
  responses: [{
    questionText: String,
    selectedOption: String,
    isCorrect: Boolean
  }],
  completed: Boolean,
  timestamps
}
```

## API Endpoints

### Admin Question Management
- `GET /api/admin/questions` - Fetch all template questions
- `POST /api/admin/questions` - Create questions for a template
- `PUT /api/admin/questions` - Update questions for a template
- `DELETE /api/admin/questions` - Delete questions for a template

### User Response Management
- `GET /api/user/responses?templateId=X&userId=Y` - Check user completion status
- `POST /api/user/responses` - Submit user responses
- `GET /api/user/responses` - Get all responses (admin view)

## Admin Interface

### 1. Questions Management (`/admin/questions`)
- **Create Questions**: Select template and create MCQ questions
- **Question Builder**: Add multiple questions with 4 options each
- **Validation**: Ensures exactly one correct answer per question
- **Template Selection**: Choose from available templates
- **Question Management**: View, edit, and delete existing questions

### 2. Responses Analytics (`/admin/responses`)
- **Response Overview**: View all user responses
- **Score Calculation**: Automatic percentage scoring
- **Filtering**: Filter responses by template
- **Statistics**: High, medium, and low score breakdowns
- **User Details**: View user information and response details

## User Experience

### Popup Flow
1. **Initial Check**: System checks if user has completed questions for the template
2. **User Info Form**: Collects name, email, and password
3. **Quiz Questions**: Presents MCQ questions (if admin has created them)
4. **Submission**: Saves responses and refreshes page
5. **Completion**: User won't see popup again for the same template

### Popup States
- **Loading**: Shows while checking user status
- **User Info**: First step to collect personal information
- **Questions**: Second step with MCQ questions
- **Hidden**: When user has already completed questions

## Implementation in Layout Pages

### Adding to Layout Pages
1. **Import Component**:
```javascript
import DynamicPopup from "../../components/DynamicPopup";
```

2. **Add State Variables**:
```javascript
const [templateId, setTemplateId] = useState(null);
const [popupComplete, setPopupComplete] = useState(false);
```

3. **Set Template ID**:
```javascript
const templateId = paymentPageTemplate._id;
setTemplateId(templateId);
```

4. **Add Component to JSX**:
```javascript
{templateId && (
  <DynamicPopup 
    templateId={templateId} 
    onComplete={() => setPopupComplete(true)}
  />
)}
```

## Admin Workflow

### Creating Questions for a Template
1. Navigate to `/admin/questions`
2. Select a template from the dropdown
3. Add questions using the question builder:
   - Enter question text
   - Add 4 options
   - Mark one option as correct
4. Click "Create Questions"

### Viewing User Responses
1. Navigate to `/admin/responses`
2. Use the filter to view responses by template
3. View individual user responses and scores
4. Analyze performance statistics

## Security Features

### Data Protection
- User information is stored securely
- Responses are validated server-side
- One-time completion prevents spam
- Admin-only access to question management

### Validation
- Required fields validation
- Email format validation
- Question structure validation
- Correct answer validation

## Customization Options

### Styling
The popup uses Tailwind CSS classes and can be customized by modifying:
- `app/components/DynamicPopup.js` - Main popup component
- Color schemes, animations, and layout

### Question Types
Currently supports:
- Multiple choice questions (4 options)
- Single correct answer per question
- Required/optional questions

### Future Enhancements
- Multiple question types (true/false, text input)
- Conditional questions
- Advanced scoring algorithms
- Email notifications

## Troubleshooting

### Common Issues
1. **Popup not showing**: Check if template has questions created
2. **User stuck in loop**: Clear localStorage and try again
3. **Questions not saving**: Verify admin permissions
4. **Responses not loading**: Check API endpoint connectivity

### Debug Steps
1. Check browser console for errors
2. Verify template ID is correct
3. Ensure user is logged in
4. Check database connectivity

## File Structure
```
app/
├── components/
│   └── DynamicPopup.js          # Main popup component
├── admin/
│   ├── questions/
│   │   └── page.js              # Admin question management
│   └── responses/
│       └── page.js              # Admin response analytics
├── api/
│   ├── admin/
│   │   └── questions/
│   │       └── route.js         # Admin question API
│   └── user/
│       └── responses/
│           └── route.js         # User response API
└── layouts/
    ├── layoutone/
    │   └── page.js              # Example layout with popup
    └── layouttwo/
        └── page.js              # Example layout with popup

modal/
└── DynamicPopop.js              # Database schemas

app/admin/Navbar.jsx             # Updated with new navigation links
```

## Getting Started

1. **Create Questions**: Go to `/admin/questions` and create questions for your templates
2. **Test Popup**: Visit any layout page to see the popup in action
3. **View Responses**: Check `/admin/responses` to see user data
4. **Customize**: Modify the popup component as needed

The system is now fully functional and ready to collect user information and quiz responses across all your template layouts! 