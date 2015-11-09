var NewStageManager = function() {
	var _me = {id: makeid()};

	var oldSoldierPositions = {};
	var tiles = [];
	var currentSelection;
	
	for(var i = 0; i < 35; i++) {
		tiles[i] = [];
		for(var j = 0; j < 25; j++)
			tiles[i][j] = undefined;
	}
	
	var AvailableFightsFor = function(unit, availableMoves){
		return [{x: 1, y: 1}, {x: 5, y: 1}, {x: 3, y: 2}];
	}
	
	var AvailableMovesFor = function(unit){
		return [{x: 1, y: 1}, {x: 4, y: 1}, {x: 2, y: 2}];
	}
	
	var SelectUnit = function(unit){
		if(currentSelection)
			currentSelection.Deselect();
		
		currentSelection = unit;
		
		var availableMoves = AvailableMovesFor(unit);
		var availableFights = AvailableFightsFor(unit, availableMoves);
		
		currentSelection.Select(availableFights, availableMoves);
	}
	
	var SelectGround = function(position){
		if(!currentSelection)
			return;
		
		currentSelection.SelectGround(position);
	}
	
	window.bus.sub('soldier move', function(soldier){
		var oldPosition = oldSoldierPositions[soldier];
		var newPosition = soldier.GetPosition();
		
		tiles[oldPosition.x][oldPosition.y] = undefined;
		tiles[newPosition.x][newPosition.y] = soldier;
		
		oldSoldierPositions[soldier] = {x: newPosition.x, y: newPosition.y};
	});
	
	window.bus.sub('soldier place', function(soldier){
		var newPosition = soldier.GetPosition();
		
		tiles[newPosition.x][newPosition.y] = soldier;
		
		oldSoldierPositions[soldier] = {x: newPosition.x, y: newPosition.y};
	});
	
	window.bus.sub('cursor click', function(position){
		if(tiles[position.x][position.y])
			SelectUnit(tiles[position.x][position.y]);
		else
			SelectGround(position);
	});
	
	_me.Draw = function(){
		if(!currentSelection)
			return;
	
		var selectionPosition = currentSelection.GetPosition();
		
		SpriteHandler.Draw(Sprite.SELECTION, selectionPosition.x, selectionPosition.y);
	}
	
	return _me;
}