<script lang="ts">
	import arcaneRune from '$lib/images/arcane.png';
	import bountyRune from '$lib/images/bounty.png';
	import hasteRune from '$lib/images/haste.png';
	import regenRune from '$lib/images/regen.png';

	import { NimGame } from '$lib/states/g.svelte';
	import { onMount, type Snippet } from 'svelte';
	const players = ['Jimboy', 'Computer'];

	const game = new NimGame();

	let icons = $state([
		{ name: 'Arcane', icon: arcane },
		{ name: 'Bounty', icon: bounty },
		{ name: 'Haste', icon: haste },
		{ name: 'Regen', icon: regen }
	]);

	onMount(() => {
		for (let i = icons.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[icons[i], icons[j]] = [icons[j], icons[i]]; // Swap elements
		}

		game.setPileNames(icons.map((i) => i.name));
	});
</script>

{#snippet arcane()}
	<img src={arcaneRune} alt="Arcane Rune" class="rounded-full" />
{/snippet}

{#snippet bounty()}
	<img src={bountyRune} alt="Bounty Rune" class="rounded-full" />
{/snippet}

{#snippet haste()}
	<img src={hasteRune} alt="Haste Rune" class="rounded-full" />
{/snippet}

{#snippet regen()}
	<img src={regenRune} alt="Regeneration Rune" class="rounded-full" />
{/snippet}

{#snippet item({
	selected,
	select,
	icon
}: {
	selected: boolean;
	select: VoidFunction;
	icon: Snippet;
})}
	<button class="rune cursor-pointer" class:selected onclick={select}>
		<!-- Add some visuals like matchstick or customize it -->
		<!-- <svg width="40" height="100">
									<rect width="10" height="70" x="15" y="20" fill="brown" />
									<circle cx="20" cy="20" r="10" fill="red" />
								</svg> -->
		{@render icon()}
	</button>
{/snippet}

<h2 class="text-center text-3xl font-bold">Nim Game</h2>

{#if game.over}
	<p class="text-center text-2xl">{players[game.picking]} has won!</p>
	<div class="flex justify-center">
		<button class="btn btn-primary" onclick={() => window.location.reload()}>Restart Game</button>
	</div>
{:else}
	<!-- <p class="text-center text-xl">Turn: {players[game.picking]}</p> -->
	<p class="text-center text-xl">{game.computerPicked}</p>
	<div class="grid">
		{#each game.piles as pile, pileIndex}
			<div class="card w-52 bg-base-100 shadow-md p-4">
				<!-- <h3 class="font-bold text-xl">Pile {pileIndex + 1}</h3> -->
				<div class="grid grid-cols-3">
					{#each Array(pile.items).fill(0) as _, itemIndex}
						{@render item({
							selected: pile.selected[itemIndex],
							select: () => game.toggleSelect(pileIndex, itemIndex),
							icon: icons[pileIndex].icon
						})}
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
	.rune {
		max-width: 3rem;
		max-height: 3rem;

		transform: scale(0.8);
		transition: transform 0.2s;
		opacity: 0.5;
	}
	.rune.selected {
		transform: scale(1); /* Highlight effect on selected matchsticks */
		opacity: 1;
	}
</style>
