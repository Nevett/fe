var NewSoldier = function(initUnit, teamNum)
{
	var _me = {id: initUnit.id};
	var _selected = false;
	var _availableFights, _availableMoves;
	
	var _position = initUnit.pos;
	var _soldierType = initUnit.type;
	var _team = initUnit.team == teamNum;
	var _health = initUnit.health;
	
	var _displayMoves, _displayFights;
	
	var GetSprite = function(){
		switch(_soldierType)
		{
			case Soldier.SWORD:
				return Sprite.SWORD;
			case Soldier.AXE:
				return Sprite.AXE;
			case Soldier.SPEAR:
				return Sprite.SPEAR;
		}
	}
	
	_me.GetPosition = function(){
		return {x: _position.x, y: _position.y};
	}
	
	_me.Deselect = function(){
		_selected = false;
		
		_availableMoves = _availableFights = _displayFights = _displayMoves = [];
		
		window.bus.pub('deselect');
	}
	
	_me.Select = function(availableFights, availableMoves){
		_selected = true;
		
		_availableFights = availableFights;
		_availableMoves = availableMoves;
		
		_displayFights = [];
		_displayMoves = [];
		
		for(var i = 0; i < _availableMoves.length; i++)
			if(!(_availableMoves[i].x == _position.x && _availableMoves[i].y == _position.y))
				_displayMoves.push(_availableMoves[i]);
		
		for(var i = 0; i < _availableFights.length; i++) {
			var displayFight = true;
			for(var j = 0; j < _availableMoves.length; j++)
				if(_availableFights[i].x == _availableMoves[j].x && _availableFights[i].y == _availableMoves[j].y) {
					displayFight = false;
					break;
				}
			if(displayFight)
				_displayFights.push(_availableFights[i]);
		}
	}
	
	_me.SelectGround = function(position){
		if(!_selected)
			return;
		
		for(var i = 0; i < _availableMoves.length; i++)
			if(_availableMoves[i].x == position.x && _availableMoves[i].y == position.y)
			{
				_me.MoveTo(position);
			}
		
		_me.Deselect();
	}
	
	_me.MoveTo = function(position){
		_position = {x: position.x, y: position.y};

		window.bus.pub('soldier move', _me);
	}
	
	_me.MovementRange = function(){
		return 4;
	}
	
	_me.AttackRange = function(){
		return {min: 1, max: 1};
	}
	
	_me.Selectable = function(){
		return _team == Team.ME;
	}
	
	_me.Team = function(){
		return _team;
	}
	
	_me.Update = function(){
		// not currently needed
	}
	
	_me.Draw = function(){
		SpriteHandler.Draw(GetSprite(), {x: _position.x * Global.TileSize(), y: _position.y * Global.TileSize()});
		
		SpriteHandler.Draw(_team == Team.ME ? Sprite.YOUR_UNIT : Sprite.THEIR_UNIT, {x: _position.x * Global.TileSize(), y: _position.y * Global.TileSize()});
		
		SpriteHandler.Draw(Sprite.HEALTH_EMPTY, {x: _position.x * Global.TileSize(), y: _position.y * Global.TileSize()});
		SpriteHandler.DrawInRect(Sprite.HEALTH_FULL, {x: _position.x * Global.TileSize(), y: _position.y * Global.TileSize()}, {x: 0, y: 0, width: Global.TileSize() * (_health / 100), height: Global.TileSize()});
		
		if(!_selected)
			return;
		
		SpriteHandler.Draw(Sprite.SELECTION, {x: _position.x * Global.TileSize(), y: _position.y * Global.TileSize()});
		
		for(var i = 0; i < _displayMoves.length; i++)
			SpriteHandler.Draw(Sprite.BLUE, {x: _displayMoves[i].x * Global.TileSize(), y: _displayMoves[i].y * Global.TileSize()});
		
		for(var i = 0; i < _displayFights.length; i++)
			SpriteHandler.Draw(Sprite.RED, {x: _displayFights[i].x * Global.TileSize(), y: _displayFights[i].y * Global.TileSize()});
	}
	
	window.bus.pub('soldier place', _me);
	
	return _me;
}

var Soldier = {
	SWORD: 0,
	AXE: 1,
	SPEAR: 2
}

var Team = {
	ME: 0,
	ENEMY: 1
}