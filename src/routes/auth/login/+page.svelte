<script lang="ts">
	import { redirect } from '@sveltejs/kit';
	import { FirebaseError, initializeApp, getApp } from 'firebase/app';
	import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
	import { onMount } from 'svelte';
	import { serialize } from 'cookie';
	import type { ActionData } from './$types';

	interface loadProps {
		fbConf: Object;
		cid: String;
		callbackURL: String;
	}
	/** @type {import('./$types').PageData} */
	export let data: loadProps;

	interface resProps {
		status: number;
		body: Object;
		headers: Object;
	}
	/** @type {import('./$types').ActionData} */
	export let resp: resProps;

	let app = initializeApp(data.fbConf);
	const auth = getAuth();
	const provider = new GoogleAuthProvider();

	interface User {
		uid: string;
		email: string | null;
		fullName: string | null;
		profileUrl: string | null;
		acToken: string | undefined;
		refToken: string;
	}

	function objectToFormEncodedString(obj: any) {
		const keyValuePairs = [];

		for (const key in obj) {
			if (obj[key] !== undefined && obj[key] !== null) {
				const encodedKey = encodeURIComponent(key);
				const encodedValue = encodeURIComponent(obj[key]);
				keyValuePairs.push(`${encodedKey}=${encodedValue}`);
			}
		}

		return keyValuePairs.join('&');
	}

	async function sendUserDataToServer(user: User) {
		let data = objectToFormEncodedString(user);
		const res = await fetch('/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: data
		});
		const json = await res.json();
		console.log(json);
			// .then((res) => {
			// 	/*
			// 		Response Lists
			// 		RTJ : Redirect To Join Page
			// 		SLRS : Successful Login. Redirect to Service

			// 	*/
			// 	console.log(res.body.)
			// 	console.log(resp ? 't' : 'f');
			// 	// switch (res) {
			// 	// 	case value:

			// 	// 		break;

			// 	// 	default:
			// 	// 		break;
			// 	// }
			// })
			// .catch((err) => {
			// 	console.error(err);
			// });
	}

	async function GoogleLogIn() {
		signInWithPopup(auth, provider)
			.then((result) => {
				console.log(result);
				const credential = GoogleAuthProvider.credentialFromResult(result);
				// @ts-ignore
				const token = credential.accessToken;
				const user = result.user;
				console.log(user);
				console.log(credential);
				let userData = new URLSearchParams();
				sendUserDataToServer({
					uid: user.uid,
					email: user.email,
					fullName: user.displayName,
					profileUrl: user.photoURL,
					acToken: token,
					refToken: user.refreshToken
				});
			})
			.catch((error) => {
				return console.log('로그인 중 오류가 발생했습니다');
			});
	}

	function RequestLogIn() {
		console.log('RequestLogIn');
		GoogleLogIn();
	}
</script>

<meta name="google-signin-client_id" content="{data.cid}.apps.googleusercontent.com" />
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<button on:click={RequestLogIn}>구글 로그인</button>
