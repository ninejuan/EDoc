import mongo from 'mongoose';

const authSchema = new mongo.Schema({
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true },
    profile: { type: String, required: true },
    name: { type: String, required: true },
    credential: {
        id: { type: String, required: true },
        pw: { type: String, required: true },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongo.model('auth', authSchema);