/**
 * Created by beyondray on 2015/8/28.
 * Desc: 外部资源（声音等）配置文件
 * type 1:music,2:sound
 */

// 开始加载的声音
SOUND_TYPE = ".mp3";

if(cc.sys.os == cc.sys.ANDROID){
	SOUND_TYPE = ".ogg";
}

PRE_LOAD_MUSIC = {
	shot: {res: "res/sound/shot_bubble"+SOUND_TYPE, type: 2},
	click: {res: "res/sound/btn_click.mp3", type: 2},
	popWin: {res: "res/sound/pop_win"+SOUND_TYPE, type: 2},
	swapShot: {res: "res/sound/swap_bubble"+SOUND_TYPE, type: 2},
	hitwall: {res: "res/sound/hit_wall"+SOUND_TYPE, type: 2},
	star: {res: "res/sound/add_star"+SOUND_TYPE, type: 2},
	whenHitNoClear: {res: "res/sound/hit_no_clear"+SOUND_TYPE, type: 2},
	clear: {res: "res/sound/clear_bubble"+SOUND_TYPE, type: 2},
	when5wait: {res: "res/sound/5movs_left"+SOUND_TYPE, type: 2}, // 只有五球时
	// hitSpider : {res : "sound/hit_spider" + SOUND_TYPE,type : 2}, // 碰到蜘蛛（没用）
	enterBucket: {res: "res/sound/ball_enter_bucket"+SOUND_TYPE, type: 2}, // 掉入锅时
	// hitBucket : {res : "sound/sfx_ball_bounce_bucket_1" + SOUND_TYPE, type : 2}, // 碰到锅
	whenSelectedItem: {res: "res/sound/selected_item"+SOUND_TYPE, type: 2}, // 游戏中选择道具
	whenShotItem: {res: "res/sound/shot_bubble"+SOUND_TYPE, type: 2}, // 游戏中发射道具
	add_progress: {res: "res/sound/add_progress"+SOUND_TYPE, type: 2}, // 过关条件增加
	balance_score: {res: "res/sound/balance_score"+SOUND_TYPE, type: 2},// 分数结算
	//// music //
	init_ready_bubble : {res : "res/sound/init_ready_bubble" + SOUND_TYPE,type : 2},// 生成初始球
	selecteMapScene: { res: "res/music/map.mp3", type: 1, isLoop: 1},
	win: { res: "res/music/win.mp3", type: 2, isLoop: 0},
	lost: { res: "res/music/lost.mp3", type: 2, isLoop: 0},
	shotWaitWhenWin: { res: "res/music/game_music_bonus_mode_mono.mp3", type: 1, isLoop: 1}
}

MUSIC_CONFIG = {
////- sound ////-
	buy_gold_success: {res: "res/sound/buy_gold_success"+SOUND_TYPE, type: 2}, // 购买金币成功
	buy_hp_success: {res: "res/sound/buy_hp_success"+SOUND_TYPE, type: 2},  //购买生命成功

	wheelSmall: {res: "res/sound/creak_small"+SOUND_TYPE, type: 2}, // 旋转模式时旋转角度少时
	wheelBig: {res: "res/sound/creak_big"+SOUND_TYPE, type: 2}, // 旋转模式时旋转角度多时

	addBubbleNum: {res: "res/sound/add_bubble"+SOUND_TYPE, type: 2}, // 加球数道具
	iceItemEnd: {res: "res/sound/ice_clear"+SOUND_TYPE, type: 2}, // 冰球结束消失时声音
	flash: {res: "res/sound/flash"+SOUND_TYPE, type: 2},
	icoCream_clear: { res: "res/sound/icoCream_clear"+SOUND_TYPE, type: 2}, // 冰淇淋消失时声音
	rainbow: { res: "res/sound/rainbow_clear"+SOUND_TYPE, type: 2}, // 彩虹泡泡消失
	alpha_hit: { res: "res/sound/alpha_hit"+SOUND_TYPE, type: 2}, // 透明泡泡触发
	alpha_clear: { res: "res/sound/alpha_clear"+SOUND_TYPE, type: 2}, //透明泡泡消失
	magic_clear: { res: "res/sound/magic_clear"+SOUND_TYPE, type: 2}, //魔法泡泡消失
	boom_clear: { res: "res/sound/boom_clear"+SOUND_TYPE, type: 2},// 炸弹泡泡消失
	save3ModelHit: {res: "res/sound/hit_chocolate"+SOUND_TYPE, type: 2}, // 解救模式3 碰到
	// save3ModelSaved : {res : "sound/sfx_hitmode_shield_breaking" + SOUND_TYPE,type : 2},  // 解救模式3 解救

	////- music ////
	wheelBg: { res: "res/music/wheel.mp3", type: 1, isLoop: 1},
	saveBg: { res: "res/music/classic_save.mp3", type: 1, isLoop: 1},
	classic: { res: "res/music/classic_save.mp3", type: 1, isLoop: 1},
	timeModel: { res: "res/music/time.mp3", type: 1, isLoop: 1}

}

TEXTUER_ASSETS = [
	{ res : "res/texture/common_ui", pixFormat444 : false },
	{ res : "res/texture/newUI", pixFormat444 : true }
]

ARMATURE_CONFIG = [
	{
		type: 1,
		boneResource: "res/animate/shotAnimation",
		fps: 24,
		loop: 0, // 1:循环 ,0:一次
		name: "shortanimation" // FLASH中导出时元件的名称，以这个名称建立动画
	},
	// 解救成功的精灵动作
	{
		type: 2, // 要求唯一，相当于ID
		boneResource: "res/animate/savedGhost",
		fps: 24,
		loop: 0, // 1:循环 ,0:一次
		name: "savedGhost" // FLASH中导出时元件的名称，以这个名称建立动画
	}
]
