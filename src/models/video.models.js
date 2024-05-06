import mongoose ,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = Schema({
    videoFile: {
        type: {
            url: String,
            public_id: String,
        },
        required: true
    },
    thumbnail: {
        type: {
            url: String,
            public_id: String,
        },
        required: true
    },
    title: {
        type: String, 
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    duration: {
        type: Number, 
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps: true}
)


// Applying the mongooseAggregatePaginate plugin to the videoSchema
// This enables pagination support for MongoDB queries on the 'Video' schema
videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video",videoSchema)