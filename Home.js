$(document).ready(function(){
	//跳转图片

	//轮播图big
	var i = 0; //轮播图片的index值
	var timer; //section1轮播图定时器

	//先显示第一张隐藏其他
	$('.pic_tab').eq(0).show().siblings('.pic_tab').hide();
	showTime();//开始轮播；
	//小圆点hover
	$('.doteq').hover(function(){
		i = $(this).index();
		//alert(i);
		show();
		clearInterval(timer);
	},function(){
		showTime();
	});

	$('.con1').click(function(){
		clearInterval(timer);
		if(i == 0){
			i = 4;
		}
		i--;
		show();
		showTime();
	});
	$('.con2').click(function(){
		clearInterval(timer);
		if(i == 3){
			i = -1;
		}
		i++;
		show();
		showTime();
	});

	function showTime(){
		timer = setInterval(function(){		
			i++;
			if(i == 4){
				i = 0;
			}
			show();
		}, 3000)
	}
	
	function show(){
		$('.pic_tab').eq(i).fadeIn(300).siblings('.pic_tab').fadeOut(300);

		$('.doteq').eq(i).addClass('doth').siblings('.doteq').removeClass('doth');
	}	


	//歌单精选图片hover放大效果
	$('.choice-top a').click(function(){console.log(0)});
	$('.choice-top a').hover(function(){
		var widthTo = '226px',heightTo = '226px',topTo = '-20px',leftTo = '-20px';		
		if(this.className == 'big'){
			widthTo = '462px';
			heightTo = '462px';
			topTo = '-40px';
			leftTo = '-40px';
		}
		var $img = $(this).find('img');
		//
		$img.animate({
			width:widthTo,
			height:heightTo,
			top:topTo,
			left:leftTo
		},10)
		},function(){
			var widthTo = '186px',heightTo = '186px',topTo = '0px',leftTo = '0px';		
			if(this.className == 'big'){
				widthTo = '382px';
				heightTo = '382px';
		}
		var $img = $(this).find('img');
		$img.animate({
			width:widthTo,
			height:heightTo,
			top:topTo,
			left:leftTo
		},10)
	})

	//轮播图 热门
	$('.control-cd-right').click(function(){
		var move_var = parseInt($('.container').css('left'));
		switch(move_var){
			case 0:
				move_var = -640;
				break;
			case -640:
				move_var = -1280;
				break;
			case -1280:
				$('.container').css('left','0px');
				move_var = -640;
				break;
			default:
				break;
		}
		if(!$('.container').is(':animated')){
			$('.container').animate({left:move_var+'px'},700);
		}		
	});
	$('.control-cd-left').click(function(){
		var move_var = parseInt($('.container').css('left'));
		switch(move_var){
			case 0:
				$('.container').css('left','-1280px');
				move_var = -640;
				break;
			case -640:
				move_var = 0;
				break;
			case -1280:
				move_var = -640;
				break;
			default:
				break;
		}
		if(!$('.container').is(':animated')){
			$('.container').animate({left:move_var+'px'},700);
		}		
	});

	//轮播图-旋转木马
	var lunBo3_timer;
	lunBo3AutoShow();
	$('.lunBo3-controler-left').click(function(){
		clearInterval(lunBo3_timer);
		for(var i = 0;i<5;i++){
			var $this = $('.lunBo3-pic').eq(i);
			var $this_index = parseInt($this.css('z-index'));
			
			if($this_index == 4){
				$this.css('z-index',6);
			}
			moveToRight($this,$this_index);	
		}
		lunBo3AutoShow();
	});

	$('.lunBo3-controler-right').click(function(){
		clearInterval(lunBo3_timer);
		for(var i = 0;i<5;i++){
			var $this = $('.lunBo3-pic').eq(i);
			var $this_index = parseInt($this.css('z-index'));
			
			if($this_index == 2){
				$this.css('z-index',7);
			}else if($this_index == 1){
				$this.css('z-index',6);
			}

			moveToLeft($this,$this_index);	
		}
		lunBo3AutoShow();
	});

	function lunBo3AutoShow(){
		lunBo3_timer = setInterval(function(){
			for(var i = 0;i<5;i++){
				var $this = $('.lunBo3-pic').eq(i);
				var $this_index = parseInt($this.css('z-index'));
				
				if($this_index == 2){
					$this.css('z-index',7);
				}else if($this_index == 1){
					$this.css('z-index',6);
				}

				moveToLeft($this,$this_index);	
			}
		},3000);
	}
	
	function moveToRight(Obj,index){
		var leftTo,topTo,widthTo,heightTo,indexTo;
		switch(index){
			case 1:
				widthTo = 330;
				heightTo = 144;
				leftTo = 100;
				topTo = 48;
				indexTo = 3;
				break;
			case 2:
				widthTo = 330;
				heightTo = 144;
				leftTo = 670;
				topTo = 48;
				indexTo = 1;
				break;
			case 3:
				widthTo = 440;
				heightTo = 192;
				leftTo = 160;
				topTo = 24;
				indexTo = 4;
				break;
			case 4:
				widthTo = 550;
				heightTo = 240;
				leftTo = 275;
				topTo = 0;
				indexTo = 5;
				break;
			case 5:
				widthTo = 440;
				heightTo = 192;
				leftTo = 500;
				topTo = 24;
				indexTo = 2;
				break;
			default:break;
		}
		if(!Obj.is(':animated')){
			
			Obj.animate({
				zIndex:indexTo,
				width:widthTo+'px',
				height:heightTo+'px',
				left:leftTo+'px',
				top:topTo+'px',	
				opacity:'1'					
			},500,"swing");
		}
	}
	function moveToLeft(Obj,index){
		var leftTo,topTo,widthTo,heightTo,indexTo;
		switch(index){
			case 1:
				widthTo = 440;
				heightTo = 192;
				leftTo = 500;
				topTo = 24;
				indexTo = 2;
				break;
			case 2:
				widthTo = 550;
				heightTo = 240;
				leftTo = 275;
				topTo = 0;
				indexTo = 5;
				break;
			case 3:
				widthTo = 330;
				heightTo = 144;
				leftTo = 670;
				topTo = 48;
				indexTo = 1;
				break;
			case 4:
				widthTo = 330;
				heightTo = 144;
				leftTo = 100;
				topTo = 48;
				indexTo = 3;
				break;
			case 5:
				widthTo = 440;
				heightTo = 192;
				leftTo = 160;
				topTo = 24;
				indexTo = 4;
				break;
			default:break;
		}
		if(!Obj.is(':animated')){
			
			Obj.animate({
				zIndex:indexTo,
				width:widthTo+'px',
				height:heightTo+'px',
				left:leftTo+'px',
				top:topTo+'px',	
				opacity:'1'					
			},500,"swing");
		}
	}
	
	
})