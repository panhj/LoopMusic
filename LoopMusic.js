$(document).ready(function(){
	//跳转iframe
	//alert(1);
	$('#MyMusic').click(function(event){
		event.stopPropagation();
		event.preventDefault(); 
		$('#iframe').attr('src','MyMusic.html');
	});

	//显示/隐藏底部播放器
	var player_ishide = false;
	var list_ishide = true;
	$(".tab-player").click(function(){
		if(!player_ishide){
			//隐藏div
			$('#player').animate({
			bottom:'-50px'
			},300);
			$('.m-list-ol').slideUp('fast');
			list_ishide = true;
			player_ishide = true;
		}
		else{
			$('#player').animate({
			bottom:'0px'
			},300);
			player_ishide = false;
		}
	});

	$('.play-list').click(function(){
		if(list_ishide){
			//显示列表
			$('.m-list-ol').slideDown('fast');
			list_ishide = false;
		}
		else{
			$('.m-list-ol').slideUp('fast');
			list_ishide = true;
		}
	});
	//控制底部播放器

	var Player = {

		path:'music/',
		data:null,
		currentIndex:-1,
		$audio:$('#audio'),
		$list:$('.m-list-ol'),
		$current_name:$('.m-name'),
		$time:$('.time'),
		timer:null,
		//播放状态标识
		isplay:false,
		play_fun:1,
		//初始化数据
		init:function(){
			//加载的音乐数据
			Player.data = ['Dogena - Happy.mp3',
			];
			//显示列表所有歌曲
			var allList = '';
			for(var i=0;i<Player.data.length;i++){
				allList += '<li index="' + i + '">' + Player.data[i] + '</li>';
			}
			//alert(allList);
			Player.$list.html(allList);  
		},


		//播放就绪
		ready:function(){

			//获取audio节点
			Player.audio = Player.$audio.get(0);

			//播放
			$('.play-btn').click(function(){
				if(!Player.isplay){
					Player.audio.play();
					if(Player.currentIndex == -1){
						$('.next-btn').click();
					}
					Player.isplay = true;
					showCurrentName(Player.currentIndex);
				}
				else{
					Player.audio.pause();
					Player.isplay = false;
				}
			});

			//下一曲
			$('.next-btn').click(function(){
				if(Player.currentIndex == -1||Player.currentIndex == (Player.data.length - 1)){
					Player.currentIndex = 0;
				}else{
					Player.currentIndex++;
				}
				Player.audio.src = Player.path + Player.data[Player.currentIndex];
				Player.audio.play();
				Player.isplay = true;
				//
				showCurrentName(Player.currentIndex);				
			});

			//上一曲
			$('.pre-btn').click(function(){
				if(Player.currentIndex == -1){
					Player.currentIndex = 0;
				}else if(Player.currentIndex == 0){
					Player.currentIndex = (Player.data.length - 1);
				}else{
					Player.currentIndex--;
				}
				Player.audio.src = Player.path + Player.data[Player.currentIndex];
				Player.audio.play();
				Player.isplay = true;	
				showCurrentName(Player.currentIndex);
			});

			//顺序/单曲/随机播放
			$('.play-fun').click(function(){
				switch(Player.play_fun){
					//点一下变为单曲				
					case 1:
						Player.audio.onended = function(){
							Player.audio.load();
							Player.audio.play();
						};
						//换为单曲图片
						Player.play_fun = 2;//下次点为随机
						break;

					//点一下为随机
					case 2:
						Player.audio.onended = function(){
							Player.currentIndex = parseInt((Player.data.length - 1) * Math.random());
							Player.audio.src = Player.path + Player.data[Player.currentIndex];
							Player.audio.play();
						}
						//换为随机图片
						Player.play_fun = 3;//下次为顺序
						break;

					//点一下为顺序
					case 3:
						Player.audio.onended = function(){
							$('.next-btn').click();
						}
						Player.play_fun = 1;//下次点为单曲
						break;
					//点一下为随机
					default:break;

				}
			});

			//点击列表来播放歌曲
			$('.m-list-ol li').click(function(){
				var i = $(this).attr('index');
				Player.audio.src = Player.path + Player.data[i];
				Player.audio.play();
				Player.isplay = true;
				Player.currentIndex = i;
				//alert(Player.data[Player.currentIndex]);
				showCurrentName(Player.currentIndex);
				showCurrentTime();
				
			});

			//显示当前播放的歌曲名
			function showCurrentName(i){
				Player.$current_name.html(Player.data[i]);
			}
			//显示当前播放时间
			function showCurrentTime(){
				timer = setInterval(function(){
					var second = parseInt(Player.audio.currentTime);
					var m_currentTime = formatSeconds(second);
					Player.$time.html(m_currentTime);
				},1000)
			}
			

			function formatSeconds(second){
		    var mint = 0;// 分
		    if(second < 10){
		    	var result = "00:0"+second;
		    }else if(second>9&&second<60){
		    	result = "00:"+second;
		    }
		    else if(second > 60&&second<599) {
		        mint = parseInt(second/60);
		        second = parseInt(second%60);
		        var result = "0"+mint+":"+second+"秒";
		    }
		        
		        if(mint > 0) {
		        result = ""+parseInt(mint)+"分"+result;
		        }
		        
		    return result;
}
		}

	};

	Player.init();
	Player.ready();
})