// Cloudinary configuration and utility functions
import { Cloudinary } from "@cloudinary/url-gen";

// Initialize Cloudinary with your cloud name
// You can find this in your Cloudinary dashboard
const cloudName = "dkzcfqzv9"; // Replace with your actual cloud name

// Initialize Cloudinary instance
export const cld = new Cloudinary({
  cloud: {
    cloudName: cloudName
  }
});

// Function to initialize and open the Cloudinary upload widget
export const openUploadWidget = (callback) => {
  // Check if the Cloudinary widget script is already loaded
  if (!window.cloudinary) {
    // Load the Cloudinary widget script dynamically
    const script = document.createElement('script');
    script.src = "https://upload-widget.cloudinary.com/global/all.js";
    script.async = true;
    document.body.appendChild(script);
    
    script.onload = () => {
      initWidget(callback);
    };
  } else {
    initWidget(callback);
  }
};

// Initialize the upload widget
const initWidget = (callback) => {
  const uploadOptions = {
    cloudName: cloudName,
    uploadPreset: "product_images", // Replace with your upload preset
    sources: ["local", "url", "camera"],
    multiple: false,
    cropping: true,
    croppingAspectRatio: 1,
    maxFileSize: 5000000, // 5MB
    folder: "product-images",
    clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
    language: "he", // Hebrew language
    text: {
      he: {
        menu: {
          files: "מהמחשב שלי",
          url: "מכתובת אינטרנט",
          camera: "מצלמה"
        },
        local: {
          browse: "בחר קובץ",
          dd_title_single: "גרור ושחרר תמונה לכאן",
          dd_title_multi: "גרור ושחרר תמונות לכאן",
          drop_title_single: "גרור ושחרר תמונה להעלאה",
          drop_title_multiple: "גרור ושחרר תמונות להעלאה"
        },
        queue: {
          title: "תור העלאה",
          title_uploading_with_counter: "מעלה {{num}} קבצים",
          title_uploading: "מעלה קבצים",
          done: "הועלה בהצלחה",
          upload_more: "העלה עוד"
        },
        crop: {
          title: "חיתוך תמונה",
          crop_btn: "חתוך",
          skip_btn: "דלג",
          reset_btn: "אפס",
          close_btn: "סגור"
        }
      }
    }
  };

  const widget = window.cloudinary.createUploadWidget(
    uploadOptions,
    (error, result) => {
      if (!error && result && result.event === "success") {
        // Pass the uploaded image info to the callback
        callback(result.info);
      }
      if (error) {
        console.error("Cloudinary upload error:", error);
      }
    }
  );

  widget.open();
};

// Function to delete an image from Cloudinary
// Note: This requires server-side implementation with your API key and secret
// For security reasons, you should not include your API key and secret in client-side code
export const deleteImage = async (publicId) => {
  // This is a placeholder. In a real implementation, you would call your backend API
  // which would then use the Cloudinary SDK to delete the image
  console.log(`Image deletion would be implemented on the server side for public ID: ${publicId}`);
  
  // Example of how this would be implemented on the server:
  // const cloudinary = require('cloudinary').v2;
  // cloudinary.config({
  //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  //   api_key: process.env.CLOUDINARY_API_KEY,
  //   api_secret: process.env.CLOUDINARY_API_SECRET
  // });
  // 
  // return cloudinary.uploader.destroy(publicId);
};

// Extract public ID from a Cloudinary URL
export const getPublicIdFromUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) {
    return null;
  }
  
  // Example URL: https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/product-images/apple.jpg
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  const folderAndFile = parts.slice(-2).join('/');
  
  // Remove file extension
  const publicId = folderAndFile.substring(0, folderAndFile.lastIndexOf('.'));
  return publicId;
}; 