var Global = {
	LastId: 0,
	NewId: function(forDebugging)
	{
		if(forDebugging) {
			return Global.Names.splice(Math.floor(Math.random() * this.Names.length), 1)[0];
		}
		return this.LastId++;
	}
};

Global.Names = ['Ashlee',
'Luetta',
'Marg',
'Curtis',
'Raphael',
'Kallie',
'Elyse',
'Delbert',
'Tajuan',
'Keshi',
'Leath',
'Duane',
'Peter',
'Martina',
'Hien',
'Scot',
'Corina',
'Kathyrn',
'Lula',
'Bailey',
'Donna',
'Alfred',
'Jolynn',
'Elise',
'Tiffani',
'Alycia',
'Marian',
'Rayna',
'Williams',
'Nina',
'Livia',
'Nolan',
'Charlotte',
'Lynetta',
'Jennie',
'Terina',
'Darla',
'Helaine',
'Jarred',
'Nerissa',
'Conchita',
'Trenton',
'Earlie',
'Lorina',
'Lovetta',
'Felisa',
'Marilou',
'Armanda',
'Scott',
'Laura'];