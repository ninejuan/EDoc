import mongo from 'mongoose';

const tokenSchema = new mongo.Schema({
    JkrTkn: { type: String, required: true },
    googleRefToken: { type: String, required: true },
    googleAcToken: { type: String, required: true },
    sRID: { type: String, required: true },
    pRID: { type: String, required: true }
});

export default mongo.model('token', tokenSchema);