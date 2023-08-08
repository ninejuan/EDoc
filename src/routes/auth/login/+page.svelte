<svelte:head>
    <script>
        
    </script>
	</svelte:head>
<script lang="ts">
	import { redirect } from '@sveltejs/kit';
	import { FirebaseError, initializeApp, getApp } from 'firebase/app';
    import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'

    interface ReturnData {
        fbConf: Object;
		cid: String;
		callbackURL: String;
	}
	export let data: ReturnData;

	// Initialize Firebase
    let app = initializeApp(data.fbConf) ?? getApp('JuanyKr');
	// !getApp().toString().length ? app = initializeApp(data.fbConf) : app = getApp();

    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    function GoogleLogIn() {
        return signInWithPopup(auth, provider);
    }

    function GoogleLogInSuccess(user: Object) {
		fetch('/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
				},
				body: JSON.stringify(user)
			}).then((res) => {
				if (res.status === 200) {
					throw redirect(302, '/docs/list');
				}
			}).catch((err) => {
				console.error(err);
			});
    }

    function RequestLogIn() {
        GoogleLogIn().then((res) => {
            GoogleLogInSuccess(res);
        })
    }
</script>

<meta name="google-signin-client_id" content="{data.cid}.apps.googleusercontent.com" />
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<div
	id="g_id_onload"
	data-client_id={data.cid}
	data-context="signin"
	data-ux_mode="popup"
	data-login_uri={data.callbackURL}
	data-auto_prompt="false"
/>

<div
	class="g_id_signin"
	data-type="standard"
	data-shape="rectangular"
	data-theme="outline"
	data-text="signin_with"
	data-size="large"
	data-logo_alignment="left"
/>

<button on:click={RequestLogIn}>구글 로그인</button>