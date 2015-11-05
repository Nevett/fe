var StartGame = function(context, sprite)
{
	DrawSprite(context, sprite, SPRITES.KING, {x: 350, y: 200});
}

var DrawSprite = function(context, sprite, spriteId, location){
	context.drawImage(sprite, spriteId.x * 40, spriteId.y * 40, 40, 40, location.x, location.y, 40, 40);
}

var SPRITES = {
	GRASS: {x: 0, y: 0},
	BRICK: {x: 1, y: 0},
	KING: {x: 2, y: 0},
	SWORD: {x: 0, y: 1},
	AXE: {x: 1, y: 1},
	SPEAR: {x: 2, y: 1},
	BOW: {x: 0, y: 2},
	YOUR_UNIT: {x: 1, y: 2},
	THEIR_UNIT: {x: 2, y: 2},
	FADE_OUT: {x: 0, y: 3},
	HEALTH_FULL: {x: 1, y: 3},
	HEALTH_EMPTY: {x: 2, y: 3}
};