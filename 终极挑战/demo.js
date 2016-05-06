// JavaScript Document
$(function(){
	

var map = [
			{ 											//关卡的数据
				background : [20,13],			//关卡1			//背景的行数和列数
				mainBg : 'url(img/bgm1.jpg) no-repeat ',
				startT : 2,									//起点的top位置
				road : [{left:10},{top:4},{left:7},{top:4},{left:6}],	//路的路线
				turnP : [6,10,17,21,27],							//路拐点的位置index
				mousters : [{'M1' : 20}],
				endBlood : 5
			},
			{
				background : [20,13],						//关卡2
				mainBg : 'url(img/bgm2.jpg) no-repeat ',
				startT : 2,									
				road : [{left:3},{top:9},{left:5},{top:-9},{left:3},{top:9},{left:4},{top:-9},{left:3},{top:9},{left:2}],	//路的路线
				turnP : [2,11,16,25,28,37,41,50,55,62,64],							
				mousters : [{'M1' : 7,'M2' : 1},{'M2' : 4}],
				endBlood : 5
			},
			{
				background : [20,13],						//关卡3
				mainBg : 'url(img/bgm3.jpg) no-repeat ',
				startT : 2,									
				road : [{left:19},{top:10},{left:-17},{top:-6},{left:11},{top:2}],	//路的路线
				turnP : [18,28,45,51,62,64],							
				mousters : [{'M2' : 5},{'M3' : 6},{'M1' : 10,'M3' : 10}],
				endBlood : 5
			},
		];

var Ta = {
		name : ['ta1','ta2','ta3','ta4'],					//塔的名字
		spd : [400,600,300,300,300],						//塔的攻击频率
		atk : [1,2,1,1,1],									//塔的攻击力
		range : [2,4,4,5,3],	                                //塔的攻击范围
		money : [200,400,600,800,1000]
};

var Monster = {
		name : ['M1','M2','M3'],
		spd : [10,14,18],
		blood : [12,13,15],
		money :	[20,40,50]
}
var $main = $('#main');
var $creatM = $('input[value = "开始"]');
var iNowMap = 0;
var iNowMons = 0;
var waveNum = map[iNowMap].mousters.length;
$('#waves').children(['span']).html(waveNum - iNowMons);   //设置还有几波怪
$creatM.attr({'disabled' : false});              //让开始能被点击
creatMap(map[iNowMap].background[1],map[iNowMap].background[0]);			//设背景
loadRoad(map[iNowMap].startT,map[iNowMap].road);   //铺路
startLeave();
function startLeave(){     						
	$creatM.off().click(function(){						//点击开始出发添加怪，延时3秒。
		$creatM.attr({'disabled' : 'disabled'})	
		setTimeout(function(){	
			$.each(map[iNowMap].mousters[iNowMons],function(attr,val){
				addMonster(attr,val);
			})
			iNowMons++;
			wave();
		},3000)
	});
}
$(function(){		//DOMReady再添加函数											
$main.css({													//给main加宽高
	'width' : map[iNowMap].background[0]*$('.background').width(),
	'height' : map[iNowMap].background[1]*$('.background').width(),
	'background' : map[iNowMap].mainBg
});
	
});
function wave(){								//检测还有几波怪以及该关卡是否完成。
	var $waves = $('#waves');
	waveNum = map[iNowMap].mousters.length;
	
	$waves.timer = setInterval(function(){
		$('.Mymoney').html(+$('.Mymoney').html()+1);
		$waves.children(['span']).html(waveNum - iNowMons);
		if($('.monsters').length == 0 && iNowMons != 0){
			if(iNowMons >= map[iNowMap].mousters.length){
				$('#leaves').css('display','block');
				selectLeave();
				
				clearInterval($waves.timer);
				return;							
			}
			clearInterval($waves.timer);							
			$creatM.trigger('click');						
		}
	},500)	
}
		


function addMonster(name,num){					//添加monster
	var $mIndex = $.inArray(name,Monster.name);
	var iNow = 0;
	clearInterval($creatM.timer);
	for(var i=0;i<num;i++){
		setTimeout(function(){
			var $newM = $('<div class="monsters '+ name +'"></div>');
			$('#monsters').append($newM);
			var $sTop = $('.start').position().top;
			var $sLeft = $('.start').position().left;
			$.each(Monster,function(attr,val){
				$newM.attr(attr,val[$mIndex]);
			})
			$newM.css({
				'top' : $sTop,
				'left' : $sLeft
			});	
			$newM.attr({
				iNow : 0
			})
					
		},1400*iNow)
		iNow++;
	}
	monsterMove();    //monster动起来~
}

function monsterMove(){									//让monster动起来的函数~								
	$creatM.timer = setInterval(function(){
		$('.monsters').each(function(i, elem) {		
            move(elem);
        });	
	},120);	
	function move(obj){									//monster定时器每次调取的函数
		var obj = $(obj);					
		for(var attr in map[iNowMap].road[obj.attr('iNow')]){		
			for(var i=0;i<obj.attr('spd');i++){
				obj.css(attr,'+=' + map[iNowMap].road[obj.attr('iNow')][attr]/Math.abs(map[iNowMap].road[obj.attr('iNow')][attr]));
				if(obj.attr('iNow') == map[iNowMap].road.length - 1){						
					if(obj.position()[attr] == $('.end').position()[attr]){
						obj.remove();
						$('.end').attr('blood',$('.end').attr('blood')-1);
						if($('.end').attr('blood')==0){
							$('#gameOver').css('display','block');
							clearInterval($('#waves').timer);
							$creatM.off();
							gameOver();
						}
					}					
					continue;
				}				
				if(obj.position()[attr] == $('.road').eq(map[iNowMap].turnP[obj.attr('iNow')]).position()[attr]){																
					obj.attr('iNow',+obj.attr('iNow') + 1);
					break;
				}	
			}					
		}	
	}
}



function creatMap(x,y){                             //设定地图
	for(var i=0;i<x;i++){
		for(var j=0;j<y;j++){
			var $div = $('<div class="background"></div>');
			$('#main #background').append($div);
			$div.css('left',j*$('.background').width());
			$div.css('top',i*$('.background').width());		 
		}
	}
	$('.Mymoney').html('500');
	$('input[value *= "塔"]').each(function(i, elem) {
		$(this).attr('taType',Ta.name[i]);
		$(this).attr('range',Ta.range[i]);
        selectTa(elem,Ta.name[i]);
    });	
}

function selectTa(tInput,tClass){					//点击添加塔
	var $tInput = $(tInput);
	$tInput.attr('money',Ta.money[0]);
	var $Mymoney = $('.Mymoney');                   //玩家钱数
	$tInput.off().mousedown(function(ev){
		 if($Mymoney.html() < $tInput.attr('money')){
			 var $beizhu = $('#inputbeizhu');            //添加塔的备注
	         $beizhu.css('display','block')
	         $beizhu.css('top',$tInput.offset().top + $tInput.innerWidth());
	         $beizhu.css('left',$tInput.offset().left);
	         $beizhu.html($tInput.attr('money') + '金币才行');
		     return;
		}
		var $newTa = $('<div class="' + 'add' + tClass + '">');
		$('#main').append($newTa);
		var $T = ev.pageY - $('#main').offset().top - $newTa.height()/2;
		var $L = ev.pageX - $('#main').offset().left - $newTa.width()/2;
		$newTa.css({
			'top' : $T, 
			'left' : $L
			});
		$(document).mousemove(function(ev){
			var $TM = ev.pageY - $('#main').offset().top - $newTa.height()/2;
			var $LM = ev.pageX - $('#main').offset().left - $newTa.width()/2;
			$newTa.css({
				'top' : $TM, 
				'left' : $LM
			})
		});
		$(document).mouseup(function(ev){
			if(!pz($newTa,$('#main'))){
				$newTa.remove();
				$(this).off('mousemove');
			    $(this).off('mouseup');
				return;
			}				//松开后给该位置添加塔
			var $taIndex = $.inArray(tClass,Ta.name);
			var c = Math.floor((ev.pageY - $('#main').offset().top)/$('.background').width() );
			var d = Math.floor((ev.pageX - $('#main').offset().left)/$('.background').width() );
			var index = c*map[iNowMap].background[0]+d;	
			$('.background').eq(index).addClass(tClass);
			$.each(Ta,function(attr,val){
				$('.background').eq(index).attr(attr,val[$taIndex]);
			})
			var $Ta = $('.background').eq(index)
			taFair($Ta);			//	给塔添加攻击事件
			$newTa.remove();
			$Mymoney.html($Mymoney.html()-$tInput.attr('money'));
			$(this).off('mousemove');
			$(this).off('mouseup');
		});
		
	});
	
		
}



function taFair(obj){												//塔的攻击函数
	var $rTa = obj.width()/2 + obj.attr('range')*$('.background').width();	
	obj.timer = setInterval(function(){
		var $monsters = $('.monsters');	
		if($monsters.length > 0){
			 fire($monsters);
		}
		if($('.monsters').length == 0 && iNowMons >= map[iNowMap].mousters.length){
			clearInterval(obj.timer);
		}
	},obj.attr('spd'));	
	function fire(mons){
		var arr = [];
		var mons  =$(mons);
		var iNow = 0;
		var target = null;		
		mons.each(function(i,elem) {
			var elem = $(elem);
			var $monsT =Math.abs(obj.position().top -  elem.position().top);
			var $monsL =Math.abs(obj.position().left -  elem.position().left);
			var $rMons = Math.sqrt(Math.pow($monsT,2) + Math.pow($monsL,2));
            if($rMons < $rTa){
				arr.push(elem);
				target = arr[0];					
			}   
        });		
		if(arr.length > 0){											//子弹追踪效果
			var $bullet = $('<div class="bullet"></div>');
			var bulletT = obj.position().top +  (obj.width() - $bullet.height()) / 2;
			var bulletL = obj.position().left + (obj.width() - $bullet.width()) / 2;
			$main.append($bullet);
			$bullet.css({'top' : bulletT,'left' : bulletL});
			$bullet.timer = setInterval(function(){
				var $bulletT = $bullet.position().top;
				var $bulletL = $bullet.position().left;
				var $targetT = target.position().top;
				var $targetL = target.position().left;				
				if(target.position().top == 0){
					clearInterval($bullet.timer);
					$bullet.remove();					
				}
				if(pz($bullet,target)){					
					clearInterval($bullet.timer);
					$bullet.remove();
					target.attr('blood',mons.attr('blood') - obj.attr('atk'));
					mons.each(function(i,elem) {
						var elem = $(elem);
						if(elem.attr('blood') <= 0){
							elem.remove();
				   			var $Mymoney = $('.Mymoney');
				   			$Mymoney.html(+$Mymoney.html() + +elem.attr('money'));
						}					
					});
				}
				$bullet.stop().animate({'top' : $targetT,'left' : $targetL},400 - 20 * (++iNow));
			},20)	
		}		
	}
}

function reset(){									//重置地图
	var $leaves = $('#leaves');
	$leaves.css('display','none');
	$('#gameOver').css('display','none');
	iNowMons = 0;
	waveNum = map[iNowMap].mousters.length;
	$('#waves').children(['span']).html(waveNum - iNowMons);
	$creatM.attr({'disabled' : false});									
	$main.children().html('');
	startLeave();
	creatMap(map[iNowMap].background[1],map[iNowMap].background[0]);			
	loadRoad(map[iNowMap].startT,map[iNowMap].road); 
	$(function(){		//DOMReady再添加函数											
		$main.css({													//给main加宽高
		'width' : map[iNowMap].background[0]*$('.background').width(),
		'height' : map[iNowMap].background[1]*$('.background').width(),
		'background' : map[iNowMap].mainBg
		});
	});
}

function selectLeave(){								//进入下一关的选择	             
	var $return = $('#return');
	var $nextL = $('#nextLeave');
	$return.off().click(function(){		
		reset();		  
	});
	$nextL.off().click(function(){
		iNowMap++;
		reset();
	});
}

function gameOver(){						//游戏结束重新再来
	$('#resetLeave').off().click(function(){
		console.log(1)
		iNowMap = 0;
		reset();
	});
}



	
function loadRoad(TopS,data){								//设定路线
	var $main = $('#main #roads');
	var long = 0;
	for(var i=0;i<data.length;i++){						
		for(var attr in data[i]){			
			for(var j=0;j<Math.abs(data[i][attr]);j++){					
				var $newRoad = $('<div class="road"></div>');
				$main.append($newRoad);
				long = $('.road').width();
				if(attr == 'left'){	
					$newRoad.css({
						'left' : long * (data[i][attr]/Math.abs(data[i][attr])) + parseInt($newRoad.prev().css('left')),
						'top' : $newRoad.prev().css('top') || 0	
					});
				}
				else{
					$newRoad.css({
						'top' : long * (data[i][attr]/Math.abs(data[i][attr])) + parseInt($newRoad.prev().css('top')),
						'left' : $newRoad.prev().css('left') || 0
					});
				}				
			}			
		}		
	}
	$('.road').each(function(i, elem){
		$(this).css('top',$(this).position().top + TopS*long);
	});
	$('.road').last().addClass('end').attr('blood',map[iNowMap].endBlood);
	$('.road').first().addClass('start');
}	
	

function setRange(num,line,row){				//计算塔的位置范围
	num = (num-1)/2 + 1;
	var arr = [];														
	for(var i=1;i<num;i++){	
		var lineU = line - i;
		var lineD = line + i;
		var rowL = row - i;
		var rowR = row + i;
		var indexUp = lineU * map[iNowMap].background[0] + row;
		var indexDown = lineD * map[iNowMap].background[0] + row;
		var indexRight = line * map[iNowMap].background[0] + rowR;
		var indexLeft = line * map[iNowMap].background[0] + rowL;
		arr.push(indexUp);		
		arr.push(indexDown);
		arr.push(indexRight);
		arr.push(indexLeft);
		for(var j=1;j<num;j++){
			var rowL = row - j;
			var rowR = row + j;
			var indexUL = lineU * map[iNowMap].background[0] + rowL;
			var indexUR = lineU * map[iNowMap].background[0] + rowR;
			var indexDL = lineD * map[iNowMap].background[0] + rowL;
			var indexDR = lineD * map[iNowMap].background[0] + rowR;		
			arr.push(indexUL);
			arr.push(indexUR);
			arr.push(indexDL);
			arr.push(indexDR);
		}				
	}
	return arr;
}


})







function pz(a,b){										//碰撞检测
	var $aL = a.position().left;
	var $aR = a.position().left + a.width();
	var $aT = a.position().top;
	var $aB = a.position().top + a.height();
	var $bL = b.position().left;
	var $bR = b.position().left + b.width();
	var $bT = b.position().top;
	var $bB = b.position().top + b.height();
	if($aR <= $bL || $aL >= $bR || $aB <= $bT || $aT >= $bB){
		return false;
	}
	else{
		return true;
	}
}











	/*var arr = setRange($tInput.attr('range'),c,d);				//计算塔的范围
			for(var i=0;i<arr.length;i++){						//计算被塔的范围影响到的road		
				for(var j=0;j<$('.road').length;j++){					
					if(pz($('.background').eq(arr[i]),$('.road').eq(j))){
						$('.road').eq(j).addClass('type' + tClass);		//给影响到的road加class
						$.each(Ta,function(attr,val){
							$('.road').eq(j).attr(attr,val[$taIndex]);
						})
											
					}
				}
			}*/






