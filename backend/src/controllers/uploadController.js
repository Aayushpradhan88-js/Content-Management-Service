import { promises as fsPromises } from "fs";
import mongoose from 'mongoose';

import { Upload } from "../models/uploadModels.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { cloudinary } from "../utils/cloudinary.js";

//--------------------UPLOAD CONTENT--------------------//
export const uploadFileContent = async (req, res) => {
    const { title, description, contentType } = req.body;

    console.log(req.files);
    console.log('TEMP FILE PATH', tempFilePath);

    //-----VERIFYING JWT MIDDLEWARE-----//
    if (!req.user || !req.user._id) {
        throw new ApiError(401, "UNAUTHORIZED USER");
    }

    if (!title || !description) {
        throw new ApiError(400, "Title and description is required");
    }
    
    if (!req.files || !req.files.image || !req.files.image.tempFilePath) {
        console.log("No file uploaded or tempFilePath not found");

        return res.status(400).json({
            success: false,
            message: "No file uploaded"
        })
    }

    const file = req.files.image;
    const tempFilePath = file.tempFilePath;


    try {

        const contentTypeToResourceType = {
            'image': 'image',
            'video': 'video',
            'file': 'raw' //-----For documents, pdf, txt, files-----//
        };

        const cloudinaryResourceType = contentTypeToResourceType[contentType?.toLowerCase()];
        if (!cloudinaryResourceType) throw new ApiError(400, 'In-Valid Content-Type');

        //----------UPLOAD FILE ON CLOUDINARY----------//
        const cloudinaryResult = await cloudinary.uploader.upload(tempFilePath, {
            resource_type: cloudinaryResourceType,
            // format: format
        });

        console.log(`FILE TYPE ${contentType} IS SUCCESSFULLY UPLOADED ON CLOUDINARY`, cloudinaryResult);

        //----------TODO: UNDERSTAND THE CODE LINE----------//
        const thumbnailUrl = (contentType === 'image' || contentType === 'video' || contentType === 'file') ?
            cloudinaryResult.secure_url.replace(/\.(mp4|mov|avi)$/i, '.jpg') :
            cloudinaryResult.secure_url;

        //----------SAVING UPLOAD DATA TO MONGODB----------//
        const newUpload = new Upload({
            title,
            description: description || '',
            contentType,
            thumbnail: thumbnailUrl,
            uploadedBy: req.user._id,
            format: cloudinaryResult.format,
            version: cloudinaryResult.version,
            url: cloudinaryResult.secure_url,
            public_id: cloudinaryResult.public_id,
            resourceType: cloudinaryResult.resource_type,
        })

        const savedUpload = await newUpload.save();
        // console.log(`${contentType.charAt(0).toUpperCase() + contentType.slice(1)} metadata saved to MongoDB:`, savedUpload);

        return res
        .status(201)
        .json({
            success: true,
            message: `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} uploaded Successfully!`,
            cloudinaryData: {
                url: cloudinaryResult.secure_url,
                public_id: cloudinaryResult.public_id,
                resource_type: cloudinaryResult.resource_type,
                format: cloudinaryResult.format
            },
            mongoData: savedUpload
        });

    } catch (error) {
        // console.error(`Error during ${contentType || 'file'} upload process:`, error);
        return res
            .status(500)
            .json({
                success: false,
                message: `Server error during ${contentType || 'file'} upload.`,
                error: error.message
            })
    }
    finally {
        // Clean up the temporary file
        if (tempFilePath) { // Check if tempFilePath was defined
            try {
                await fsPromises.unlink(tempFilePath); // Use fs.promises for async/await
                console.log("Temporary file deleted:", tempFilePath);
            } catch (unlinkError) {
                console.error("Error deleting temporary file:", tempFilePath, unlinkError);
            }
        }
    }

}

//--------------------GET ALL UPLOADS--------------------//
export const getAllUploads = async (req, res) => {
    try {
        const uploads = await Upload.find().
        sort({ createdAt: -1 }) //-----uploaded files descending-order (newest first)-----//

        if (!uploads) {
            throw new ApiError(400, "No Uploads Found");
        };

        return res
            .status(200)
            .json(
                new ApiResponse(200, uploads, "uploads fetched successfully")
            );
    } catch (error) {
        console.error("Error fetching all uploads: ", error);
        return res
            .status(500)
            .json(
                {
                    success: false,
                    message: "Server error while fetching uploads data",
                    error: error.message
                }
            )
    }
}

//--------------------UPLOADED CONTENT WITH ID CONTROLLER--------------------//
export const contentId = async (req, res) => {
    const { id } = req.params;
    console.log("Content ID: ", id)
    if (!id) throw new ApiError(400, "ID IS NOT FOUND");
    try {
        const contentItem = await Upload.findById(id)
            //-------CREATOR USERNAME & FOLLOWERS--------/
            .populate('uploadedBy', 'username followers');
        // console.log(contentItem)
        if (!contentItem) throw new ApiError(401, "CONTENT ID IS NOT FOUND");

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    contentItem,
                    "Content Fetched Successfully"
                )
            )
    }

    catch (error) {
        throw new ApiError(
            500,
            error.message,
            "INTERNAL SERVER ERROR"
        )
    }

}

//--------------------CONTET VIEW INCREMENT--------------------//
export const viewIncrement = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ApiError(
                401,
                "MEDIA ID IS NOT VALID"
            )
        }

        const contentItem = await Upload.findByIdAndUpdate(
            id,
            {
                $inc: { views: 1 },
            },
            { new: true }
        );

        // console.log(contentItem)
        if (!contentItem) throw new ApiError(401, "CONTENT ID IS NOT FOUND");

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        views: contentItem.views,
                        Id: contentItem._id
                    },
                    "VIEWS INCREMENTED SUCCESSFULLY"
                )
            )
    } catch (error) {
        throw new ApiError(
            500,
            error.message,
            "INTERNAL SERVER ERROR VIEWS INCREMENT"
        )
    }
}

//--------------------UPDATING/EDITING CONTENT--------------------//
export const updateContent = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const currentUserId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ApiError(400, "INVALID CONTENT ID"));
    };

    if (!title && !description) {
        throw new ApiError(400, "TITLE OR DESCRIPTION IS REQUIRED FOR UPDATING");
    };

    try {
        const content = await Upload.findById(id);
        if (!content) throw new ApiError(400, "CONTENT ID NOT FOUND TO UPDATE USER !")

        //-----AUTHORIZATION CHECK-----//
        if (content.uploadedBy.toString() !== currentUserId.toString()) throw new ApiError(400, "YOU'RE NOT AUTHORIZED USER TO EDIT THE CONTENT");

        if (title) {
            content.title = title;
        };

        if (description) {
            content.description = description;
        };

        const updatedContent = await content.save();

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    updatedContent,
                    "CONTENT UPDATED SUCCESSFULLY"
                )
            )
    }

    catch (error) {
        return (
            new ApiError(
                500,
                error.message,
                "INTERNAL SERVER WHILE UPDATING CONTENT"
            )
        )
    }
}

//--------------------DELETING CONTENT FROM CLOUDINARY && MONGODB--------------------//
export const deleteContent = async (req, res) => {
    const { id } = req.params;
    const currentUserId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "INVALID CONTENT ID TO DELETE CONTENT");
    }

    if (!currentUserId) throw new ApiError(400, "CURRENT USER ID DOES NOT EXIST");

    try {
        const contentId = await Upload.findById(id);

        if (!contentId) throw new ApiError(400, "CONTENT ID IS NOT FOUND TO DELETE CONENT");

        //-----AUTHORIZATION CHECK-----//
        if (contentId.id.toString() === currentUserId.toString()) {
            throw new ApiError(400, "YOU'RE NOT AUTHORIZED TO DELETE THE CONTENT");
        };

        //-----DELETING CONTENT FROM CLOUDINARY-----//
        await cloudinary.uploader.destroy(
            contentId.public_id,
            {
                resource_type: contentId.resourceType
            }
        )

        //----AFTER THAT FROM THE MONGODB-----//
        await Upload.findByIdAndDelete(id);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "CONTENT DELETED SUCCESSFULLY"
                )
            );
    }

    catch (error) {
        return (
            new ApiError(
                500,
                error.message,
                "INTERNAL SERVER ERROR WHILE DELETING CONTENT"
            )
        );
    };
};

//--------------------LOGGED'IN USERS CONTENT--------------------//
export const myContent = async (req, res, next) => {
    const currentUserId = req.user?._id;
    if (!currentUserId) throw new ApiError(400, "USER IS NOT EXISTED");

    try {
        const myUploads = await Upload
            .find({ uploadedBy: currentUserId })
            .sort({ createdAt: -1 })
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    myUploads,
                    "User's content fetched successfully"
                ));
    }

    catch (error) {
        next(new ApiError(500, error.message || "Internal server error while fetching user's content."));
    }
};