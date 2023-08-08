<script>
	import { redirect } from '@sveltejs/kit';

	function move() {
		// @ts-ignore
		location.href = window.document.getElementById('redUrl').value;
	}
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<br />
<p>여기에 Route를 써넣습니다.</p>
<br />
<input type="text" id="redUrl" />
<button on:click={move}>Go</button>
<slot />
