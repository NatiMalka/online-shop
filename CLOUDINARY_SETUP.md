# Cloudinary Setup Guide

This guide will help you set up Cloudinary for image uploads in your online shop.

## Step 1: Get Your Cloudinary Credentials

1. Log in to your Cloudinary account at [https://cloudinary.com/console](https://cloudinary.com/console)
2. On the Dashboard, you'll find your **Cloud Name**, **API Key**, and **API Secret**
3. Make a note of your **Cloud Name** - you'll need it for the application

## Step 2: Create an Upload Preset

Upload presets allow you to upload images without using your API secret in the frontend code.

1. In the Cloudinary console, go to **Settings** > **Upload** tab
2. Scroll down to **Upload presets** section
3. Click **Add upload preset**
4. Configure the preset:
   - **Preset name**: Choose a name (e.g., `product_images`)
   - **Signing Mode**: Select **Unsigned**
   - **Folder**: Enter `product-images`
   - **Overwrite**: Choose based on your preference
   - **Transformation**: Leave as default or set up any automatic transformations you want
5. Click **Save**
6. Make a note of the **Preset name** you created

## Step 3: Update Your Application

1. Open the file `src/utils/cloudinary.js`
2. Replace the placeholder values with your actual Cloudinary credentials:

```javascript
// Replace with your actual cloud name
const cloudName = "YOUR_CLOUD_NAME"; 

// In the initWidget function, replace:
uploadPreset: "YOUR_UPLOAD_PRESET", // Replace with your upload preset name
```

## Step 4: Test the Integration

1. Start your application with `npm run dev`
2. Go to the Admin panel
3. Try to add a new product and click the "העלה תמונה" (Upload Image) button
4. The Cloudinary widget should open, allowing you to upload an image
5. After uploading, the image should appear in the preview and be saved with the product

## Security Considerations

- The current implementation uses an **unsigned** upload preset, which means anyone who knows your cloud name and preset name could potentially upload images to your account.
- For a production environment, consider implementing a more secure approach:
  - Use a signed upload with a server-side component
  - Set up proper access controls in Cloudinary
  - Implement rate limiting

## Troubleshooting

If you encounter issues:

1. Check the browser console for error messages
2. Verify your Cloud Name and Upload Preset are correct
3. Make sure your Cloudinary account is active
4. Check that your upload preset is configured as "unsigned"

## Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Upload Widget](https://cloudinary.com/documentation/upload_widget)
- [Cloudinary React SDK](https://cloudinary.com/documentation/react_integration) 