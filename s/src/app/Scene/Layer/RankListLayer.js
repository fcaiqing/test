var RanklistLayer = cc.Layer.extend({
    cellheight:106,
    cellwidth:500,
    rankdata:null,
    ctor:function(){
        this._super();
        //显示自己
        this.size = cc.size(601,835);
        this.listwidth = 530;
        this.listheight = 620;
        this.leftpadding = (this.size.width-this.listwidth)/2;
		this.attr({
			anchorX:0.5,
			anchorY:0.5,
			x:display.cx,
			y:display.cy
		});
        this.ignoreAnchor=false;
		this.mask = new BYMask({});
		this.mask.addChild(this);
		cc.director.getRunningScene().addChild(this.mask, MIDDLE_WIN_TAG, MIDDLE_WIN_TAG);
        
        //播放声音
        uihelper.setCustomPopAction(this);
		game.playMusic(PRE_LOAD_MUSIC.popWin);
        
        //初始化界面
        this.iniUI();
    },
    iniUI:function(){
        //背景图片
        var boxBg = new cc.Sprite(res.RankBack_png);
		boxBg.setPosition(display.cx,display.cy);
		this.addChild(boxBg, 0, 1006);
        
        this.addCloseBtn();
        devServer.levelRankData(function(rsp){
            if(!this || !this.mask.parent){
                return;
            }
            rsp = JSON.parse(rsp);
            if(rsp.code != 0){
                this.showErrorMessage(rsp.msg);
                return;
            }
            this.rankdata = rsp.rank;
            this.createListView();
            this.createMyRankCell(rsp.myrank);
        }.bind(this));
        
    },
    createListView:function(){
        if(!this.rankdata || this.rankdata.length <= 0){
            return;
        }
        var background = this.getChildByTag(1006);
        if(!background){
            return;
        }
		this.lv = new ccui.ListView();
		this.lv.setDirection(ccui.ScrollView.DIR_VERTICAL);
		this.lv.setTouchEnabled(true);
		this.lv.setBounceEnabled(false);
		this.lv.setSize(cc.size(this.listwidth, this.listheight));
		this.lv.setAnchorPoint(cc.p(0,0));
	    this.lv.setPosition(this.leftpadding,50);
		var len = this.rankdata.length;
		for(var i = 0;i < len;i++) {
			var item = new ccui.Layout();
			item.setTouchEnabled(true);
			var content = this.createRankCell(i);
			item.addChild(content);
			item.setContentSize(this.cellwidth, this.cellheight);
			this.lv.pushBackCustomItem(item);
		}
        background.addChild(this.lv);
	},
    createRankCell:function(index){
		var content =null;
		content = new cc.Sprite(res.RankCellBack_png);
        content.attr({anchorX:0, anchorY:0, x:15, y: 0});
        
        var cellview = this.createRankCellView(index+1, this.rankdata[index].level, this.rankdata[index].nickname);
        content.addChild(cellview);
		return content;
	},
    createRankCellView:function(rank, level, nickname){
        var cellpanel = new cc.Layer();
        cellpanel.setContentSize(cc.size(this.cellwidth, this.cellheight));
        
        //排名
        var numberLabel = new cc.LabelBMFont(rank,res.NUM_FONT2);
        numberLabel.scale = 0.65;
        var pos = {anchorX:0.5, anchorY:0.5, x:55, y: this.cellheight/2 + 7};
        numberLabel.attr(pos);
        
        //皇冠
        var crownimage = null;
        if(rank == 1){
            crownimage = res.CrownGold_png;
        }
        else if(rank == 2){
            crownimage = res.CrownSilver_png;
        }
        else if(rank == 3){
            crownimage = res.CrownBronze_png;
        }
        if(crownimage){
            var crownsp = new cc.Sprite(crownimage);
            crownsp.attr(pos);
            cellpanel.addChild(crownsp);
        }
        cellpanel.addChild(numberLabel);
        
        //用户昵称
        var fontDef = new cc.FontDefinition();
        fontDef.fontSize=28;
        fontDef.fontName=BUTTON_FONT;
        fontDef.fillStyle=cc.color(27, 50, 84, 255);
        var namelabel=new cc.LabelTTF(nickname,fontDef);
        namelabel.attr({anchorX:0, anchorY:0.5,x:120,y:this.cellheight/2});
        cellpanel.addChild(namelabel);
        
        //通关数量
        var levelback = new cc.Sprite(res.RankScore_png);
        levelback.attr({anchorX:0.5, anchorY:0.5, x:this.cellwidth - 90, y: this.cellheight/2});
        cellpanel.addChild(levelback);
        var levelLabel = new cc.LabelBMFont(level,res.TITLE_FONT);
        levelLabel.scale=0.75;
        levelLabel.attr({anchorX:0.5, anchorY:0.5, x:65, y: 18});
        levelback.addChild(levelLabel);
        return cellpanel;
    },
    createMyRankCell:function(rank){
        var rect = cc.rect(0,0,68,70);   //图片的大小
        var rectInsets = cc.rect(15,15,15,15); //left，right，width，height
        var cellSize = cc.size(this.listwidth, 72) //设置要拉伸后的的大小
        var content = new cc.Scale9Sprite(res.RankMyScore_png,rect, rectInsets);
        content.setContentSize(cellSize);
        content.attr({anchorX:0.5, anchorY:0.5, x:display.cx, y: display.cy - this.listheight/2 - 150});
        
        var fontDef = new cc.FontDefinition();
        fontDef.fontSize=28;
        fontDef.fontName=BUTTON_FONT;
        fontDef.fillStyle=cc.color(255, 255, 255, 255);
        var ranklabel=new cc.LabelTTF("您当前排名: 第"+rank+"名",fontDef);
        ranklabel.attr({x:this.listwidth/2,y:36});
        content.addChild(ranklabel);
        this.addChild(content);
    },
    showErrorMessage:function(msg){
        var background = this.getChildByTag(1006);
        if(!background){
            return;
        }
        var fontDef = new cc.FontDefinition();
        fontDef.fontSize=28;
        fontDef.fontName=BUTTON_FONT;
        fontDef.fillStyle=cc.color(255, 255, 255, 255);
        var msglabel=new cc.LabelTTF(msg,fontDef);
        msglabel.attr({anchorX:0.5, anchorY:0.5,x:this.listwidth/2,y:this.listheight/2});
        background.addChild(msglabel);
    },
    addCloseBtn:function(){
		var closeBtn = PYButton(res.Close_png,null,25,function() {
			this.mask.removeFromParent();
		}.bind(this));
		closeBtn.attr({
			anchorX:1,
			anchorY:1
		});
		closeBtn.setPosition(this.size.width+(display.width-this.size.width)/2+15,this.size.height+(display.height-this.size.height)/2-55);

		this.addChild(closeBtn);
	}
})