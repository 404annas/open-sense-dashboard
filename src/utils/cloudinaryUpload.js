/**
 * Utility functions for direct Cloudinary uploads from frontend
 */

// Function to compress image using canvas with better quality control
const compressImage = (file, quality = 0.7, maxWidth = 1920, maxHeight = 1080) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions to keep aspect ratio
      let { width, height } = img;

      // Scale down if image is larger than max dimensions
      if (width > maxWidth || height > maxHeight) {
        const scale = Math.min(maxWidth / width, maxHeight / height);
        width = width * scale;
        height = height * scale;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw image on canvas with new dimensions
      ctx.drawImage(img, 0, 0, width, height);

      // Convert back to blob with quality adjustment
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            // If compression failed, return original file
            resolve(file);
          }
        },
        file.type,
        quality // Quality factor (70%)
      );
    };

    img.onerror = () => {
      // If image loading fails, return original file
      resolve(file);
    };

    img.src = URL.createObjectURL(file);
  });
};

// Function to determine compression settings based on file size
const getCompressionSettings = (file) => {
  if (file.size > 20 * 1024 * 1024) { // > 20MB
    return { quality: 0.6, maxWidth: 1920, maxHeight: 1080 }; // Heavy compression
  } else if (file.size > 10 * 1024 * 1024) { // > 10MB
    return { quality: 0.7, maxWidth: 1920, maxHeight: 1080 }; // Medium compression
  } else if (file.size > 5 * 1024 * 1024) { // > 5MB
    return { quality: 0.8, maxWidth: 1920, maxHeight: 1080 }; // Light compression
  } else {
    return { quality: 0.9, maxWidth: 1920, maxHeight: 1080 }; // Minimal compression
  }
};

// Function to upload image directly to Cloudinary
export const uploadImageToCloudinary = async (file, folder = 'opensense-projects', uploadPreset = null) => {
  try {
    // Compress image if it's too large
    let processedFile = file;
    let wasCompressed = false;

    if (file.type.startsWith('image/')) {
      const compressionSettings = getCompressionSettings(file);
      processedFile = await compressImage(file, compressionSettings.quality, compressionSettings.maxWidth, compressionSettings.maxHeight);
      wasCompressed = processedFile.size !== file.size;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(processedFile.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
    }

    // Validate file size (Cloudinary free tier limit is 25MB)
    if (processedFile.size > 25 * 1024 * 1024) {
      throw new Error('File size exceeds 25MB limit.');
    }

    // Get Cloudinary configuration from environment variables
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const preset = uploadPreset || import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName) {
      throw new Error('Missing VITE_CLOUDINARY_CLOUD_NAME in environment variables');
    }

    if (!preset) {
      throw new Error('Missing VITE_CLOUDINARY_UPLOAD_PRESET in environment variables');
    }

    // Create form data for Cloudinary direct upload
    const formData = new FormData();

    // Use unsigned upload if upload preset is provided, otherwise use signed upload
    formData.append('upload_preset', preset);
    formData.append('file', processedFile);

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary API Error Response:', errorData);

      // Check if the error is related to upload preset
      if (response.status === 400 && errorData.error?.message?.includes('Upload preset')) {
        throw new Error(`Upload preset error: ${errorData.error?.message}. Please check your Cloudinary upload preset configuration.`);
      }

      throw new Error(`Failed to upload image to Cloudinary: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return {
      type: 'image',
      src: data.secure_url,
      alt: processedFile.name,
      publicId: data.public_id,
      originalSize: file.size,
      compressedSize: processedFile.size,
      wasCompressed: wasCompressed,
    };
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

// Function to upload multiple images to Cloudinary
export const uploadMultipleImagesToCloudinary = async (files, folder = 'opensense-projects', uploadPreset = null) => {
  const uploadPromises = Array.from(files).map(file =>
    uploadImageToCloudinary(file, folder, uploadPreset)
  );

  try {
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Error uploading multiple images to Cloudinary:', error);
    throw error;
  }
};

// Function to get Cloudinary configuration from environment variables
export const getCloudinaryConfig = () => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName) {
    throw new Error('Missing VITE_CLOUDINARY_CLOUD_NAME in environment variables');
  }

  if (!uploadPreset) {
    throw new Error('Missing VITE_CLOUDINARY_UPLOAD_PRESET in environment variables');
  }

  return { cloudName, uploadPreset };
};