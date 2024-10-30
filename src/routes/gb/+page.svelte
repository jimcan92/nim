<script lang="ts">
	import haste from '$lib/images/arcane.webp';
	import { NimGame } from '$lib/states/g.svelte';
	const players = ['Jimboy', 'Computer'];

	const game = new NimGame();
</script>

<h2 class="text-center text-3xl font-bold">Nim Game</h2>

{#if game.over}
	<p class="text-center text-2xl">{players[game.picking]} has won!</p>
	<div class="flex justify-center">
		<button class="btn btn-primary" onclick={() => window.location.reload()}>Restart Game</button>
	</div>
{:else}
	<!-- <p class="text-center text-xl">Turn: {players[game.picking]}</p> -->
	<p class="text-center text-xl">Computer Picked: {game.computerPicked}</p>
	<div class="grid">
		{#each game.piles as pile, pileIndex}
			<div class="card w-52 bg-base-100 shadow-md p-4">
				<!-- <h3 class="font-bold text-xl">Pile {pileIndex + 1}</h3> -->
				<div class="grid grid-cols-3">
					{#each Array(pile.items).fill(0) as _, itemIndex}
						<button
							class="matchstick cursor-pointer"
							class:selected={pile.selected[itemIndex]}
							onclick={() => game.toggleSelect(pileIndex, itemIndex)}
						>
							<!-- Add some visuals like matchstick or customize it -->
							<!-- <svg width="40" height="100">
								<rect width="10" height="70" x="15" y="20" fill="brown" />
								<circle cx="20" cy="20" r="10" fill="red" />
							</svg> -->
							<img src={haste} alt="" class="rounded-full" />
						</button>
					{/each}
				</div>
			</div>
		{/each}
		<button
			disabled={game.activePile === -1}
			class="btn btn-primary mt-4"
			onclick={() => game.confirmPick()}>Pick</button
		>
	</div>
{/if}

<style>
	.matchstick {
		max-width: 3rem;
		max-height: 3rem;

		transform: scale(0.8);
		transition: transform 0.2s;
		opacity: 0.5;
	}
	.matchstick.selected {
		transform: scale(1); /* Highlight effect on selected matchsticks */
		opacity: 1;
	}
</style>
