<script lang="ts">
	import { goto } from '$app/navigation';

	let player1 = $state('Player 1');
	let player2 = $state('Player 2');

	const startGame = () => {
		if (player1 && player2) goto(`/game?p1=${player1}&p2=${player2}`);
	};

	const startAgainstComputer = () => {
		goto(`/game?p1=${player1}`);
	};
</script>

<div class="flex flex-col items-center justify-center h-screen">
	<h1 class="text-5xl font-bold text-center">Play RuNim</h1>
	<p class="mb-6">A Rune (Dota 2 Runes) based Nim game</p>
	<div class="flex flex-col gap-4 w-full max-w-xs">
		<div class="flex flex-col w-full">
			<input
				type="text"
				name="p1"
				id="p1"
				required
				class="input input-bordered"
				bind:value={player1}
			/>
			<div class="divider">VS</div>
			<input type="text" name="p2" id="p2" class="input input-bordered" bind:value={player2} />
		</div>
		<button class="btn btn-primary" onclick={startGame}>Start Game</button>
		<div class="divider">OR</div>
		<button class="btn btn-primary" onclick={startAgainstComputer}>Against Computer</button>
	</div>
</div>
