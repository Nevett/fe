var NewSoldier = function(_position, _soldierType, _team)
{
	var _me = {id: makeid()};
	var _selected = false;
	var _availableFights, _availableMoves;
	
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
	}
	
	_me.Select = function(availableFights, availableMoves){
		_selected = true;
		
		_availableFights = availableFights;
		_availableMoves = availableMoves;
		
		for(var i = 0; i < _availableMoves.length; i++)
			for(var j = _availableFights.length-1; j >= 0; j--)
				if(_availableFights[j].x == _availableMoves[i].x && _availableFights[j].y == _availableMoves[i].y)
					_availableFights.splice(j, 1);
			
		console.log(_availableFights);
	}
	
	_me.SelectGround = function(position){
		if(!_selected)
			return;
		
		_position = {x: position.x, y: position.y};
		
		window.bus.pub('soldier move', _me);
	}
	
	_me.MovementRange = function(){
		return 4;
	}
	
	_me.AttackRange = function(){
		return {min: 1, max: 1};
	}
	
	_me.Update = function(){
		// not currently needed
	}
	
	_me.Draw = function(){
		SpriteHandler.Draw(GetSprite(), {x: _position.x * 20, y: _position.y * 20});
		
		SpriteHandler.Draw(_team == Team.ENEMY ? Sprite.YOUR_UNIT : Sprite.THEIR_UNIT, {x: _position.x * 20, y: _position.y * 20});
		
		if(!_selected)
			return;
		
		SpriteHandler.Draw(Sprite.SELECTION, {x: _position.x * 20, y: _position.y * 20});
		
		for(var i = 0; i < _availableMoves.length; i++)
			SpriteHandler.Draw(Sprite.BLUE, {x: _availableMoves[i].x * 20, y: _availableMoves[i].y * 20});
		
		for(var i = 0; i < _availableFights.length; i++)
			SpriteHandler.Draw(Sprite.RED, {x: _availableFights[i].x * 20, y: _availableFights[i].y * 20});
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