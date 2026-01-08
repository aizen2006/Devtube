import {Schema,model} from "mongoose";
import mongooseaggregator from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({
    videoFile:{
        type:String, // cloudinary url
        required:true,
    },
    thumbnail:{
        type:String, // cloudinary url
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    duration:{
        type:Number, // from cloudnary
        required:true,
    },
    views:{
        type:Number,
        default:0,
    },
    isPublished:{
        type:Boolean,
        default:true,
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },
    comments:[
        {
            type: Schema.Types.ObjectId,
            ref: "Comment",
        }
    ]
},{timestamps:true})

videoSchema.plugin(mongooseaggregator);

export const Video = model("Video", videoSchema);