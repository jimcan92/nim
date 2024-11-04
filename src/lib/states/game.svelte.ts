type Pile = {
	items: number;
	selected: boolean[];
	name: string;
};

let _piles = $state<Pile[]>([{ items: 1, selected: [false], name: '' }]);
let _picking = $state(0);
let _computerPicked = $state('');
let _twoPlayer = $state(false);
let _players = $state(['Player']);

const _nimSum = $derived(_piles.reduce((acc, pile) => acc ^ pile.items, 0));
const _activePile = $derived(_piles.findIndex((p) => p.selected.find((s) => s)));
const _gameOver = $derived(_piles.reduce((s, i) => s + i.items, 0) === 0);

const _many = $derived.by(() => {
	const remainingPiles = _piles.filter((p) => p.items > 0);
	return remainingPiles.length === 1 && remainingPiles[0].items > 1;
});

const _oneMany = $derived.by(() => {
	const remainingPiles = _piles.filter((p) => p.items > 0);
	return remainingPiles.length === 2 && remainingPiles.some((p) => p.items === 1);
});

const _oneOneMany = $derived.by(() => {
	const remainingPiles = _piles.filter((p) => p.items > 0);
	return remainingPiles.length === 3 && remainingPiles.filter((p) => p.items === 1).length === 2;
});

const _oneOneOneMany = $derived.by(() => {
	const remainingPiles = _piles.filter((p) => p.items > 0);
	return remainingPiles.length === 4 && remainingPiles.filter((p) => p.items === 1).length === 3;
});

export const game = {
	get computerPicked() {
		return _computerPicked;
	},
	get players() {
		return _players;
	},
	get gameOver() {
		return _gameOver;
	},
	get picking() {
		return _picking;
	},
	get piles() {
		return _piles;
	},
	get activePile() {
		return _activePile;
	},
	create,
	setPileNames,
	toggleSelect,
	confirmPick
};

function create({
	numberOfPiles = 4,
	players = ['Player 1']
}: { numberOfPiles?: number; players?: string[] } = {}) {
	_piles = Array.from({ length: numberOfPiles }, (_, index) => 2 * index + 1).map((v) => ({
		items: v,
		selected: Array(v).fill(false),
		name: ''
	}));
	_twoPlayer = players.length === 2;
	_players = players.length === 2 ? players : [players[0], 'Computer'];
}

function setPileNames(names: string[]) {
	names.forEach((n, i) => {
		_piles[i].name = n;
	});
}

function isItemSelected(pileIndex: number, itemIndex: number) {
	return _piles[pileIndex].selected[itemIndex];
}

function toggleSelect(pileIndex: number, itemIndex: number) {
	if (_activePile >= 0 && _activePile !== pileIndex) return;

	_piles[pileIndex].selected[itemIndex] = !isItemSelected(pileIndex, itemIndex);
}

function deselectAll(pileIndex: number) {
	_piles[pileIndex].selected.fill(false);
}

function confirmPick() {
	const selectedCount = _piles[_activePile!].selected.filter((v) => v).length;
	_piles[_activePile!].items -= selectedCount;
	deselectAll(_activePile!);
	_picking = _picking === 0 ? 1 : 0;
	if (!_twoPlayer) computerMove();
}

function computerMove() {
	if (_many || _oneMany || _oneOneMany || _oneOneOneMany) {
		const pile = _piles.find((p) => p.items > 1);

		if (pile) {
			removeItemsFromPile(pile);

			return;
		}
	}

	if (_nimSum === 0) {
		randomRemove();
		return;
	}

	removeToMakeNimSumZero();
}

function removeItemsFromPile(pile: Pile) {
	const index = _piles.indexOf(pile);
	let itemsToRemove = pile.items;

	if (_oneOneMany || _many) itemsToRemove -= 1;

	_piles[index].items -= itemsToRemove; // Remove all items from the pile
	_computerPicked = `Computer picked ${itemsToRemove} ${pile.name} ${itemsToRemove > 1 ? 'Runes' : 'Rune'}`;
	_picking = 0; // End of computer's turn
}

function randomRemove() {
	const nonEmptyPiles = _piles
		.map((pile, index) => (pile.items > 0 ? index : -1))
		.filter((index) => index !== -1);
	const randomIndex = nonEmptyPiles[Math.floor(Math.random() * nonEmptyPiles.length)];
	_piles[randomIndex].items -= 1;
	_computerPicked = `Computer picked 1 ${_piles[randomIndex].name} Rune`;
	_picking = 0;
}

function removeToMakeNimSumZero() {
	for (let i = 0; i < _piles.length; i++) {
		const targetPile = _piles[i].items ^ _nimSum;
		if (targetPile < _piles[i].items) {
			const itemsToRemove = _piles[i].items - targetPile;
			_piles[i].items -= itemsToRemove;
			_computerPicked = `Computer picked ${itemsToRemove} ${_piles[i].name} ${itemsToRemove > 1 ? 'Runes' : 'Rune'}`;
			_picking = 0; // End of computer's turn
			return;
		}
	}
}
