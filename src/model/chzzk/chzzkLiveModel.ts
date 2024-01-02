import mongoose, {Document, Schema} from "mongoose";

interface ChzzkLiveModel extends Document {
    guildId: string;
    channelId: string;
    chzzkId: string;
    message: string;
    liveId: number;
    lastChecked: Date;
    openDate?: Date;
    closeDate?: Date;
}

const ChzzkLiveModelSchema = new Schema<ChzzkLiveModel>(
    {
        guildId: {type: String, required: true},
        channelId: {type: String, required: true},
        chzzkId: {type: String, required: true},
        message: {type: String, default: null, required: false},
        liveId: {type: Number, required: true},
        lastChecked: {type: Date, required: true},
        openDate: {type: Date, required: false},
        closeDate: {type: Date, required: false},
    },
    {
        timestamps: true,
    }
);

const ChzzkLiveModel = mongoose.model<ChzzkLiveModel>('ChzzkLiveModel', ChzzkLiveModelSchema);

export default ChzzkLiveModel;