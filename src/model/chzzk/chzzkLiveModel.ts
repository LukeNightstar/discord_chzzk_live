import mongoose, {Document, Schema} from "mongoose";

interface ChzzkLiveModel extends Document {
    guildId: string;
    channelId: string;
    chzzkId: string;
    channelName: string;
    message: string;
    liveId: number;
    lastChecked: Date;
    openDate: Date;
    closeDate: Date;
}

const ChzzkLiveModelSchema = new Schema<ChzzkLiveModel>(
    {
        guildId: {type: String, required: true},
        channelId: {type: String, required: true},
        chzzkId: {type: String, required: true},
        channelName: {type: String, required: true},
        message: {type: String, default: null, required: false},
        liveId: {type: Number, default: null},
        lastChecked: {type: Date, required: true},
        openDate: {type: Date, default: null},
        closeDate: {type: Date, default: null},
    },
    {
        timestamps: true,
    }
);

const ChzzkLiveModel = mongoose.model<ChzzkLiveModel>('ChzzkLiveModel', ChzzkLiveModelSchema);

export default ChzzkLiveModel;