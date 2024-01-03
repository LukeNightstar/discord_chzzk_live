import mongoose, {Document, Schema} from "mongoose";

interface ChzzkLiveModel extends Document {
    guildId: string;
    channelId: string;
    chzzkId: string;
    channelName: string;
    message: string;
    liveId: number;
    lastChecked: Date;
    openDate: Date | null;
    closeDate: Date | null;
}

const ChzzkLiveModelSchema = new Schema<ChzzkLiveModel>(
    {
        guildId: {type: String, required: true},
        channelId: {type: String, required: true},
        chzzkId: {type: String, required: true},
        channelName: {type: String, required: true},
        message: {type: String, default: null, required: false},
        liveId: {type: Number, required: false},
        lastChecked: {type: Date, required: true},
        openDate: {type: Date || null, required: false},
        closeDate: {type: Date || null, required: false},
    },
    {
        timestamps: true,
    }
);

const ChzzkLiveModel = mongoose.model<ChzzkLiveModel>('ChzzkLiveModel', ChzzkLiveModelSchema);

export default ChzzkLiveModel;