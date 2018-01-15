//Block color
var blockColor = ['btn-primary','btn-danger','btn-primary','btn-success'];

//This Object is for defining the structure of a Block
function Block(info){
	this.name = info.name;
	this.status = info.status;
	this.row = info.row;
}

//This object is Game 
function Game(info){
	this.totalBlock = 16;
	this.blockList = [];
	this.rowNumber = 4;
	this.hiddenBlocks = 0;
	this.initializeGame = function(){
		var colNumber = 1;
		var label = 1;
		for(var rowIndex = 1; rowIndex <= this.rowNumber; rowIndex+= 1){
			var tempBlockList = [];
			$('#row'+rowIndex).empty();
			for(var col = 0; col < colNumber; col+= 1){
				var info = {name:'block'+label,status:true,row:rowIndex};
				var block = '<button class="btn '+blockColor[rowIndex-1]+' common-pad-mar block" id = "block'+label+'">'+'&#216'+'</button>';
				$('#row'+rowIndex).append(block);
				tempBlockList.push(new Block(info));
				label += 1;
			}
			this.blockList.push(tempBlockList);
			colNumber += 2;
		}
	};

	this.reload = function(){
		this.hiddenBlocks = 0;
		for(var i = 0; i < this.blockList.length; i++){
			for (var j = 0; j < this.blockList[i].length; j++) {
				var id = this.blockList[i][j].name;
				$('#'+id).show('slow');
				this.blockList[i][j].status = true;
			}
		}
	}

	this.copyBlockList = function(){
		//Copy Blocks
		var tempBlockList = [];
		for(var i = 0; i < this.blockList.length; i++){
			var tempList = [];
			for(var j = 0; j < this.blockList[i].length; j++){
				var info = {
					name:this.blockList[i][j].name,
					status:this.blockList[i][j].status,
					row:this.blockList[i][j].row};
				tempList.push(new Block(info));
			}
			tempBlockList.push(tempList);
		}
		return tempBlockList; 
	};

	this.computerMove = function(){
		var tempBlockList = this.copyBlockList();
		console.log('Temp BlockList');
		for(var i = 0; i < tempBlockList.length; i++){
			console.log(tempBlockList[i]);
		}
		for(var i = 0; i < tempBlockList.length; i++){
			var result = [];
			for(var j = 0; j < tempBlockList[i].length; j++){
				if (tempBlockList[i][j].status == false) {continue;}
				tempBlockList[i][j].status = false;
				var tree = this.getTree(tempBlockList);
				result.push([i,j]);
				if (this.isBalanaced(tree)) {
					console.log('Expected ');
					
					for(var index = 0; index < result.length; index++){
						var row = result[index][0];
						var col = result[index][1];
						var id = tempBlockList[row][col].name;
						console.log('ID: '+id);
						this.hideblock(id);
						$('#'+id).hide('slow');
					}
					return;
				}
			}
			tempBlockList = this.copyBlockList();
		}

	};



	this.rowCalculation = function(blockList){
		var rowBlocks = [0,0,0,0];
		for(var i = 0; i < blockList.length; i++){
			var count = 0;
			for(var j = 0; j < blockList[i].length; j++){
				if (blockList[i][j].status) {
					count += 1;
				}
			}
			rowBlocks[i] = count;
		}
		return rowBlocks;
	};

	this.showBlocksInfo = function(){
		console.clear();
		var rowsBlock = this.rowCalculation(this.blockList);
		for(var i = 0; i < this.blockList.length; i++){
			console.log(this.blockList[i]);
			//console.log('Length: '+rowsBlock[i]);
		}
	};

	this.hideblock = function(id){
		for(var i = 0; i < this.blockList.length; i++){
			for(var j = 0; j < this.blockList[i].length; j++){/*
				if (typeof this.blockList[i][j] == 'undefined') { continue;}*/
				if (this.blockList[i][j].name == id) {
					this.blockList[i][j].status = false;
					//delete(this.blockList[i][j]);
					this.hiddenBlocks += 1;
					return;
				} 
			}
		}
	};

	this.getTree = function(blockList){
		var result = [0,0,0]; // 4 2 1 Binary
		var rowsBlock = this.rowCalculation(blockList);
		//console.log('Rows: '+rowsBlock);
		//console.log('Tree');
		for(var i = 0; i < rowsBlock.length; i++){
			var treeArr = [];
			if (rowsBlock[i] - 4 >= 0) {
				result[0] += 1;
				rowsBlock[i] -= 4;
				treeArr.push(4);
			}else{
				treeArr.push(0);
			}
			if (rowsBlock[i] - 2 >= 0) {
				result[1] += 1;
				rowsBlock[i] -= 2;
				treeArr.push(2);
			}else{
				treeArr.push(0);
			}
			if (rowsBlock[i] - 1 >= 0) {
				result[2] += 1;
				rowsBlock[i] -= 1;
				treeArr.push(1);
			}else{
				treeArr.push(0);
			}
			//console.log(treeArr);
		}
		return result;
	};
	

	this.isBalanaced = function(tree){
		var result = tree;
		console.log('Tree: '+result);
		for (var i = 0; i < result.length; i++) {
			if (result[i] % 2 != 0) {
				return false;
			}
		}
		return true;
	};

}

//This function will called when the document will be ready
$(function(e){
	$('#youlose').hide();
	$('#newgame').hide();
	var game = new Game();
	game.initializeGame();
	game.showBlocksInfo();
	var tree = game.getTree(game.blockList);
	console.log('Balanced: '+game.isBalanaced(tree));
	var alreadyPicked = false;
	var parentId = null;
	$('.block').on('click',function(event){
		event.preventDefault();
		
		if (!alreadyPicked || $(this).parent().attr('id') == parentId) {
			//Get parent id
			parentId = $(this).parent().attr('id');
			var blockid = $(this).attr('id');
			console.log(blockid);
			$(this).hide('slow');
			game.hideblock(blockid);
			game.showBlocksInfo();
			tree = game.getTree(game.blockList);
			console.log('Balanced: '+game.isBalanaced(tree));
			console.log('Parent ID: '+parentId);
			alreadyPicked = true;
			console.log('Hidden: '+game.hiddenBlocks);
		}else{
			alert('Please Pick From '+parentId);
		}

	});

	$('#done').on('click',function(event){
		game.computerMove();
		game.showBlocksInfo();
		tree = game.getTree(game.blockList);
		console.log('Balanced: '+game.isBalanaced(tree));
		alreadyPicked = false;
		console.log('Hidden: '+game.hiddenBlocks);
		if (game.hiddenBlocks == game.totalBlock) {
			$(this).hide();
			$('#youlose').show('slow');
			$('#newgame').show('slow');
		}
	});

	$('#newgame').on('click',function(){
		setTimeout(function(){
			$('#done').show('slow');
			$('#newgame').hide();
			$('#youlose').hide();
			game.reload();
			},100);
	});
});