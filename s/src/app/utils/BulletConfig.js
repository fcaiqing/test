/**
 * Created by beyondray on 2015/8/15.
 * Desc: 动画与粒子配置
 */

var BULLET_CONFIG = {
// 地图动画部分
	// 开始动画
	star_effect : {
		start : {
			res : "res/animate/star_effect.plist" ,
			fps : 21,
			frameIDs : 21,
			loop : 0, // 1:循环 ,0:一次
			name : "star_effect",
			zorder : 10,
			offset : cc.p(31,11)
		}
	},
	top_star : {
		start : {
		res : "res/animate/star_effect.plist" ,
		fps : 24,
		frameIDs : 11,
		loop : 0, // 1:循环 ,0:一次
		name : "top_star",
		zorder : 10
		}
	},
	ditupiaoxue: {
		start: {
			particle: true,
			res: "res/particles/ditupiaoxue.plist",
			loop: 1, // 1:循环 ,0:一次
			name: "ditupiaoxue",
			zorder: 10, // indeffect :2 时这里可以控制在自身图的上面还是下面 上：1，下：-1
			offset: cc.p(600, 500)
		}
	},
	storehouse: {
		start: {
			res: "res/animate/scene3_4.plist",
			fps: 15,
			frameIDs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
			loop: 1, // 1:循环 ,0:一次
			name: "storehouse",
			zorder: 10

		}
	},
	cetaceanEye: {
		start: {
			res: "res/animate/scene3_4.plist",
			fps: 15,
			frameIDs: 50,
			loop: 1, // 1:循环 ,0:一次
			name: "cetaceanEye",
			zorder: 10

		}
	},
	reptile: {
		start: {
			res: "res/animate/scene3_4.plist",
			fps: 20,
			frameIDs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24],
			loop: 1, // 1:循环 ,0:一次
			name: "reptile",
			zorder: 10

		}
	},
	reptile2: {
		start: {
			res: "res/animate/scene3_4.plist",
			fps: 20,
			frameIDs: 131,
			loop: 1, // 1:循环 ,0:一次
			name: "reptile2",
			zorder: 10

		}
	},
	fish: {
		start: {
			res: "res/animate/scene3_4.plist",
			fps: 15,
			frameIDs: 26,
			loop: 1, // 1:循环 ,0:一次
			name: "fish2",
			zorder: 10

		}
	},
	spray: {
		start: {
			res: "res/animate/scene3_4.plist",
			fps: 15,
			frameIDs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
			loop: 1, // 1:循环 ,0:一次
			name: "spray",
			zorder: 10

		}
	},
	eye: {
		start: {
			res: "res/animate/scene3_4.plist",
			fps: 20,
			frameIDs: 110,
			loop: 1, // 1:循环 ,0:一次
			name: "eye",
			zorder: 10

		}
	},
	cat: {
		start: {
			res: "res/animate/scene3_4.plist",
			fps: 15,
			frameIDs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43],
			loop: 1, // 1:循环 ,0:一次
			name: "cat",
			zorder: 10

		}
	},
	winnower: {
		start: {
			res: "res/animate/scene3_4.plist",
			fps: 20,
			frameIDs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
			loop: 1, // 1:循环 ,0:一次
			name: "winnower",
			zorder: 10

		}
	},
	panda: {
		start: {
			res: "res/animate/scene3_4.plist",
			fps: 20,
			frameIDs: 252,
			loop: 1, // 1:循环 ,0:一次
			name: "panda",
			zorder: 10

		}
	},
	ripple: {
		start: {
			res: "res/animate/scene3_4.plist",
			fps: 20,
			frameIDs: 43,
			loop: 1, // 1:循环 ,0:一次
			name: "ripple",
			zorder: 10

		}
	},
	ripple3: {
		start: {
			res: "res/animate/scene3_4.plist",
			fps: 20,
			frameIDs: 36,
			loop: 1, // 1:循环 ,0:一次
			name: "ripple3",
			zorder: 10

		}
	},
	sirup: {
		start: {
			res: "res/animate/scene3_4.plist",
			fps: 12,
			frameIDs: 11,
			loop: 1, // 1:循环 ,0:一次
			name: "sirup",
			zorder: 10
		}
	},

	rabbit: {
		start: {
			res: "res/animate/scene3_4.plist",
			fps: 20,
			frameIDs: 30,
			loop: 1, // 1:循环 ,0:一次
			name: "rabbit",
			zorder: 10

		}
	},
	squirrel: {
		start: {
			res: "res/animate/scene3_4.plist",
			fps: 20,
			frameIDs: 80,
			loop: 1, // 1:循环 ,0:一次
			name: "squirrel",
			zorder: 10

		}
	},
	tail3: {
		start: {
			res: "res/animate/scene3_4.plist",
			fps: 20,
			frameIDs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
			loop: 1, // 1:循环 ,0:一次
			name: "tail3",
			zorder: 10

		}
	},
	light: {
		start: {
			res: "res/animate/scene3_4.plist",
			fps: 20,
			frameIDs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
			loop: 1, // 1:循环 ,0:一次
			name: "light",
			zorder: 10

		}
	},
	light2: {
		start: {
			res: "res/animate/scene3_4.plist",
			fps: 30,
			frameIDs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22],
			loop: 1, // 1:循环 ,0:一次
			name: "light2",
			zorder: 10

		}
	},
	firebug: {
		start: {
			res: "res/animate/scene3_4.plist",
			fps: 10,
			frameIDs: 9,
			loop: 1, // 1:循环 ,0:一次
			name: "firebug",
			zorder: 10

		}
	},
	spoondrift: {
		start: {
			res: "res/animate/scene3_4.plist",
			fps: 20,
			frameIDs: 33,
			loop: 1, // 1:循环 ,0:一次
			name: "spoondrift",
			zorder: 10
		}
	},
	light_2: {
		start: {
			res: "res/animate/scene3_4.plist",
			fps: 20,
			frameIDs: 30,
			loop: 1, // 1:循环 ,0:一次
			name: "light_2",
			zorder: 10

		}
	},
	volcano: {
		start: {
			res: "res/animate/scene3_4.plist",
			fps: 15,
			frameIDs: 24,
			loop: 1, // 1:循环 ,0:一次
			name: "volcano",
			zorder: 10

		}
	},
	ripple4: {
		start: {
			res: "res/animate/scene3_4.plist",
			fps: 20,
			frameIDs: 52,
			loop: 1, // 1:循环 ,0:一次
			name: "ripple4",
			zorder: 10

		}
	},
	cacti: {
		start: {
			res: "res/animate/scene3_4.plist",
			fps: 20,
			frameIDs: 55,
			loop: 1, // 1:循环 ,0:一次
			name: "cacti",
			zorder: 10

		}
	},
	bird: {
		start: {
			res: "res/animate/scene3_4.plist",
			fps: 20,
			frameIDs: 40,
			loop: 1, // 1:循环 ,0:一次
			name: "bird",
			zorder: 10

		}
	},
	etelight: {
		start: {
			res: "res/animate/scene3_4.plist",
			fps: 20,
			frameIDs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
			loop: 1, // 1:循环 ,0:一次
			name: "etelight",
			zorder: 10

		}
	},
	//缸舌头动画
	crock1: {
		start: {
			res: "res/animate/crock.plist",
			fps: 30,
			frameIDs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
			loop: 0, // 1:循环 ,0:一次
			name: "crock",
			zorder: 10
		}
	},
	crock2: {
		start: {
			res: "res/animate/crock.plist",
			fps: 30,
			frameIDs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
			loop: 0, // 1:循环 ,0:一次
			name: "crock2",
			zorder: 10
		}
	},
	crock3: {
		start: {
			res: "res/animate/crock.plist",
			fps: 30,
			frameIDs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
			loop: 0, // 1:循环 ,0:一次
			name: "crock3",
			zorder: 10
		}
	},
	eye1: {
		start: {
			res: "res/animate/eye.plist",
			fps: 30,
			frameIDs: 76,
			loop: 0, // 1:循环 ,0:一次
			name: "eye1",
			zorder: 10
		}
	},
	eye2: {
		start: {
			res: "res/animate/eye.plist",
			fps: 30,
			frameIDs: 75,
			loop: 0, // 1:循环 ,0:一次
			name: "eye2",
			zorder: 10
		}
	},
	eye3: {
		start: {
			res: "res/animate/eye.plist",
			fps: 30,
			frameIDs: 65,
			loop: 0, // 1:循环 ,0:一次
			name: "eye3",
			zorder: 10
		}
	},
	eye4: {
		start: {
			res: "res/animate/eye.plist",
			fps: 30,
			frameIDs: 100,
			loop: 0, // 1:循环 ,0:一次
			name: "eye4",
			zorder: 10
		}
	},
	eye5: {
		start: {
			res: "res/animate/eye.plist",
			fps: 30,
			frameIDs: 55,
			loop: 0, // 1:循环 ,0:一次
			name: "eye5",
			zorder: 10
		}
	},
////////////////////////////////////////////
	// 被冰球碰到的泡泡消失动画
	item_1_progress: {
// 阶段：start,progress,over,hit
		over: {
			res: "res/animate/item_1_progress.plist",
			fps: 24,
			frameIDs: 36,
			loop: 0, // 1:循环 ,0:一次
			name: "item_1_progress",
			zorder: 10
		}

	},
// 粒子效果
	itemId_1: {
// 阶段：start,progress,over,hit
		start: {
			particle: true,
			res: "res/particles/bingqiudaiji.plist",
			music: 0,
			loop: 1, // 1:循环 ,0:一次
			name: "bingqiudaiji",
			zorder: -1, // indeffect :2 时这里可以控制在自身图的上面还是下面 上：1，下：-1
			ineffect: 2, // 1:动画在特效层， 0:在自身层（道具） 2:自身的effect 上不替换原先自己的球图
			offset: cc.p(0, 0)

		},

		progress: {
			particle: true,
			res: "res/particles/bingqiudaiji.plist",
			music: 0,
			loop: 1, // 1:循环 ,0:一次
			name: "bingqiudaiji",
			zorder: 10,
			// angle : 1,  // 1:角度要实时变化，0：角度不变
			ineffect: 2 // 1:动画在特效层， 0:在自身层（道具）
// offset : cc.p(-60,-60),
		},

		over: {
			particle: true,
			res: "res/particles/bingqiuxiaoshi.plist",
			music: MUSIC_CONFIG.iceItemEnd,
			loop: 1, // 1:循环 ,0:一次
			name: "bingqiuxiaoshi",
			zorder: 10,
			ineffect: 0 // 1:动画在特效层， 0:在自身层（道具）
// offset : cc.p(0,-30),
		}
// over : {
// 	res : "res/animate/item_1.plist" ,
		// 	music : MUSIC_CONFIG.iceItemEnd,
		// 	fps : 20,
		// 	frameIDs : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36],
		// 	loop : 0, // 1:循环 ,0:一次
// 	name : "item_1",
		// 	zorder : 10,
		// 	ineffect : 0, // 1:动画在特效层， 0:在自身层（道具）
// 	offset : cc.p(0,-30),
		// },
	},
// itemId_1 : {
// 		// 阶段：start,progress,over,hit
// 		start : {
// 			res : "res/animate/item_1.plist" ,
	// 			music : 0,
	// 			fps : 20,
	// 			frameIDs : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],
	// 			loop : 1, // 1:循环 ,0:一次
// 			name : "item_1",
	// 			zorder : 10, // indeffect :2 时这里可以控制在自身图的上面还是下面 上：1，下：-1
// 			ineffect : 0, // 1:动画在特效层， 0:在自身层（道具） 2:自身的effect 上不替换原先自己的球图
// 			offset : cc.p(-60,-60),

	// 		},

// 		progress : {
// 			res : "res/animate/item_1.plist" ,
	// 			music : 0,
	// 			fps : 20,
	// 			frameIDs : [63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88],
	// 			loop : 1, // 1:循环 ,0:一次
// 			name : "item_1",
	// 			zorder : 10,
	// 			angle : 1,  // 1:角度要实时变化，0：角度不变
// 			ineffect : 0, // 1:动画在特效层， 0:在自身层（道具）
// 			// offset : cc.p(-60,-60),
	// 		},

// 		over : {
// 			res : "res/animate/item_1.plist" ,
	// 			music : MUSIC_CONFIG.iceItemEnd,
	// 			fps : 20,
	// 			frameIDs : [27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62],
	// 			loop : 0, // 1:循环 ,0:一次
// 			name : "item_1",
	// 			zorder : 10,
	// 			ineffect : 0, // 1:动画在特效层， 0:在自身层（道具）
// 			// offset : cc.p(-60,-60),
	// 		},
// 		},
// magic
	itemId_3: {
// 阶段：start,progress,over,hit
		start: {
			res: "res/animate/item_3.plist",
			music: 0,
			fps: 20,
			frameIDs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
			loop: 1, // 1:循环 ,0:一次
			name: "item_3",
			zorder: 10,
			ineffect: 0 // 1:动画在特效层， 0:在自身层（道具） 2:自身的effect 上不替换原先自己的球图

		},

		over: {
			res: "res/animate/item_3.plist",
// music : MUSIC_CONFIG.iceItemEnd,
			fps: 20,
			frameIDs: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62],
			loop: 0, // 1:循环 ,0:一次
			name: "item_3",
			zorder: 10,
			ineffect: 0 // 1:动画在特效层， 0:在自身层（道具）
		}

	},
// iceCream
	itemId_5: {
// 阶段：start,progress,over,hit
		start: {
			particle: true,
			res: "res/particles/bingqilingdaiji.plist",
			music: 0,
			loop: 1, // 1:循环 ,0:一次
			name: "bingqiling daiji",
			zorder: -1, // indeffect :2 时这里可以控制在自身图的上面还是下面 上：1，下：-1
			ineffect: 2, // 1:动画在特效层， 0:在自身层（道具） 2:自身的effect 上不替换原先自己的球图
			offset: cc.p(0, 0)

		},

		over: {
			res: "res/animate/item_5.plist",
// music : MUSIC_CONFIG.iceItemEnd,
			fps: 20,
			frameIDs: [28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
			loop: 0, // 1:循环 ,0:一次
			name: "item_5",
			zorder: 10,
			ineffect: 0 // 1:动画在特效层， 0:在自身层（道具）
		}


	},
// 被冰淇淋击中的普通球消失效果
	itemId_5_normal: {
// 阶段：start,progress,over,hit
		over: {
			res: "res/animate/item_5.plist",
// music : MUSIC_CONFIG.iceItemEnd,
			fps: 20,
			frameIDs: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
			loop: 0, // 1:循环 ,0:一次
			name: "item_5",
			zorder: 10,
			ineffect: 2 // 1:动画在特效层， 0:在自身层（道具）
		}

	},
// rainbow
	itemId_4: {
// 阶段：start,progress,over,hit
// start : {
// 	res : "res/animate/item4.plist" ,
		// 	music : 0,
		// 	fps : 20,
		// 	frameIDs : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34],
		// 	loop : 1, // 1:循环 ,0:一次
// 	name : "item_4",
		// 	zorder : 10,
		// 	ineffect : 0, // 1:动画在特效层， 0:在自身层（道具） 2:自身的effect 上不替换原先自己的球图

// },

// over : {
// 	res : "res/animate/item4.plist" ,
		// 	// music : MUSIC_CONFIG.iceItemEnd,
		// 	fps : 20,
		// 	frameIDs : [35,36,37,38,39,40],
		// 	loop : 0, // 1:循环 ,0:一次
// 	name : "item_4",
		// 	zorder : 10,
		// 	ineffect : 0, // 1:动画在特效层， 0:在自身层（道具）
// },

// 粒子
		start: {
			particle: true,
			res: "res/particles/caihongdaiji.plist",
			music: MUSIC_CONFIG.iceItemEnd,
			loop: 1, // 1:循环 ,0:一次
			name: "caihongdaiji",
			zorder: -1, // indeffect :2 时这里可以控制在自身图的上面还是下面 上：1，下：-1
			ineffect: 2, // 1:动画在特效层， 0:在自身层（道具） 2:自身的effect 上不替换原先自己的球图
			offset: cc.p(0, 0)
		},
		over: {
			particle: true,
			res: "res/particles/caihongxiaoshi.plist",
			music: MUSIC_CONFIG.iceItemEnd,
			loop: 1, // 1:循环 ,0:一次
			name: "caihongxiaoshi",
			zorder: -1, // indeffect :2 时这里可以控制在自身图的上面还是下面 上：1，下：-1
			ineffect: 2 // 1:动画在特效层， 0:在自身层（道具）
// offset : cc.p(0,-30),
		}

	},
	// flash
	type_2: {
		// 阶段：start,progress,over,hit
		start: {
			res: "res/animate/flash_bubble.plist",
			// music : MUSIC_CONFIG.iceItemEnd,
			fps: 20,
			frameIDs: 16,
			loop: 1, // 1:循环 ,0:一次
			name: "flash_bubble",
			zorder: 10,
			ineffect: 2,
			offset: cc.p(-25, -3)
		},
		// 闪电这个阶段表示触发阶段
		progress: {
			res: "res/animate/flash_bubble.plist",
			// music : MUSIC_CONFIG.iceItemEnd,
			fps: 24,
			frameIDs: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
			loop: 0, // 1:循环 ,0:一次
			name: "flash_bubble",
			zorder: 10,
			ineffect: 0
		},
		over: {
			res: "res/animate/flash_bubble.plist",
			// music : MUSIC_CONFIG.iceItemEnd,
			fps: 20,
			frameIDs: [1],
			loop: 0, // 1:循环 ,0:一次
			name: "flash_bubble",
			zorder: 10,
			ineffect: 0,
			offset: cc.p(-25, -3)
		}
	},

	// normal
	type_0: {
		over: {
			res: "res/animate/normal_clear_effect.plist",
			//music : MUSIC_CONFIG.iceItemEnd,
			fps: 30,
			frameIDs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			loop: 0, // 1:循环 ,0:一次
			name: "normal_clear_effect",
			zorder: 10,
			ineffect: 0
		}

	},
// fog
	type_3: {
// 阶段：start,progress,over,hit（被碰到）
		hit: {
			res: "res/animate/fog_bubble.plist",
// music : MUSIC_CONFIG.iceItemEnd,
			fps: 50,
			frameIDs: 12,
			loop: 0, // 1:循环 ,0:一次
			name: "fog",
			zorder: 10,
			ineffect: 2, // 1:动画在特效层， 0:在自身层（道具）
			offset: cc.p(0, -8)
		},

		over: {
			res: "res/animate/normal_clear_effect.plist",
// music : MUSIC_CONFIG.iceItemEnd,
			fps: 20,
			frameIDs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			loop: 0, // 1:循环 ,0:一次
			name: "normal_clear_effect",
			zorder: 10,
			ineffect: 0
		}

	},
	// boom
	type_4: {
		// 阶段：start,progress,over,hit（被碰到）
		 start: null,//{
		// 	particle: true,
		// 	particlePositionType: cc.POSITION_TYPE_FREE,
		// 	res: "res/particles/zhadanhuoyan.plist",
		// 	//music: MUSIC_CONFIG.iceItemEnd,
		// 	loop: 1, // 1:循环 ,0:一次
		// 	name: "zhadanhuoyan",
		// 	zorder: -1, // indeffect :2 时这里可以控制在自身图的上面还是下面 上：1，下：-1
		// 	ineffect: 2, // 1:动画在特效层， 0:在自身层（道具） 2:自身的effect 上不替换原先自己的球图
		// 	offset: cc.p(-15, 40)

		// },
		over: {
			res: "res/animate/boom_bubble.plist",
			// music : MUSIC_CONFIG.iceItemEnd,
			fps: 30,
			frameIDs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
			loop: 0, // 1:循环 ,0:一次
			name: "boom_bubble",
			zorder: 10,
			ineffect: 0, // 1:动画在特效层， 0:在自身层（道具）
			offset: cc.p(0, 0)
		}
	},
// saveAlpha
	type_9_1: {
// 阶段：start,progress,over,hit
		start: {
			res: "res/animate/save_hold1.plist",
// music : MUSIC_CONFIG.iceItemEnd,
			fps: 10,
			frameIDs: [1, 2, 3, 4, 5, 5, 5, 5, 5, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
			loop: 1, // 1:循环 ,0:一次
			name: "save_hold1",
			zorder: -1,
			ineffect: 2,
			offset: cc.p(0, 0)
		}

	},
	type_9_3: {
// 阶段：start,progress,over,hit
		start: {
			res: "res/animate/save_hold3.plist",
// music : MUSIC_CONFIG.iceItemEnd,
			fps: 10,
			frameIDs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
			loop: 1, // 1:循环 ,0:一次
			name: "save_hold3",
			zorder: -1,
			ineffect: 2,
			offset: cc.p(5, -30)
		}

	},
	type_9_6: {
// 阶段：start,progress,over,hit
		start: {
			res: "res/animate/save_hold6.plist",
// music : MUSIC_CONFIG.iceItemEnd,
			fps: 10,
			frameIDs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 11, 11, 11, 11, 11, 11],
			loop: 1, // 1:循环 ,0:一次
			name: "save_hold6",
			zorder: 10,
			ineffect: 2,
			offset: cc.p(0, 0)
		}

	},

// color
	type_5: {
// 阶段：start,progress,over,hit
// start : {
// 	res : "res/animate/color_bubble.plist" ,
		// 	// music : MUSIC_CONFIG.iceItemEnd,
		// 	fps : 10,
		// 	frameIDs : [1,2,3,4,5,6,7,8,9,10,11],
		// 	loop : 1, // 1:循环 ,0:一次
// 	name : "color_bubble",
		// 	zorder : 10,
		// 	ineffect : 2,
		// 	offset : cc.p(5,1),
		// },

		over: {
			res: "res/animate/normal_clear_effect.plist",
// music : MUSIC_CONFIG.iceItemEnd,
			fps: 20,
			frameIDs: [1, 2, 3, 4, 5, 6],
			loop: 0, // 1:循环 ,0:一次
			name: "normal_clear_effect",
			zorder: 10,
			ineffect: 0
		}

	},
// alpha
	type_7: {
// 阶段：start,progress,over,hit
		start: {
			res: "res/animate/type_7.plist",
// music : MUSIC_CONFIG.iceItemEnd,
			fps: 12,
			frameIDs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
			loop: 1, // 1:循环 ,0:一次
			name: "type_7",
			zorder: 10,
			ineffect: 2,
			offset: cc.p(5, 1)
		},
		over: {
			res: "res/animate/alpha_bubble.plist",
// music : MUSIC_CONFIG.iceItemEnd,
			fps: 24,
			frameIDs: 14,
			loop: 0, // 1:循环 ,0:一次
			name: "alpha_bubble",
			zorder: 10,
			ineffect: 0
		}


	},
// hit
	type_10_6: {
// 阶段：start,progress,over,hit
		start: {
			res: "res/animate/type_10_6.plist",
// music : MUSIC_CONFIG.iceItemEnd,
			fps: 12,
			frameIDs: [1, 2, 3, 4, 5],
			loop: 1, // 1:循环 ,0:一次
			name: "type_10_6",
			zorder: 10,
			ineffect: 2,
			offset: cc.p(0, 10)
		},
		over: {
			res: "res/animate/type_10_6.plist",
// music : MUSIC_CONFIG.iceItemEnd,
			fps: 24,
			frameIDs: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
			loop: 0, // 1:循环 ,0:一次
			name: "type_10_6",
			zorder: 10,
			ineffect: 1
		}
	},
	type_10_clear1: {
// 阶段：start,progress,over,hit
		start: {
			res: "res/animate/type_10_clear1.plist",
// music : MUSIC_CONFIG.iceItemEnd,
			fps: 24,
			frameIDs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
			loop: 1, // 1:循环 ,0:一次
			name: "type_10_clear1",
			zorder: 10,
			ineffect: 2,
			offset: cc.p(0, 5)
		}

	},
// dragon
	type_dragon: {
// 阶段：start,progress,over,分别表示嘴巴张开不同大小动画
		start: {
			res: "res/animate/dragon.plist",
// music : MUSIC_CONFIG.iceItemEnd,
			fps: 24,
			frameIDs: [1, 2, 3, 4, 5, 6, 7],
			loop: 1, // 1:循环 ,0:一次
			name: "dragon",
			zorder: 10,
			ineffect: 1,
			offset: cc.p(0, 10)
		},
		progress: {
			res: "res/animate/dragon.plist",
// music : MUSIC_CONFIG.iceItemEnd,
			fps: 24,
			frameIDs: [8, 9, 10, 11, 12, 13, 14, 15],
			loop: 1, // 1:循环 ,0:一次
			name: "dragon",
			zorder: 10,
			ineffect: 1,
			offset: cc.p(0, 10)
		},
		over: {
			res: "res/animate/dragon.plist",
// music : MUSIC_CONFIG.iceItemEnd,
			fps: 24,
			frameIDs: [16, 17, 18, 19, 20, 21, 22, 23, 24],
			loop: 0, // 1:循环 ,0:一次
			name: "dragon",
			zorder: 10,
			ineffect: 1
		}
	},
	// 旋转转轮
	type_12 : {
	// 阶段：start,progress,over,hit
		start: {
			res: "res/animate/type_10_clear1.plist",
	// music : MUSIC_CONFIG.iceItemEnd,
			fps: 12,
			frameIDs: [15, 16, 17, 18, 19, 20, 21],
			loop: 1, // 1:循环 ,0:一次
			name: "type_12",
			zorder: 10,
			offset: cc.p(15, 20),
			ineffect: 2 // 1:动画在特效层， 0:在自身层（道具） 2:自身的effect 上不替换原先自己的球图

		},
		progress: {
			res: "res/animate/type_10_clear1.plist",
	// music : MUSIC_CONFIG.iceItemEnd,
			fps: 30,
			frameIDs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
			loop: 0, // 1:循环 ,0:一次
			name: "type_12",
			zorder: 10,
			ineffect: 0
		},
		over: {
			res: "res/animate/normal_clear_effect.plist",
	// music : MUSIC_CONFIG.iceItemEnd,
			fps: 20,
			frameIDs: [1, 2, 3, 4, 5, 6],
			loop: 0, // 1:循环 ,0:一次
			name: "normal_clear_effect",
			zorder: 10,
			ineffect: 0
		}
	}

}