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
			$(this).css('backgroundPosition','-65px -122px');
			list_ishide = true;
			player_ishide = true;
		}
		else{
			$('#player').animate({
			bottom:'0px'
			},300);
			player_ishide = false;
			$(this).css('backgroundPosition','-125px -121px');
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
		$played_bar:$('.played-bar'),
		//初始化数据
		init:function(){
			//加载的音乐数据
			//数组
			Player.data = [
				["蜚蜚 - 陈僖仪",44630988],
				["孤雏 - Aga",267837076],
				["樱花树下 - 张敬轩",907620],
				["落在胸口的星星 - 	郁可唯",907620],
				["来日方长 - 黄龄/薛之谦",541111287],
				["最初的记忆 - 徐佳莹",541615960],
				["FLIP - Veegee/LiCong 李聪",541545045],
				["桃花诺 - G.E.M.邓紫棋",541680641],
				["春风十里不如你 - 李健",540489526],
				["Tired - Alan Walker/Gavin James",541455871],
				["江湖晚 - 戴荃/周华健",540609176],
				["刚好遇见你 - 李玉刚",276867440],
				["成都 - 赵雷",274841326],
				["告白气球 - 周杰伦",266322598],
				["逆流成河 - 宇桐非",533308233],
				["一路上有你 - 张学友",620023],
			];
			//显示列表所有歌曲
			var allList = '';
			for(var i=0;i<Player.data.length;i++){
				allList += '<li index="' + i + '">' + (i+1) + "、" + Player.data[i][0] + '</li>';
			}
			//alert(allList);
			Player.$list.html(allList);  



		},

		


		//播放就绪
		ready:function(){

			//获取audio节点
			Player.audio = Player.$audio.get(0);


			//初始化第一首歌
			$('.play-btn').css('backgroundPosition','-126px -41px');
			autoBar();
			showCurrentTime();
			Player.isplay = true;

			//传入歌曲id返回当前的歌曲url；
			function setSongSrc(id){
				
				 $.ajax({
                 url: "http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.song.play&songid="+id,
                 dataType: "jsonp",
                 type:"Post",
                 jsonpCallback: "jsonpCallback",
                 success: function (data) {
	                     $.each(data, function (i, v) {
	                         if (i=="bitrate") {
	                            //alert(v.show_link);
	                            Player.audio.src = v.show_link;
	                            //alert(v.show_link);
	                            Player.audio.play();
	                         }
	                     });
	                 },error: function (responseText, textStatus, XMLHttpRequest) {
	                     console.log(textStatus);
	                 }
                 });
			}
			
			//点击搜索框播放；
			$('.search').click(function(){
				 var song_id;
				 var music_name = $("input[name='music-name']").val();
				 //alert(music_name);
				 $.ajax({
                 url: "http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.search.catalogSug&query="+music_name,
                 dataType: "jsonp",
                 type:"Post",
                 jsonpCallback: "jsonpCallback",
                 success: function (data) {
                 		//这里只获取第一个搜索结果的id数据
                 		song_id = data.song[0].songid;
                 		//alert(song_id);
	                     // $.each(data.song, function (i, v) {
	                     //        song_id = v.songid;
	                     //        alert(song_id);
	                     // });
	                     //更新播放列表第一个歌曲名和id；
	                     Player.data[0][0] = music_name;
	                     Player.data[0][1] = song_id;
	                     //加入到播放列表的第一个
	                     Player.currentIndex = -1;
	                     $list:$('.m-list-ol li').eq(0).html("1、"+music_name);
	            		 $('.play-btn').click();

	                 },error: function (responseText, textStatus, XMLHttpRequest) {
	                     console.log(textStatus);
	                     alert(error);
	                 }
                 });
			});	


			//播放
			$('.play-btn').click(function(){

				//取消注释后播放网络歌曲列表；
				
				if(!Player.isplay){

					Player.audio.play();
					//如果要播放网络歌曲列表的第一首请取消下面注释
					/*
					if(Player.currentIndex == -1){
						$('.m-list-ol li').eq(0).click();
					}
					*/
					Player.isplay = true;
					//暂停图片
					$(this).css('backgroundPosition','-126px -41px');
					showCurrentName(Player.currentIndex);
				}
				else{
					Player.audio.pause();
					$(this).css('backgroundPosition','-80px -41px');
					Player.isplay = false;
				}
			});

			//下一曲
			$('.next-btn').click(function(){
				clearInterval(Player.timer_bar);
				if(Player.currentIndex == -1||Player.currentIndex == (Player.data.length - 1)){
					Player.currentIndex = 0;
				}else{
					Player.currentIndex++;
				}
				setSongSrc(Player.data[Player.currentIndex][1]);
				//Player.audio.src = Player.path + Player.data[Player.currentIndex];
				//Player.audio.play();
				Player.isplay = true;
				autoBar();
				$('.play-btn').css('backgroundPosition','-126px -41px');
				showCurrentName(Player.currentIndex);				
			});

			//上一曲
			$('.pre-btn').click(function(){
				clearInterval(Player.timer_bar);
				if(Player.currentIndex == -1){
					Player.currentIndex = 0;
				}else if(Player.currentIndex == 0){
					Player.currentIndex = (Player.data.length - 1);
				}else{
					Player.currentIndex--;
				}
				setSongSrc(Player.data[Player.currentIndex][1]);
				//Player.audio.src = Player.path + Player.data[Player.currentIndex];
				//Player.audio.play();
				Player.isplay = true;	
				showCurrentName(Player.currentIndex);
				$('.play-btn').css('backgroundPosition','-126px -41px');
				autoBar();
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
						$(this).css('backgroundPosition','-40px -81px')
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
						$(this).css('backgroundPosition','0px -81px')
						Player.play_fun = 3;//下次为顺序
						break;

					//点一下为顺序
					case 3:
						Player.audio.onended = function(){
							$('.next-btn').click();
						}
						$(this).css('backgroundPosition','-80px -81px')
						Player.play_fun = 1;//下次点为单曲
						break;
					//点一下为随机
					default:break;

				}
			});

			//点击列表来播放歌曲
			$('.m-list-ol li').click(function(){
				clearInterval(Player.timer_bar);
				
				var i = $(this).attr('index');
				setSongSrc(Player.data[i][1]);
				//Player.audio.src = Player.path + Player.data[i];
				//Player.audio.play();	
				Player.isplay = true;
				Player.currentIndex = i;
				//alert(Player.data[Player.currentIndex]);
				showCurrentName(Player.currentIndex);
				showCurrentTime();
				$('.play-btn').css('backgroundPosition','-126px -41px');	
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
					//console.log(current_time_bar);
				}
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
						Player.$played_bar.css('width',width_to+'px');
					},1000);
					
				};
			}
			
			//显示当前播放的歌曲名
			function showCurrentName(i){
				Player.$current_name.html(Player.data[i][0]);
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

			//点击静音
			$('.muted').click(function(){
				if(Player.audio.muted == false){
					Player.audio.muted = true;
					$(this).css('backgroundPosition','-155px -81px');
				}else{
					Player.audio.muted = false;
					$(this).css('backgroundPosition','-120px -81px');
				}
			});
			//点击音量条调节音量
			//Player.audio.volume = 0.7;
			$('.vol').click(function(event){
				var width_click = event.pageX - $(this).offset().left -25;
				
				if(width_click>0){
					var volume_to = parseFloat(width_click/100); 
					console.log(width_click);
					Player.audio.volume = volume_to;
					$('.voled').css('width',width_click+'px');
				}
			});
		}

	};

	Player.init();
	Player.ready();
})