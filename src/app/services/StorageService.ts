// src/services/StorageService.ts
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

/**
 * Service for handling Firebase Storage operations
 */
class StorageService {
  private storage = getStorage();

  // Store blob URLs and their corresponding File/Blob objects
  private blobCache = new Map<string, File | Blob>();

  /**
   * Registers a blob or file with its URL for later upload
   * @param url The blob URL created with URL.createObjectURL
   * @param fileOrBlob The original File or Blob object
   */
  registerBlobForUpload(url: string, fileOrBlob: File | Blob) {
    this.blobCache.set(url, fileOrBlob);
    console.log(`✅ Registered blob for future upload: ${url}`);
  }

  /**
   * Gets all registered blob URLs
   * @returns Array of registered blob URLs
   */
  getRegisteredBlobUrls(): string[] {
    return Array.from(this.blobCache.keys());
  }

  /**
   * Checks if a URL is already from Firebase Storage
   * @param url The URL to check
   * @returns true if the URL is from Firebase Storage
   */
  isFirebaseStorageUrl(url: string | undefined): boolean {
    if (!url) return false;
    // Check if the URL contains 'firebase' or firebasestorage.googleapis.com
    return (
      url.includes("firebase") || url.includes("firebasestorage.googleapis.com")
    );
  }

  /**
   * Uploads a file to Firebase Storage if it's not already stored there
   * @param fileUrl Local blob URL or existing Firebase URL
   * @param lessonId The ID of the lesson (not used for path - files are stored in root)
   * @param itemText The text/word of the item for naming
   * @param fileType The type of file ('image' or 'audio')
   * @returns Promise with the Firebase Storage URL
   */
  async uploadFileIfNeeded(
    fileUrl: string | undefined,
    lessonId: string,
    itemText: string,
    fileType: "image" | "audio"
  ): Promise<string | undefined> {
    if (!fileUrl) return undefined;

    // If it's already a Firebase URL, return it as is
    if (this.isFirebaseStorageUrl(fileUrl)) {
      console.log(`Using existing Firebase URL: ${fileUrl}`);
      return fileUrl;
    }

    try {
      // Handle blob URLs
      if (fileUrl.startsWith("blob:")) {
        console.log(
          `Attempting to upload ${fileType} for item "${itemText}" in lesson ${lessonId}`
        );

        // Check if URL exists in our blob cache
        if (this.blobCache.has(fileUrl)) {
          const blob = this.blobCache.get(fileUrl) as Blob;
          console.log("✅ Using cached blob for upload");

          // Create a safe filename from the item text
          const safeItemText = itemText
            .replace(/[^a-zA-Z0-9]/g, "_") // Replace non-alphanumeric chars with underscore
            .toLowerCase()
            .substring(0, 30); // Limit length to 30 chars

          // Generate a unique filename with the item text and a timestamp
          // Store directly in root, not in lesson-specific folder
          const fileExtension =
            fileType === "image"
              ? this.getImageExtension(blob.type)
              : this.getAudioExtension(blob.type);

          const fileName = `${fileType}_${safeItemText}_${Date.now()}${fileExtension}`;

          // Create a reference to the storage location (directly in root)
          const storageRef = ref(this.storage, fileName);

          // Upload the blob data
          console.log(`Uploading blob to Firebase Storage path: ${fileName}`);
          const snapshot = await uploadBytes(storageRef, blob);

          // Get the download URL
          const downloadUrl = await getDownloadURL(snapshot.ref);
          console.log(
            `✅ Successfully uploaded ${fileType} to Firebase Storage: ${downloadUrl}`
          );

          // Clean up the cache and revoke the blob URL to free memory
          this.blobCache.delete(fileUrl);

          return downloadUrl;
        } else {
          // If the blob is not in our cache, log a warning but DON'T try to fetch it
          console.warn(`❌ No cached blob found for URL: ${fileUrl}. 
                       This file will not be uploaded to Firebase Storage.
                       The blob URL will be kept as is.`);

          // Return the original URL in this case - don't try to upload it
          return fileUrl;
        }
      }

      // If it's not a blob URL or Firebase URL, return it as is
      return fileUrl;
    } catch (error) {
      console.error(`Error uploading ${fileType} to Firebase Storage:`, error);
      // In case of error, return the original URL so the user doesn't lose their file
      return fileUrl;
    }
  }

  /**
   * Get the appropriate file extension for an image MIME type
   */
  private getImageExtension(mimeType: string): string {
    switch (mimeType) {
      case "image/jpeg":
      case "image/jpg":
        return ".jpg";
      case "image/png":
        return ".png";
      case "image/gif":
        return ".gif";
      case "image/webp":
        return ".webp";
      case "image/svg+xml":
        return ".svg";
      default:
        return ".jpg"; // Default to jpg
    }
  }

  /**
   * Get the appropriate file extension for an audio MIME type
   */
  private getAudioExtension(mimeType: string): string {
    switch (mimeType) {
      case "audio/mpeg":
        return ".mp3";
      case "audio/ogg":
        return ".ogg";
      case "audio/wav":
        return ".wav";
      case "audio/x-m4a":
      case "audio/mp4":
        return ".m4a";
      default:
        return ".m4a"; // Default to m4a
    }
  }
}

// Export a singleton instance
const storageService = new StorageService();
export default storageService;
