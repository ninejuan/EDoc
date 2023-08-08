import { error, redirect } from '@sveltejs/kit';
import mongo from 'mongoose'
import * as dotenv from 'dotenv'
dotenv.config();
let pe = process.env;

async function findAccountBy(params:type) {
    
}

export function load({  }) {
    return {
        fbConf: {
            apiKey: pe.FB_APIKEY,
            authDomain: pe.FB_AUTHDOMAIN,
            projectId: pe.FB_PROJECTID,
            storageBucket: pe.FB_STORAGEBUCKET,
            messagingSenderId: pe.FB_MESSAGINGSENDERID,
            appId: pe.FB_APPID,
            measurementId: pe.FB_MEASUREMENTID
        },
        cid: process.env.GOOGLE_CID,
        callbackURL: process.env.REDIRECT_URL
    };
}

export const actions = {
    // @ts-ignore
    default: async ({ cookies, request }) => {
        // @ts-ignore
        delete mongo.connection.models['help'];

        const data = await request.formData();
        if (!data || !data.get('secretkey') || !data.get('Title') || !data.get('content') || !data.get('privacy')) {
            console.log('no data')
            throw redirect(302, '/call');
        }
        if (data.get('secretkey') !== process.env.CALL_KEY) {
            console.log('sckey not match'); throw redirect(302, '/call');
        }


        await sendMail(data);
    }
};