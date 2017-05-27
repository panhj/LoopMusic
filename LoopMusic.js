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
		timer:null,//时间定时器
		timer_bar:null,//进度条定时器
		//播放状态标识
		isplay:false,
		play_fun:1,
		//初始化数据
		init:function(){
			//加载的音乐数据
			Player.data = ['Dogena - Happy.mp3',
			'山崎まさよし - One more time, One more chance.mp3'
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
				if(Player.timer_bar){
					clearInterval(Player.timer_bar);
				}
				
				var i = $(this).attr('index');
				Player.audio.src = Player.path + Player.data[i];
				
				Player.audio.play();	
				Player.isplay = true;
				Player.currentIndex = i;
				//alert(Player.data[Player.currentIndex]);
				showCurrentName(Player.currentIndex);
				showCurrentTime();

				autoBar();				
			});

			//点击进度条
			$('.play-bar').click(function(event){
				clearInterval(Player.timer_bar);
				var width_click = event.pageX - $(this).offset().left;
				if(width_click>=0){
					var width_to_bar = parseInt(width_click);
					$('.played-bar').css('width',width_to_bar+'px');
					var totalTime_bar = parseInt(Player.audio.duration);
					//console.log(totalTime_bar);
					var percent_bar = width_to_bar/550;
					var current_time_bar = parseInt(totalTime_bar*percent_bar);
					Player.audio.currentTime = current_time_bar;
					console.log(current_time_bar);
				}
				autoBar();
			});


			//设置播放进度条长度
			function autoBar(){
				Player.audio.oncanplay = function(){

					var current_time;
					var totalTime = parseInt(Player.audio.duration);
					
					Player.timer_bar = setInterval(function(){
						var current_time = parseInt(Player.audio.currentTime);
						var percent = current_time/totalTime;
						var width_to = parseInt(550*percent);
						console.log(current_time);
						$('.played-bar').css('width',width_to+'px');
					},1000);
				};
			}
			
			//显示当前播放的歌曲名
			function showCurrentName(i){
				Player.$current_name.html(Player.data[i]);
			}
			//显示当前播放时间
			function showCurrentTime(){
				Player.timer = setInterval(function(){
					var second = parseInt(Player.audio.currentTime);
					var m_currentTime = formatSeconds(second);
					var m_totalTime = totalTime();
					Player.$time.html(m_currentTime + "/" + m_totalTime);
				},1000)
			}
			//音频总时间
			function totalTime(){
				var second = parseInt(Player.audio.duration);

				var m_totalTime = formatSeconds(second);
				return m_totalTime;
			}
			
 			//将秒转换成00：00格式
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
			        if(second<10){
			        	var result = "0"+mint+":0"+second;
			        }else{
			        	var result = "0"+mint+":"+second;
			        }
			    }
			    else{
			    	mint = parseInt(second/60);
			        second = parseInt(second%60);
			        if(second<10){
			        	var result = mint+":0"+second;
			        }else{
			        	var result = mint+":"+second;
			        }
			    }
			    return result;
			}
		}

	};

	Player.init();
	Player.ready();
})