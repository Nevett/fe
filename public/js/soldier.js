var NewSoldier = function(x, y, soldierType)
{
	var _me = {};
	
	var GetSprite = function(){
		switch(soldierType)
		{
			case Soldier.SWORD:
				return Sprite.SWORD;
			case Soldier.AXE:
				return Sprite.AXE;
			case Soldier.SPEAR:
				return Sprite.SPEAR;
		}
	}
	
	_me.Draw = function(){
		SpriteHandler.Draw(GetSprite(), {x: x * 20, y: y * 20});
	}
	
	return _me;
}

var Soldier = {
	SWORD: 0,
	AXE: 1,
	SPEAR: 2
}