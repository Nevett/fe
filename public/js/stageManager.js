var NewStageManager = function() {
	var _me = {id: makeid()};

	var _oldSoldierPositions = {};
	var _tiles = [];
	var _currentSelection;
	
	for(var i = 0; i < 35; i++) {
		_tiles[i] = [];
		for(var j = 0; j < 25; j++)
			_tiles[i][j] = undefined;
	}
	
	var AvailableFightsFor = function(unit, availableMoves){
		var availableFights = [];
		var range = unit.AttackRange();
		var pos = unit.GetPosition();
		
		var minRangeSq = Math.pow(range.min, 2);
		var maxRangeSq = Math.pow(range.max, 2);
		
		for(var i = 0; i < availableMoves.length; i++)
		{
			for(var j = -range.max; j <= range.max; j++)
				for(var k = -range.max; k <= range.max; k++)
				{
					var fightPos = {x: availableMoves[i].x + j, y: availableMoves[i].y + k};
					var distanceSq = Math.pow(j, 2) + Math.pow(k, 2);
					if(distanceSq >= minRangeSq && distanceSq <= maxRangeSq && !(pos.x == fightPos.x && pos.y == fightPos.y))
						availableFights.push(fightPos);
				}
		}
		
		return availableFights;
	}
	
	var AvailableMovesFor = function(unit){
		var open = [{pos: unit.GetPosition(), h: 0}];
		var closed = [];
		
		var range = unit.MovementRange();
		var pos = unit.GetPosition();
		
		var CheckTile = function(currentTile, shift){
			var newTile = {pos: {x: currentTile.pos.x + shift.x, y: currentTile.pos.y + shift.y}, h: currentTile.h + 1};
			
			if(newTile.h >= range || newTile.pos.x < 0 || newTile.pos.x >= _tiles.length || newTile.pos.y < 0 || newTile.pos.y >= _tiles[0].length)
				return;
			
			for(var k = 0; k < closed.length; k++)
				if(closed[k].pos.x == newTile.pos.x && closed[k].pos.y == newTile.pos.y)
					return;
			
			for(var k = 0; k < open.length; k++)
				if(open[k].pos.x == newTile.pos.x && open[k].pos.y == newTile.pos.y)
					return;
			
			if(!_tiles[newTile.pos.x][newTile.pos.y])
				open.push(newTile);
		}
		
		while(open.length > 0)
		{
			var currentTile = open.splice(0, 1)[0];
			closed.push(currentTile);
			
			CheckTile(currentTile, {x: -1, y: 0});
			CheckTile(currentTile, {x: 1, y: 0});
			CheckTile(currentTile, {x: 0, y: -1});
			CheckTile(currentTile, {x: 0, y: 1});
		}
		
		var moves = [];
		for(var i = 0; i < closed.length; i++)
			if(!(closed[i].pos.x == pos.x && closed[i].pos.y == pos.y))
				moves.push(closed[i].pos);
		
		return moves;
	}
	
	var SelectUnit = function(unit){
		if(_currentSelection)
			_currentSelection.Deselect();
		
		_currentSelection = unit;
		
		var availableMoves = AvailableMovesFor(unit);
		var availableFights = AvailableFightsFor(unit, availableMoves);
		
		_currentSelection.Select(availableFights, availableMoves);
	}
	
	var SelectGround = function(position){
		if(!_currentSelection)
			return;
		
		_currentSelection.SelectGround(position);
	}
	
	window.bus.sub('soldier move', function(soldier){
		var oldPosition = _oldSoldierPositions[soldier];
		var newPosition = soldier.GetPosition();
		
		_tiles[oldPosition.x][oldPosition.y] = undefined;
		_tiles[newPosition.x][newPosition.y] = soldier;
		
		_oldSoldierPositions[soldier] = {x: newPosition.x, y: newPosition.y};
	});
	
	window.bus.sub('soldier place', function(soldier){
		var newPosition = soldier.GetPosition();
		
		_tiles[newPosition.x][newPosition.y] = soldier;
		
		_oldSoldierPositions[soldier] = {x: newPosition.x, y: newPosition.y};
	});
	
	window.bus.sub('cursor click', function(position){
		if(_tiles[position.x][position.y])
			SelectUnit(_tiles[position.x][position.y]);
		else
			SelectGround(position);
	});
	
	_me.Draw = function(){
		if(!_currentSelection)
			return;
	
		var selectionPosition = _currentSelection.GetPosition();
		
		SpriteHandler.Draw(Sprite.SELECTION, selectionPosition.x, selectionPosition.y);
	}
	
	return _me;
}