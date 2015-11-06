var StartGame = function()
{
	var _tileManager = NewTileManager();
	
	var _soldierManager = NewSoldierManager();
	
	window.requestAnimationFrame(function(){
		SpriteHandler.Clear();
		
		_tileManager.Draw();
		_soldierManager.Draw();
	});
}
