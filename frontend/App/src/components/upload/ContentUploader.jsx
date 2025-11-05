import React, { useState } from 'react'

import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

export const ContentUploader = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentType, setContentType] = useState("image");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      toast.error("Please select a file to upload.");
      return;
    } if (!title.trim()) {
      toast.error("Please enter a title")
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("photo", selectedFile);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("contentType", contentType);

    //----------FETCHING TO BACKEND----------//
    try {
      const response = await fetch('http://localhost:4000/api/upload/upload-file',
        {
          method: "POST",
          body: formData,
        });

      const result = await response.json();  //Parse the JSON response from the backend

      if (!response.ok) { // If the response status is not OK (e.g., 400, 500)
        console.error("File upload failed:", result);

        toast.error(result.message || `File upload failed ${response.statusText}. Please try again.`);

        return;
      }

      //If the response status is OK (e.g., 200)
      console.log("File uploaded successfully:", result);
      toast.success(result.message || "Image uploaded successfully");

      if (onUploadSuccess && result.mongoData) {
        onUploadSuccess(result.mongoData)
      }

      //----------FETCHING TO BACKEND----------//
      setSelectedFile(null);
      setTitle('');
      setDescription('');

      if (event.target.form) {
        event.target.form.reset();
      }

      setContentType('image');
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("An unexpected error occurred during upload.");
    }
    finally {
      setIsLoading(false);
    }
  }

  //TODO: UNDERSTAND THE CODE
  const getAcceptString = () => {
    if (contentType === 'image') return 'image/*';
    if (contentType === 'video') return 'video/*';
    if (contentType === 'file') return '.pdf,.doc,.docx,.txt'; // Example for documents
    return '*/*'; // Default to all files if type is not specific
  };
  return (
    <>
      <div className="my-4 p-4 border border-gray-300 rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="bl{ock text-sm font-medium text-gray-700">Title</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>

          <div>
            <label htmlFor="description" className='block text-sm font-medium text-gray-700'>Description</label>
            <textarea id='description' value={description} onChange={(e) => {
              setDescription(e.target.value)
            }} rows="3" className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'></textarea>
          </div>

          <div>
            <label htmlFor="contentType" className='block-sm font-medium text-gray-700'>Content Type</label>
            <select id="contentType" value={contentType} onChange={(e) => setContentType(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="file">Document/File</option>
            </select>
          </div>

          <div>
            <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700">Upload File</label>
            <input type="file" id="fileUpload" accept={getAcceptString()} onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          </div>

          <button type="submit" disabled={isLoading || !selectedFile} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400">
            {isLoading ? 'Uploading...' : `Upload ${contentType.charAt(0).toUpperCase() + contentType.slice(1)}`}
          </button>
        </form>
      </div>
    </>
  )
}