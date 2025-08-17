import mongoose, { Schema } from 'mongoose';

const UploadModel = new Schema({
    thumbnail: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: [true, 'A Title is required'],
        trim: true

    },
    description: {
        type: String,
        trim: true

    },
    contentType: {
        type: String,
        required: true,
        enum: ['video', 'file', 'image'],
    },
    uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    privacy:{
        type:String,
        enum: ['public', 'private', 'unlisted'],
        default: 'public'
    },
    
    //---- ViewsCounter (applies to all content) -----
    views: {
        type: Number,
        default: 0
    },

    comment: {
        type: String,
    },

    isPublished: {
        type: Boolean,
        default: true
    },

    url: {
        type: String,
        required: true
    },

    public_id: {
        type: String,
        required: true,
        unique: true
    },

    resourceType: {
        type: String,
    },

    format: {
        type: String,
    },
    /*
    //  --- Type-Specific Metadata ---
    meta: {
        //For videos
        duration: {
            type: Number
        },

        //Thumbnail for visual contnet
        thumbnailUrl: {
            type: String
        },

        //For images & videos only
        width: { type: Number },
        height: { type: Number },
    },
    */
}, { timestamps: true })

export const Upload = mongoose.model('Upload', UploadModel);