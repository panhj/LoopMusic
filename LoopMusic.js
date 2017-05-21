$(document).ready(function(){
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
		}, 1000)
	}
	
	function show(){
		$('.pic_tab').eq(i).fadeIn(300).siblings('.pic_tab').fadeOut(300);

		$('.doteq').eq(i).addClass('doth').siblings('.doteq').removeClass('doth');
	}	
})