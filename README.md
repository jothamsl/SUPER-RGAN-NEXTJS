# Super Resolution Frontend

A Next.js React application that provides a user-friendly interface for image super-resolution enhancement using SRGAN.

## Features

- **Drag & Drop Interface**: Intuitive file upload with drag-and-drop support
- **Real-time Progress**: Visual feedback during image processing
- **Before/After Comparison**: Side-by-side image comparison with zoom capabilities
- **Statistics Dashboard**: Detailed metrics including file sizes, processing time, and enhancement ratio
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS and Radix UI components
- **Error Handling**: Comprehensive error states and user feedback

## Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager
- A running backend server (see backend README)

## Installation

1. Clone the repository and navigate to the frontend directory:
```bash
cd super-resolution-app/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your backend URL
```

4. Configure the backend URL in `.env.local`:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

## Running the Application

### Development Mode
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Production Build
```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL | http://localhost:3001 |

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.jsx         # Root layout component
│   └── page.jsx           # Main application page
├── components/            # Reusable React components
│   ├── ui/               # UI component library
│   ├── image-comparison.jsx
│   ├── loading-overlay.jsx
│   └── stats-dashboard.jsx
├── lib/                   # Utility functions
│   └── utils.js
├── public/               # Static assets
├── styles/               # Additional stylesheets
└── hooks/                # Custom React hooks
```

## Components

### Main Components

- **HomePage**: Main application interface with file upload and enhancement
- **ImageComparison**: Side-by-side comparison of original and enhanced images
- **StatsDashboard**: Display of processing metrics and statistics
- **LoadingOverlay**: Progress indicator during image processing

### UI Components

Built with Radix UI and styled with Tailwind CSS:
- Button, Card, Progress, Toast components
- Dialog, Dropdown, Tooltip components
- Form components and inputs

## Features in Detail

### Image Upload
- Supports multiple formats: JPEG, PNG, GIF, WebP, HEIC
- Maximum file size: 10MB
- Drag and drop interface
- File validation and error handling

### Image Processing
- Connects to backend API for SRGAN enhancement
- Real-time progress tracking
- Timeout handling (5 minutes)
- Automatic retry on network errors

### Results Display
- Before/after image comparison
- Zoom and pan functionality
- Download enhanced image
- Processing statistics

### Statistics
- Original vs enhanced file sizes
- Processing time
- Enhancement ratio
- Image metadata

## Deployment

### Deploy to Vercel

1. Make the deployment script executable:
```bash
chmod +x deploy-vercel.sh
```

2. Run the deployment script:
```bash
./deploy-vercel.sh
```

3. Follow the prompts to:
   - Install Vercel CLI (if needed)
   - Login to Vercel
   - Set your backend URL
   - Deploy the application

### Manual Vercel Setup

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
vercel --prod
```

4. **Set Environment Variables** in Vercel dashboard:
```
NEXT_PUBLIC_BACKEND_URL=https://your-backend.onrender.com
```

### Alternative Deployment Platforms

#### Netlify
1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify
3. Set environment variables in Netlify dashboard

#### GitHub Pages
1. Enable static export in `next.config.js`
2. Build: `npm run build && npm run export`
3. Deploy the `out` folder to GitHub Pages

## Configuration

### Next.js Configuration

The application uses several Next.js features:
- App Router (Next.js 13+)
- Static Site Generation (SSG)
- Image Optimization
- Font Optimization

### Tailwind CSS

Custom configuration includes:
- Custom color schemes
- Animation utilities
- Component variants
- Dark/light theme support

## Performance Optimization

- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Bundle Analysis**: Use `npm run analyze` to analyze bundle size
- **Caching**: Static assets cached by CDN

## Browser Support

- Chrome 64+
- Firefox 67+
- Safari 12+
- Edge 79+

## Troubleshooting

### Common Issues

1. **Backend Connection Failed**:
   - Verify `NEXT_PUBLIC_BACKEND_URL` is correct
   - Check that backend server is running
   - Ensure CORS is properly configured on backend

2. **Image Upload Fails**:
   - Check file size (max 10MB)
   - Verify file format is supported
   - Check network connection

3. **Build Errors**:
   - Clear `.next` folder: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

4. **Deployment Issues**:
   - Verify environment variables are set
   - Check build logs for errors
   - Ensure backend URL is accessible from deployment platform

### Development Tips

- Use browser dev tools to monitor network requests
- Check console for JavaScript errors
- Use React Developer Tools for component debugging
- Monitor bundle size with webpack-bundle-analyzer

## API Integration

The frontend communicates with the backend through REST API:

```javascript
// Image enhancement request
const response = await fetch(`${BACKEND_URL}/api/enhance`, {
  method: 'POST',
  body: formData
});
```

### Request Format
- Method: POST
- Content-Type: multipart/form-data
- Body: FormData with image file

### Response Format
```json
{
  "success": true,
  "enhancedImage": "data:image/png;base64,...",
  "originalSize": 245760,
  "enhancedSize": 1048576,
  "processingTime": 2500
}
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Development Guidelines

- Follow React best practices
- Use TypeScript for type safety
- Write unit tests for components
- Follow the existing code style
- Update documentation for new features

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check this README and troubleshooting section
2. Review browser console for errors
3. Check network tab for API request failures
4. Open an issue in the GitHub repository