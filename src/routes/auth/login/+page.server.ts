// @ts-nocheck
import { error, redirect, type Cookies } from '@sveltejs/kit';
import mongo from 'mongoose'
import * as dotenv from 'dotenv'
import crypto from 'crypto'
import authSchema from '../../../models/auth'
import tokenSchema from '../../../models/token'
import auth from '$lib/auth'
import check from '$lib/safeRequest';
import { DOMAIN, MAIN_CLUSTER, MAIN_FOLDER, MAIN_ID, MAIN_PW, TEST_CLUSTER, TEST_CODE, TEST_FOLDER, TEST_ID, TEST_PW, cookieSecure } from '$env/static/private';
dotenv.config();
let pe = process.env;

let murl; let isSecure;
if (pe.MODE == 'PROD') {
    murl = `mongodb+srv://${MAIN_ID}:${MAIN_PW}@cluster${MAIN_CLUSTER}.${MAIN_CODE}.mongodb.net/${MAIN_FOLDER}`;
} else if (pe.MODE == 'DEV') {
    murl = `mongodb+srv://${TEST_ID}:${TEST_PW}@cluster${TEST_CLUSTER}.${TEST_CODE}.mongodb.net/${TEST_FOLDER}`;
} else console.log('Error: please set mode on env file');
(isSecure == "TRUE") ? isSecure = true : isSecure = false;

mongo.connect(murl).then(console.log('DB Connected'));

interface User {
    uid: string;
    email: string | null;
    fullName: string | null;
    profileUrl: string | null;
    acToken: string | undefined;
    refToken: string;
}; let userData: User;

interface TokenParameter {
    gacToken: string;
    grefToken: string;
    JKrpRID: string;
    JKrsRID: string;
}

async function findAccountByData() {
    if (!userData) return null; // Any UserData had arrived this server yet
    let userExists = await authSchema.findOne({ uid: userData.uid, email: userData.email });
    if (!userExists) return "UNE"; // User No Exists
    else return "E"; // User Exists
}

async function makeJKrToken(obj: TokenParameter) {
    let tkn = crypto.randomBytes(20).toString('hex').toString('base64');
    tokenSchema.deleteMany({ sRID: obj.JKrsRID });
    const newToken = new tokenSchema({
        JkrTkn: tkn,
        googleAcToken: obj.gacToken,
        googleRefToken: obj.grefToken,
        pRID: obj.JKrpRID,
        sRID: obj.JKrsRID
    }).save();
    return tkn;
}

async function setCookie(data: User, cookies: Cookies) {
    let AlreadyExistsUser = await authSchema.findOne({ uid: data.uid })
    let tkn = await makeJKrToken({
        gacToken: data.acToken,
        grefToken: data.refToken,
        JKrpRID: AlreadyExistsUser?.credential?.publicRandID,
        JKrsRID: AlreadyExistsUser?.credential?.secretRandID
    })
    cookies.set('userTkn', `${tkn}`, {
        httpOnly: true,
        sameSite: 'lax',
        secure: isSecure,
        maxAge: 60 * 60 * 24 * 1
    });
}

/** @type {import('./$types').PageServerLoad} */
export function load({ cookies }) {
    delete mongo.connection.models['auth', 'token'];
    cookies.set('reqUr', `text`, {
        httpOnly: false,
        sameSite: "lax",
        secure: false,
        maxAge: 60 * 60 * 24 * 1,
        path: '/'
    });
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

/** @type {import('./$types').Actions} */
export const actions = {
    default: async ({ cookies, request, event }) => {
        delete mongo.connection.models['auth', 'token'];
        if (!check(DOMAIN, request.url)) return error(400); // Same Origin Policy Violation
        const data = await request.formData();
        if (!data || !data.get('uid') || !data.get('email') || !data.get('fullName') || !data.get('profileUrl') || !data.get('acToken') || !data.get('refToken')) {
            return 400;
        } else {
            userData = {
                uid: data.get('uid'),
                email: data.get('email'),
                fullName: data.get('fullName'),
                profileUrl: data.get('profileUrl'),
                acToken: data.get('acToken'),
                refToken: data.get('refToken')
            };
            findAccountByData().then((res) => {
                if (!res) {
                    // return error({ status: 500, message: 'Internal Server Error' });
                    throw error(500);
                } else {
                    if (res == "E") {
                        try {
                            setCookie(data, cookies);
                            return {
                                props: {
                                    redRequired: true,
                                    url: '/docs/list'
                                }
                            };
                        } catch (e) {
                            console.log(e);
                            return error(500);
                        }
                    } else {
                        return {
                            props: {
                                redRequired: true,
                                url: '/auth/join'
                            }
                        };
                    }
                }
            });
        }
    }
};