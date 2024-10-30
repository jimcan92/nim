class Pile {
	items = $state(1);
	selected = $state([false]);

	constructor(items: number) {
		this.items = items;
		this.selected = Array(items).fill(false);
	}

	isItemSelected(itemIndex: number) {
		return this.selected[itemIndex];
	}

	toggleSelect(itemIndex: number) {
		this.selected[itemIndex] = !this.isItemSelected(itemIndex);
	}

	deselectAll() {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		this.selected = this.selected.map((_) => false);
	}

	confirmPick() {
		this.items -= this.selected.filter((v) => v).length;
		this.deselectAll();
	}
}

export function createGame() {
	const _piles = $state([new Pile(1), new Pile(3), new Pile(5), new Pile(7)]);
	const _gameOver = $state(false);
	const _currentPlayer = $state(1);

	return {
		get piles() {
			return _piles;
		},
		get gameOver() {
			return _gameOver;
		},
		get currentPlayer() {
			return _currentPlayer;
		}
	};
}
