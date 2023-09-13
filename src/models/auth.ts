import mongo from 'mongoose';

const authSchema = new mongo.Schema({
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true },
    profile: { type: String, required: true }, // URL 형식
    name: { type: String, required: true },
    credential: {
        id: { type: String, required: true },
        pw: { type: String, required: true },
        publicRandID: { type: Number, required: true }, // 공개적으로 사용될 사용자의 고유ID
        secretRandID: { type: Number, required: true } // 내부적으로 사용될 사용자의 고유ID (Database, Connection)
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    provider: { type: String, required: true },
    uid: { type: String, required: true }
});

export default mongo.model('auth', authSchema);