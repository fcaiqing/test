/*
 ###########      修改前请看    #############
    使用资源通过res.xxx来访问
    加载资源的顺序是分开的， res里面的赋值到g_resources， 在显示欢迎界面前就加载
    select_map_scene_res和play_scene_resources在显示欢迎界面后加载，可以按需要修改。
    select_map_scene_res和play_scene_resources定义的在加载结束后赋值到res，  
    这样所有资源都可以根据res.前缀来访问
    任何一个资源，只需要在其中一个容器内定义就够了，不要重复写，方便维护。
*/
var res = {
	//图片(WelcomeScene）
	WelcomBg_png:"res/welcomeBg.jpg",
	Update_progress_bottom_png: "res/updateTexture/update_progress_bottom.png",
	StarProgressBarBg:"res/updateTexture/starProgressBarBg.png",
	StarProgressBar:"res/updateTexture/starProgressBar.png",
	Update_progress_head_png: "res/updateTexture/update_progress_head.png",
	Update_progress_top_png: "res/updateTexture/update_progress_top.png",
	Setup_open_bg_png: "res/texture/newUI/setup_open_bg.png",
	Setup_bg_png: "res/texture/newUI/setup_bg.png",
	Sound_on_png: "res/texture/newUI/sound_on.png",
	Sound_off_png:"res/texture/newUI/sound_off.png",
	Music_on_png:"res/texture/newUI/music_on.png",
	Music_off_png:"res/texture/newUI/music_off.png",
	Exit_btn_png:"res/texture/newUI/exit_btn.png",
	Loading_png:"res/texture/dontPack/loading.png",
    Loading2_png:"res/texture/dontPack/loading2.png",
	Game_start_btn : "res/texture/newUI/gameStartBtn.png",
	Progress_bar:"res/texture/dontPack/progress.png",
	Progress_bg:"res/texture/dontPack/progress_bg.png",

	//QQ browser api UI
	BtnQQLogin_png:"res/texture/newUI/btnqqlogin.png",
	BtnWXLogin_png:"res/texture/newUI/btnwxlogin.png",
	BtnReLogin_png:"res/texture/newUI/btnrelogin.png",
	Forum_png:"res/texture/newUI/inviteIco.png",
    
    BtnShare_png:"res/texture/newUI/shareout.png",
    BtnSendtoDesk_png:"res/texture/newUI/sendtodesk.png",
	ImageShare_png:"res/texture/newUI/shareprizefirst.png",
	TitleShare_png:"res/texture/newUI/titleshareprize.png",
    TitleDesk_png:"res/texture/newUI/titleshareprize.png"
};

var select_map_scene_res={

	Fail_ico_png: "res/texture/newUI/fail_ico.png",
	Fail_text_png:"res/texture/newUI/fail_text.png",
	Fail_ico_bg_png: "res/texture/newUI/fail_ico_bg.png",
	White_bg1_png: "res/texture/newUI/white_bg1.png",
	Close_png: "res/texture/newUI/close.png",
    
	//图片(SelectMapScene)
	Cloud1_png:"res/texture/newUI/cloud1.png",
	Cloud2_png:"res/texture/newUI/cloud2.png",
	Comingsoon_png:"res/texture/newUI/comingsoon.png",
	Map_star_1_png:"res/texture/newUI/map_star_1.png",
	Map_star_2_png:"res/texture/newUI/map_star_2.png",
	Map_star_3_png:"res/texture/newUI/map_star_3.png",
	Last_level_png:"res/texture/newUI/last_level.png",
	Obstacle_finish_png:"res/texture/newUI/obstacle_finish.png",
	Obstacle_ing_png:"res/texture/newUI/obstacle_ing.png",
	Obstacle_lock_png:"res/texture/newUI/obstacle_lock.png",
	classic_finish_png:"res/texture/newUI/classic_finish.png",
	classic_ing_png:"res/texture/newUI/classic_ing.png",
	classic_lock_png:"res/texture/newUI/classic_lock.png",
	save3_finish_png:"res/texture/newUI/save3_finish.png",
	save3_ing_png:"res/texture/newUI/save3_ing.png",
	save3_lock_png:"res/texture/newUI/save3_lock.png",
	save_finish_png:"res/texture/newUI/save_finish.png",
	save_ing_png:"res/texture/newUI/save_ing.png",
	save_lock_png:"res/texture/newUI/save_lock.png",
	time_finish_png:"res/texture/newUI/time_finish.png",
	time_ing_png:"res/texture/newUI/time_ing.png",
	time_lock_png:"res/texture/newUI/time_lock.png",
	wheel_finish_png:"res/texture/newUI/wheel_finish.png",
	wheel_ing_png:"res/texture/newUI/wheel_ing.png",
	wheel_lock_png:"res/texture/newUI/wheel_lock.png",
	Map_top_bg_png:"res/texture/newUI/map_top_bg.png",
	Map_top_blue_bg_png:"res/texture/newUI/map_top_blue_bg.png",
	Heart_png:"res/texture/newUI/heart.png",
	Gold_png:"res/texture/newUI/gold.png",
	Add_normal_png:"res/texture/newUI/add_normal.png",
	//pay
	ShopLayer_png:"res/shoplayer.png",
	btnGiftPack_png:"res/texture/newUI/btnGiftPack.png",
    //rank
    CrownGold_png : "res/texture/newUI/crown_gold.png",
    CrownSilver_png : "res/texture/newUI/crown_silver.png",
    CrownBronze_png : "res/texture/newUI/crown_bronze.png",
    RankMyScore_png : "res/texture/newUI/rankmyscoreback.png",
    RankCellBack_png : "res/texture/newUI/rankcellback.png",
    RankIcon_png : "res/texture/newUI/rankicon.png",
    RankScore_png : "res/texture/newUI/rankscore.png",
    RankBack_png : "res/ranklistlayer.png",
    
    //购买成功
    PaySuccess_png : "res/texture/newUI/gold_n2.png",
    StopServer_png : "res/stopserver.png"
}

var play_scene_res={
	//图片(主要玩法）
	BackGround_jpg: "res/bg.jpg",
	CROCK1_png: "res/texture/newUI/crock1.png",
	CROCK2_png: "res/texture/newUI/crock2.png",
	CROCK3_png: "res/texture/newUI/crock3.png",
	CROCKMASK1_png:"res/texture/dontPack/crock_mask1.png",
	CROCKMASK2_png:"res/texture/dontPack/crock_mask2.png",
	CROCKMASK3_png:"res/texture/dontPack/crock_mask3.png",
	Bubble01_png: "res/texture/UI/bublle01.png",
	Bubble02_png: "res/texture/UI/bublle02.png",
	Bubble03_png: "res/texture/UI/bublle03.png",
	Bubble04_png: "res/texture/UI/bublle04.png",
	Bubble05_png: "res/texture/UI/bublle05.png",
	Bubble06_png: "res/texture/UI/bublle06.png",
	Bubble07_png: "res/texture/UI/bublle07.png",
	Item_bubble1_png: "res/texture/UI/item_bubble1.png",
	Item_bubble2_png: "res/texture/UI/item_bubble2.png",
	Item_bubble3_png: "res/texture/UI/item_bubble3.png",
	Item_bubble4_png: "res/texture/UI/item_bubble4.png",
	Item_bubble5_png: "res/texture/UI/item_bubble5.png",
	Item_bubble6_png: "res/texture/UI/item_bubble6.png",
	Special88_png:"res/texture/UI/special88.png",
	Special88_2_png:"res/texture/UI/special88_2.png",
	Special88_3_png:"res/texture/UI/special88_3.png",
	Special88_editer_png: "res/texture/UI/special88_editer.png",
	AlphaBubble_png: "res/texture/UI/alphaBubble.png",
	Special01_png: "res/texture/UI/special01.png",
	Special02_png: "res/texture/UI/special02.png",
	Special03_png: "res/texture/UI/special03.png",
	Special04_png: "res/texture/UI/special04.png",
	Special05_png: "res/texture/UI/special05.png",
	Special06_png: "res/texture/UI/special06.png",
	Special07_png: "res/texture/UI/special07.png",
	Special08_png: "res/texture/UI/special08.png",
	Special09_png: "res/texture/UI/special09.png",
	Special10_png: "res/texture/UI/special10.png",
	Special12_png: "res/texture/UI/special12.png",
	Special12_fall_png: "res/texture/UI/special12_fall.png",
	Special5_1_png: "res/texture/UI/special5_1.png",
	Special5_2_png: "res/texture/UI/special5_2.png",
	Special5_3_png: "res/texture/UI/special5_3.png",
	Fog_png: "res/texture/UI/fog.png",
	Hold_ani1_png: "res/texture/UI/hold_ani1.png",
	Hold_ani3_png: "res/texture/UI/hold_ani3.png",
	Hold_ani6_png: "res/texture/UI/hold_ani6.png",
	Hit_bg_png:"res/texture/UI/hit_bg.png",
	Ice_hold1_png:"res/texture/UI/ice_hold1.png",
	Ice_hold3_png:"res/texture/UI/ice_hold3.png",
	AddIco_png:"res/texture/UI/addIco.png",
	Add3_png:"res/texture/UI/add3.png",
	Add4_png:"res/texture/UI/add4.png",
	Add5_png:"res/texture/UI/add5.png",
	Saved1_png: "res/texture/UI/saved1.png",
	Saved3_png: "res/texture/UI/saved3.png",
	Saved6_png: "res/texture/UI/saved6.png",
	BubblePics_plist:"res/texture/UI/bubblePics.plist",
	BubblePics:"res/texture/UI/bubblePics.png",
	TOP_LINE_png: "res/texture/newUI/top_line.png",
	Swap_png:     "res/texture/newUI/swap.png",
	Shot_box_png: "res/texture/newUI/shot_box.png",
	Top_Clear_png: "res/texture/newUI/top_cleard.png",
	Time_waitNum_png: "res/texture/newUI/time_waitNum.png",
	PARTICLE_PLIST: "res/particles/shengchengqiu.plist",
	BOMB_PLIST: "res/animate/normal_clear_effect.plist",
	POINT1_PNG: "res/texture/newUI/point_1.png",
	POINT2_PNG: "res/texture/newUI/point_2.png",
	POINT3_PNG: "res/texture/newUI/point_3.png",
	POINT4_PNG: "res/texture/newUI/point_4.png",
	POINT5_PNG: "res/texture/newUI/point_5.png",
	POINT6_PNG: "res/texture/newUI/point_6.png",
	COMB0_PNG: "res/texture/newUI/combo.png",
	X_PNG:      "res/texture/newUI/x.png",
	ALPHA_PNG: "res/texture/dontPack/alpha.png",


	//图片（顶部）
	GAME_TOP_PNG: "res/texture/newUI/game_top_bg.png",
	classic_ico_png: "res/texture/newUI/classic_ico.png",
	wheel_ico_png: "res/texture/newUI/wheel_ico.png",
	save_ico_png: "res/texture/newUI/save_ico.png",
	save3_ico_png: "res/texture/newUI/save3_ico.png",
	time_ico_png: "res/texture/newUI/time_ico.png",
	starProgress_png:"res/texture/newUI/starProgressBar.png",
	starProgressBg_png:"res/texture/newUI/starProgressBarBg.png",
	game_top_smalbg_png: "res/texture/newUI/game_top_smal_bg.png",
	progress_star_disable_png:"res/texture/newUI/progress_star_disable.png",
	progress_star_png: "res/texture/newUI/progress_star.png",
	progressTag_png: "res/texture/newUI/progressTag.png",
	cd_progress_png: "res/texture/newUI/cd_progress.png",
	cd_progress_bg_png:"res/texture/newUI/cd_progress_bg.png",

	//图片 （底部）
	GAME_BOTTOM_PNG:"res/texture/newUI/bottomBg.png",

	//图片 （控件)
	Bar_bg4_png: "res/texture/newUI/bar_bg4.png",
	Bar_bg5_png: "res/texture/newUI/bar_bg5.png",
	Bar_bg6_png: "res/texture/newUI/bar_bg6.png",
	Bar_bg7_png: "res/texture/newUI/bar_bg7.png",
	Blue_bg_png: "res/texture/newUI/blue_bg.png",
	Win_text_png: "res/texture/newUI/win_text.png",
	Effect_bg_png: "res/texture/newUI/effect_bg.png",
	Star_big_normal_png: "res/texture/newUI/star_big_normal.png",
	Star_big_disable_png: "res/texture/newUI/star_big_disable.png",
	Win_ico_png: "res/texture/newUI/win_ico.png",
	 
	New_record_ico_png: "res/texture/newUI/new_record_ico.png",
    Start_btn:"res/texture/newUI/startBtn.png",
	//动画PLIST
	ShotStar_plist: "res/particles/shotStar.plist",
	SaveGhost_plist: "res/particles/saveGhost.plist",

    // 字体相关
	NUM_FONT1 : "res/fonts/NumFont1.fnt", //combo
	NUM_FONT2 : "res/fonts/NumFont2.fnt",
	TITLE_FONT : "res/fonts/NumFont3.fnt",
	EMAIL_FONT : "res/fonts/NumFont4.fnt",
	EMAIL_FONT_PNG: "res/fonts/NumFont4_0.png",
	NUMBER_OUTLINE : "res/fonts/NumberOutline.fnt",  // 描边数字字体/09438516;27x:+,.-
	//BTN_TEXT_FONT : "res/fonts/framd.ttf", // 按钮上面的字体
	//COMMON_EN_FONT : "res/fonts/framd.ttf", // 通用英文字体
	GUIDE_FONT : "res/fonts/guideFont.fnt",
	CN_FONT :"res/fonts/zh.fnt",
	//DEBUSSY_FONT :"res/fonts/debussy.ttf",

	//UI
	PlayButton_png : "res/texture/newUI/btn_bg1.png",
	PlayButtonSelect_png : "res/texture/newUI/btn_bg2.png",
	Ani_Mapscene_plist : "res/animate/scene3_4.plist",
	Ani_Mapscene_png : "res/animate/scene3_4.png",
	LessonStart_png : "res/texture/newUI/progress_star.png",
	OK_text:"res/texture/newUI/okBtn.png",
	OK_text2:"res/texture/newUI/okBtn2.png",
	Failure:"res/texture/newUI/Failure.png",
	Heart_break_big:"res/texture/newUI/heart_break_big.png",
	Continue_btn : "res/texture/newUI/continueBtn.png",
	Retry_btn : "res/texture/newUI/retryBtn.png",
	Title_exitLevel:"res/texture/newUI/title_exitLevel.png",
	End_btn:"res/texture/newUI/endBtn.png",

	//关卡图标
	LessonType1_1_png : "res/texture/newUI/classic_ing.png",
	LessonType1_2_png : "res/texture/newUI/classic_finish.png",
	LessonType1_3_png : "res/texture/newUI/classic_lock.png",
	LessonType2_1_png : "res/texture/newUI/save_ing.png",
	LessonType2_2_png : "res/texture/newUI/save_finish.png",
	LessonType2_3_png : "res/texture/newUI/save_lock.png",
	LessonType3_1_png : "res/texture/newUI/save3_ing.png",
	LessonType3_2_png : "res/texture/newUI/save3_finish.png",
	LessonType3_3_png : "res/texture/newUI/save3_lock.png",
	LessonType4_1_png : "res/texture/newUI/time_ing.png",
	LessonType4_2_png : "res/texture/newUI/time_finish.png",
	LessonType4_3_png : "res/texture/newUI/time_lock.png",
	LessonType5_1_png : "res/texture/newUI/wheel_ing.png",
	LessonType5_2_png : "res/texture/newUI/wheel_finish.png",
	LessonType5_3_png : "res/texture/newUI/wheel_lock.png",

	//松鼠的骨骼动画
	Armature1_png : "res/animate/shotAnimation.png",
	Armature1_plist : "res/animate/shotAnimation.plist",
	Armature1_xml : "res/animate/shotAnimation.xml",
	SavedGhost_png: "res/animate/savedGhost.png",
	SavedGhost_plist: "res/animate/savedGhost.plist",
	SavedGhost_xml: "res/animate/savedGhost.xml",


	//购买按钮
	Item_ico_off1 : "res/texture/UI/item_ico_off1.png",
	Item_ico_off2 : "res/texture/UI/item_ico_off2.png",
	Item_ico_off3 : "res/texture/UI/item_ico_off3.png",
	Item_ico_off4 : "res/texture/UI/item_ico_off4.png",
	Item_ico_off5 : "res/texture/UI/item_ico_off5.png",
	Item_ico_off6 : "res/texture/UI/item_ico_off6.png",
	Item_ico_off7 : "res/texture/UI/item_ico_off7.png",
	Item_ico_off6_disable : "res/texture/UI/item_ico_off6_disable.png",

	Btn_bg1_big : "res/texture/newUI/btn_bg1_big.png",
	Btn_bg1 :"res/texture/newUI/btn_bg1.png",
	Btn_bg2 :"res/texture/newUI/btn_bg2.png",
	Btn_bg3 :"res/texture/newUI/btn_bg3.png",
	BtnPayGold10_png : "res/texture/newUI/btn_paygold10.png",
	//道具数量背景
	Item_count_bg : "res/texture/newUI/item_count_bg.png",

	//道具效果
	Add_bubble_fly_ico : "res/texture/UI/addBubbleFlyIco.png",
	Add_10bubble_effect:"res/texture/newUI/add_10bubble_effect.png",
	Unlock_ico :"res/texture/newUI/unlock_ico.png",
	Fireds_cell_bg :"res/texture/newUI/fireds_cell_bg.png",
	Title_buy_success :"res/texture/newUI/title_buySuccess.png",
	HP_heartes : "res/texture/newUI/hp_heartes.png",
	Add_hp_success : "res/texture/newUI/add_hp_success.png",
	Title_unlock_1:"res/texture/newUI/title_unlock_1.png",
	Title_unlock_2:"res/texture/newUI/title_unlock_2.png",
	Title_unlock_3:"res/texture/newUI/title_unlock_3.png",
	Title_unlock_4:"res/texture/newUI/title_unlock_4.png",
	Title_unlock_5:"res/texture/newUI/title_unlock_5.png",
	Title_unlock_6:"res/texture/newUI/title_unlock_6.png",
	Magic_light_2:"res/particles/magicLight2.plist",
	Pay_item_1:"res/pay/item_1.png",
	Pay_item_2:"res/pay/item_2.png",
	Pay_item_3:"res/pay/item_3.png",
	Pay_item_4:"res/pay/item_4.png",
	Pay_item_5:"res/pay/item_5.png",
	Pay_item_6:"res/pay/item_6.png",
	Pay_item_7:"res/pay/item_7.png",
	Pay_item_8:"res/pay/item_8.png",
	Pay_item_10:"res/pay/item_10.png",
	Pay_item_11:"res/pay/item_11.png",
	Pay_item_12:"res/pay/item_12.png",
	Pay_item_13:"res/pay/item_13.png",
	First_fail_add5:"res/texture/newUI/first_fail_add5.png",

	//新手引导
	New_guide_arrow : "res/texture/newUI/new_guide_arrow.png",
	New_guide_box : "res/texture/newUI/new_guide_box.png",
	Shoot_guide_mask :"res/texture/newUI/shoot_guide_mask.png",
	Head_bg: "res/texture/newUI/head_bg.png",
	Level_title:"res/texture/newUI/level_title.png",
	Right_ico :"res/texture/newUI/rightIco.png",
	Zs_title : "res/texture/newUI/zs_title.png",
	Explain_save:"res/texture/newUI/explain_save.png",
    
    //新春礼包图片
    NewYearGift_back:"res/newyeargiftwindow.png",
    NewYearGift_button:"res/texture/newUI/btnbuynewyeargift.png",
    NewYearGift_icon:"res/texture/newUI/iconnewyeargift.png",
    NewYearGift_light:"res/texture/newUI/lightbackground.jpg",
    
}

var level_res={
}

//PICTURE
var g_resources = [];
for (var i in res) {
	if(play_scene_res[i]||select_map_scene_res[i]||level_res[i]){
		continue;
	}
    g_resources.push(res[i]);
}


/*
var select_map_scene_resources=[];

for(var resKey in select_map_scene_res){
	select_map_scene_resources.push(select_map_scene_res[resKey]);
}
*/

var play_scene_resources=[];
//MAPCELL
for(var i = 1; i <= 32; i++){
	if(i>=29){
		play_scene_resources.push("res/scenes/selectemap/"+i+".png");
	}else {
		play_scene_resources.push("res/scenes/selectemap/" + i + ".jpg");
	}
}

for(var resKey in play_scene_res){
	play_scene_resources.push(play_scene_res[resKey]);
    res[resKey] = play_scene_res[resKey];
}

for(var resKey in select_map_scene_res){
	play_scene_resources.push(select_map_scene_res[resKey]);
    res[resKey] = select_map_scene_res[resKey];
}

var level_resources=[];
for(var resKey in level_res){
	level_resources.push(level_res[resKey]);
    res[resKey] = level_res[resKey];
}

//检查Array是否包含了元素
var arrayContains = function(ary, item){
	for(var i=0; i< ary.length;i++){
		if(item == ary[i]){
			return true;
		}
	}
    return false;
};
//PLIST(ANIMATE,PARTICLE)
for(var j in BULLET_CONFIG){
	var aniData = BULLET_CONFIG[j];
	for(var k in aniData){
		var phase = aniData[k];
		if(phase && phase.res){
			if(arrayContains(play_scene_resources,phase.res)){
				continue;
			}
			if(phase.res=="res/particles/bingqilingdaiji.plist"
			||phase.res=="res/particles/caihongdaiji.plist"
			||phase.res=="res/animate/scene3_4.plist"){
				continue;
			}
			play_scene_resources.push(phase.res);
		}
	}
}


//加载场景的图片修改
var cc = cc || {};
cc._loaderImage = "res/texture/newUI/add_hp_success.png";
cc._loaderWidth = 304;
cc._loaderHeight = 264;
