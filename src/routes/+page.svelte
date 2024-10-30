<script lang="ts">
	import { goto } from '$app/navigation';

	const startGame = () => {
		goto('/gb');
	};
</script>

<div class="flex flex-col items-center justify-center h-screen">
	<h1 class="text-5xl font-bold mb-6">Welcome to SvelteNim</h1>
	<button class="btn btn-primary" on:click={startGame}>Start Game</button>
</div>
