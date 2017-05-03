/**
 * Created by beyondray on 2015/8/14.
 * Desc: 动画与粒子管理
 */

var BulletManager = cc.Class.extend({
	ctor:function(){
		this.bullets = {};
		this.bulletRes = {};
		this.musicIds = {};
		this.particleRes = {};
		this.cacheAnimName = {};
	},
	load:function(aniName){
		var aniData = BULLET_CONFIG[aniName];
		//if(!aniData)
		//cc.log("bullet data error",aniName);

		if(this.bullets[aniName])return true;
		this.bullets[aniName] = {};

		var initAnimationData = (function(aniName,phaseName, bulletActionData){
			var prefixName = bulletActionData.name; // image name
			var animationName = aniName + "_" + phaseName; // eg: iceAni_start
			var animation = cc.animationCache.getAnimation(animationName);
			if(animation)return;

			var aniFrames = [];
			var actionData = bulletActionData;
			if(actionData){
				if(typeof  actionData.frameIDs == "object")
				{
					for(var i in actionData.frameIDs){
						var frameId = actionData.frameIDs[i];
						var frameId = string.PRE_ZERO(frameId, 4);
						var pictureName = prefixName + frameId + ".png";
						var frame = cc.spriteFrameCache.getSpriteFrame(pictureName);
						if(frame){
							aniFrames.push(frame);
						}
						//else{
							//cc.log(pictureName + " is not exist!!");
						//}
							
					}
				}
				else
				{
					for(var i = 1; i<= actionData.frameIDs;i++)
					{
						var frameId = string.PRE_ZERO(i, 4);
						var pictureName = prefixName + frameId + ".png";
						var frame = cc.spriteFrameCache.getSpriteFrame(pictureName);
						if(frame){
							aniFrames.push(frame);
						}
						else{
							//cc.log(pictureName + " is not exist!!");
						}
					}
				}

			}else{
				//cc.log("error:"+actionData+" is no t exist!!");
			}

			var animation = new cc.Animation(aniFrames, 1.0 / actionData.fps);  // 创建动画
			//cc.log("animation:",animation);
			if(!this.bullets[aniName][phaseName]) this.bullets[aniName][phaseName] = {};
			this.bullets[aniName][phaseName]["frames"] = aniFrames;
			this.bullets[aniName][phaseName]["fps"] = actionData.fps;
			this.bullets[aniName][phaseName]["music"] = actionData.music;
			this.bullets[aniName][phaseName]["zorder"] = actionData.zorder;
			this.bullets[aniName][phaseName]["loop"] = actionData.loop;
			this.bullets[aniName][phaseName]["angle"] = actionData.angle;
			this.bullets[aniName][phaseName]["ineffect"] = actionData.ineffect;
			this.bullets[aniName][phaseName]["offset"] = actionData.offset || cc.p(0,0);

			var music = Number(actionData.music);
			if(music && music!= 0){
				//game.preloadMusic(music);
				this.musicIds[actionData.music] = true;
			}

			this.cacheAnimation(animation, animationName);
		}).bind(this);

		for(var phaseName in aniData){
			var phaseData = aniData[phaseName];
            if(!phaseData){
                continue;
            }
			if(! this.bulletRes[phaseData.res]){
				if(phaseData.particle)
				{
					// 如果是粒子特效则保存phaseData,生成时直接获取phaseData生成粒子
					this.particleRes[aniName] = this.particleRes[aniName] || {};
					this.particleRes[aniName][phaseName] = phaseData;
				}
				else
				{
					this.bulletRes[phaseData.res] = true;
					//cc.log(phaseData.res);
					//加载PLIST文件
					cc.spriteFrameCache.addSpriteFrames(phaseData.res);
				}
			}

			if (! phaseData.particle)
				initAnimationData(aniName, phaseName, phaseData);
		}

		return true;
	},
	cacheAnimation:function(animation, name){
		cc.animationCache.addAnimation(animation, name);
		this.cacheAnimName[name] = true;
	},

	getAnimation:function(aniName, phaseName){
		var animation = cc.animationCache.getAnimation(aniName +"_" + phaseName);
		if(!animation)return false;
		return animation;
	},

	getParticles:function(aniName, phaseName){
		if(this.particleRes[aniName] && this.particleRes[aniName][phaseName])
			return this.particleRes[aniName][phaseName];
		return null;
	},

	getFrameCount:function(aniName, phaseName){
		if(this.bullets[aniName] && this.bullets[aniName][phaseName])
			return Number(this.bullets[aniName][phaseName]["frames"] || 0);
		return 0;
	},

	getFrame:function(aniName, phaseName, index){
		index = index || 0;
		if(this.bullets[aniName] && this.bullets[aniName][phaseName])
			return Number(this.bullets[aniName][phaseName]["frames"][index] || 0);
		return 0;
	},

	getFrameSprite:function(aniName, phaseName, index){
		index = index || 1;
		if(this.bullets[aniName] && this.bullets[aniName][phaseName])
			return new cc.Sprite(this.bullets[aniName][phaseName]["frames"][index]);
		return null;
	},

	getMusic:function(aniName, phaseName){
		if(this.bullets[aniName] && this.bullets[aniName][phaseName])
			return Number(this.bullets[aniName][phaseName]["music"] || 0);
		return 0;
	},

	getZorder:function(aniName, phaseName){
		if(this.bullets[aniName] && this.bullets[aniName][phaseName])
			return Number(this.bullets[aniName][phaseName]["zorder"] || 0);
		return 0;
	},
	getLoop:function(aniName, phaseName){
		if(this.bullets[aniName] && this.bullets[aniName][phaseName])
			return Number(this.bullets[aniName][phaseName]["loop"] || 0);
		return 0;
	},
	getAngle:function(aniName, phaseName){
		if(this.bullets[aniName] && this.bullets[aniName][phaseName])
			return Number(this.bullets[aniName][phaseName]["angle"] || 0);
		return 0;
	},
	getIneffect:function(aniName, phaseName){
		if(this.bullets[aniName] && this.bullets[aniName][phaseName])
			return Number(this.bullets[aniName][phaseName]["ineffect"] || 0);
		return 0;
	},
	getOffset:function(aniName, phaseName){
		if(this.bullets[aniName] && this.bullets[aniName][phaseName])
			return this.bullets[aniName][phaseName]["offset"];
		return cc.p(0, 0);
	},
	dispose:function(){
		//cc.log("BulletManager:dispose()");

		//释放PLIST文件缓存
		for(var plistPath in this.bulletRes){
			cc.spriteFrameCache.removeSpriteFramesFromFile(plistPath);
		}
		this.bulletRes = {};
		//释放音乐缓存
		for(var musicPath in this.musicIds){
			game.unloadMusic(musicPath);
		}
		this.musicIds = {};
		//释放动画缓存
		for(var aniName in this.cacheAnimation){
			cc.animationCache.removeAnimation(aniName);
		}
		this.cacheAnimName = {};
	}
})