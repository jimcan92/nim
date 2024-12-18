type Pile = {
	items: number;
	selected: boolean[];
	name: string;
};

export class NimGame {
	piles = $state<Pile[]>([{ items: 1, selected: [false], name: '' }]);
	activePile = $derived(this.piles.findIndex((p) => p.selected.find((s) => s)));
	picking = $state(0);
	over = $derived(this.piles.reduce((s, i) => s + i.items, 0) === 0);
	computerPicked = $state('');
	twoPlayer = $state(false);
	players = $state(['Player 1']);

	nimSum = $derived(this.piles.reduce((acc, pile) => acc ^ pile.items, 0));

	many = $derived.by(() => {
		const remainingPiles = this.piles.filter((p) => p.items > 0);
		return remainingPiles.length === 1 && remainingPiles[0].items > 1;
	});

	oneMany = $derived.by(() => {
		const remainingPiles = this.piles.filter((p) => p.items > 0);
		return remainingPiles.length === 2 && remainingPiles.some((p) => p.items === 1);
	});

	oneOneMany = $derived.by(() => {
		const remainingPiles = this.piles.filter((p) => p.items > 0);
		return remainingPiles.length === 3 && remainingPiles.filter((p) => p.items === 1).length === 2;
	});

	oneOneOneMany = $derived.by(() => {
		const remainingPiles = this.piles.filter((p) => p.items > 0);
		return remainingPiles.length === 4 && remainingPiles.filter((p) => p.items === 1).length === 3;
	});

	constructor({ numberOfPiles = 4 }: { numberOfPiles?: number } = {}) {
		this.piles = Array.from({ length: numberOfPiles }, (_, index) => 2 * index + 1).map((v) => ({
			items: v,
			selected: Array(v).fill(false),
			name: ''
		}));
	}

	setPileNames(names: string[]) {
		names.forEach((n, i) => {
			this.piles[i].name = n;
		});
	}

	setPlayers(players: string[]) {
		this.players = players;
		this.twoPlayer = this.players.length === 2;
		this.players = this.players.length === 2 ? this.players : [this.players[0], 'Computer'];
	}

	isItemSelected(pileIndex: number, itemIndex: number) {
		return this.piles[pileIndex].selected[itemIndex];
	}

	toggleSelect(pileIndex: number, itemIndex: number) {
		if (this.activePile >= 0 && this.activePile !== pileIndex) return;

		this.piles[pileIndex].selected[itemIndex] = !this.isItemSelected(pileIndex, itemIndex);
	}

	deselectAll(pileIndex: number) {
		this.piles[pileIndex].selected.fill(false);
	}

	confirmPick() {
		const selectedCount = this.piles[this.activePile!].selected.filter((v) => v).length;
		this.piles[this.activePile!].items -= selectedCount;
		this.deselectAll(this.activePile!);
		this.picking = this.picking === 0 ? 1 : 0;
		if (!this.twoPlayer) this.computerMove();
	}

	computerMove() {
		if (this.many || this.oneMany || this.oneOneMany || this.oneOneOneMany) {
			const pile = this.piles.find((p) => p.items > 1);

			if (pile) {
				this.removeItemsFromPile(pile);

				return;
			}
		}

		if (this.nimSum === 0) {
			this.randomRemove();
			return;
		}

		this.removeToMakeNimSumZero();
	}

	private removeItemsFromPile(pile: Pile) {
		const index = this.piles.indexOf(pile);
		let itemsToRemove = pile.items;

		if (this.oneOneMany || this.many) itemsToRemove -= 1;

		this.piles[index].items -= itemsToRemove; // Remove all items from the pile
		this.computerPicked = `Computer picked ${itemsToRemove} ${pile.name} ${itemsToRemove > 1 ? 'Runes' : 'Rune'}`;
		this.picking = 0; // End of computer's turn
	}

	private randomRemove() {
		const nonEmptyPiles = this.piles
			.map((pile, index) => (pile.items > 0 ? index : -1))
			.filter((index) => index !== -1);
		const randomIndex = nonEmptyPiles[Math.floor(Math.random() * nonEmptyPiles.length)];
		this.piles[randomIndex].items -= 1;
		this.computerPicked = `Computer picked 1 ${this.piles[randomIndex].name} Rune`;
		this.picking = 0;
	}

	private removeToMakeNimSumZero() {
		for (let i = 0; i < this.piles.length; i++) {
			const targetPile = this.piles[i].items ^ this.nimSum;
			if (targetPile < this.piles[i].items) {
				const itemsToRemove = this.piles[i].items - targetPile;
				this.piles[i].items -= itemsToRemove;
				this.computerPicked = `Computer picked ${itemsToRemove} ${this.piles[i].name} ${itemsToRemove > 1 ? 'Runes' : 'Rune'}`;
				this.picking = 0; // End of computer's turn
				return;
			}
		}
	}
}
