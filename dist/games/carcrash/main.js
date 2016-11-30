"use strict";module.exports=function(){var e={pixelScale:10,gameSpeed:.5,gameInit:!1,gameOver:!1,enemySpeed:300,ajax:!0,score:0,levelIndex:0,nextLevel:[10,100,1e3],win:1e3,highscore:0,highscoreTriggered:!1,gameId:"carcrash",source:"./games/carcrash/assets",mute:!0,gameSpeedSlower:function(){return this.gameSpeed/2},gameSpeedSlowest:function(){return this.gameSpeed/10},lanes:function(){var e=36*this.pixelScale,i=42*this.pixelScale,t=40.5*this.pixelScale;return[e,i,t]},gravity:function(){return-35*this.pixelScale},carPedal:function(){return 10*this.pixelScale},gameWidth:function(){return 30*this.pixelScale},gameHeight:function(){return 60*this.pixelScale}},i={fadeOut:function(e,i,t){t.game.add.tween(e).to({alpha:0},i,Phaser.Easing.Sinusoidal.InOut,!0,0)},fadeIn:function(e,i,t,a){t.game.add.tween(e).to({alpha:1},i,Phaser.Easing.Sinusoidal.InOut,!0,a)},tileAnimation:function(e,i){e.tilePosition.x-=i},moveUp:function(e,i,t,a){a.game.add.tween(e).to({y:t},i,Phaser.Easing.Sinusoidal.InOut,!0,0)},bounceLoop:function(e,i,t,n,o,s){e.anchor.setTo(.5,.5),e.scale.x=n*s.init.pixelScale,e.scale.y=n*s.init.pixelScale;var l=s.add.tween(e.scale).to({x:o*s.init.pixelScale,y:o*s.init.pixelScale},i,Phaser.Easing.Sinusoidal.InOut,!0,t);l.onComplete.add(function(){s.utils.bounceLoop(e,i,t,o,n,a)},this)}};i.ajax={putHttp:function(e,i,t,a,n){var o=new XMLHttpRequest;o.open("PUT","./api/user"),o.setRequestHeader("Content-Type","application/json; charset=UTF-8"),o.onload=function(){if(o.status>=200&&o.status<400){var i=o.response;"HIGHSCORE"===i&&n(),e.utils.ajax.timedError(e,!1)}else 401===o.status?e.utils.ajax.timedError(e,"Please login to save your gaming stats."):e.utils.ajax.timedError(e,"We couldn't update your gaming stats. There was a server error.")},o.onerror=function(){e.utils.ajax.timedError(e,"We couldn't update your user data. There was a connection error.")};var s=JSON.stringify({game:e.init.gameId,wins:t,plays:i,highscore:a,level:e.init.levelIndex});o.send(s)},getHttp:function(){var e=new XMLHttpRequest;e.open("GET","./api/user"),e.onload=function(){if(e.status>=200&&e.status<400){for(var i=JSON.parse(e.response),t=i.data.stats,n=0;n<t.length;n++)t[n].game===a.init.gameId&&(a.init.highscore=t[n].highscore);a.utils.ajax.timedError(a,!1)}else 401===e.status?a.utils.ajax.timedError(a,"Please login to save your gaming stats."):a.utils.ajax.timedError(a,"We couldn't get information about your stats. There was a server error.")},e.onerror=function(){a.utils.ajax.timedError(a,"We couldn't get information about your stats. There was a connection error.")},e.send()},timedError:function(e,i){window.dispatchEvent(new CustomEvent("timedError",{detail:i}))}};var t,a,n,o,s=function(){};s.prototype={preload:function(){t=this,n=t.load,n.image("preloader",this.game.init.source+"/img/preloader.png"),n.image("fblogo",this.game.init.source+"/img/fblogow.png")},create:function(){a=t.game,o=t.scale,t.input.maxPointers=1,a.device.desktop?(o.pageAlignHorizontally=!0,o.pageAlignVertically=!0,o.refresh()):(o.scaleMode=Phaser.ScaleManager.SHOW_ALL,o.minWidth=window.innerHeight/1.5,o.minHeight=window.innerHeight,o.maxWidth=window.innerHeight/1.5,o.maxHeight=window.innerHeight,o.forceLandscape=!0,o.pageAlignHorizontally=!0),t.state.start("Preloader")}};var l,a,n,r,p,c,g=function(){};g.prototype={preload:function(){l=this,n=l.load,l.setProgressLogo(),n.image("menuBg",this.game.init.source+"/img/menu.png"),n.image("title",this.game.init.source+"/img/title.png"),n.image("btn-start",this.game.init.source+"/img/start.png"),n.spritesheet("bground",this.game.init.source+"/img/backgrounds.png",30,60,4),n.image("lv1",this.game.init.source+"/img/lv1.png"),n.image("lv2",this.game.init.source+"/img/lv2.png"),n.image("lv3",this.game.init.source+"/img/lv3.png"),n.image("lv4",this.game.init.source+"/img/lv4.png"),n.image("road",this.game.init.source+"/img/road.png"),n.image("floor1",this.game.init.source+"/img/floor1.png"),n.image("floor2",this.game.init.source+"/img/floor2.png"),n.image("floor3",this.game.init.source+"/img/floor3.png"),n.image("floor4",this.game.init.source+"/img/floor4.png"),n.spritesheet("car",this.game.init.source+"/img/car.png",5,3,8),n.spritesheet("enemy",this.game.init.source+"/img/enemy.png",5,3,8),n.image("truck",this.game.init.source+"/img/truck.png"),n.bitmapFont("litto",this.game.init.source+"/img/litto.png",this.game.init.source+"/res/litto.xml"),n.image("over",this.game.init.source+"/img/over.png"),n.image("retry",this.game.init.source+"/img/retry.png"),n.image("highscore",this.game.init.source+"/img/highscore.png"),n.image("top-highscore",this.game.init.source+"/img/top-highscore.png"),n.image("level-up",this.game.init.source+"/img/levelup.png"),n.audio("themeSong",this.game.init.source+"/res/themesong.m4a"),n.audio("explosion",this.game.init.source+"/res/explosion.mp3"),n.spritesheet("btn-volume",this.game.init.source+"/img/volume.png",7,7,2),n.image("winback",this.game.init.source+"/img/winback.png"),n.image("wintitle",this.game.init.source+"/img/wintitle.png"),n.onLoadComplete.add(l.onLoadComplete,l)}},g.prototype.setProgressLogo=function(){a=l.game,r=l.add,p=r.tileSprite(a.init.gameWidth()/2-90,a.init.gameHeight()/2-90,30,11,"fblogo"),p.scale.x=6,p.scale.y=6,c=r.sprite(a.init.gameWidth()/2-110,a.init.gameHeight()/2,"preloader"),c.cropEnabled=!1,n.setPreloadSprite(c)},g.prototype.onLoadComplete=function(){l.state.start("Menu")};var u,a,r,m,d,h,x,S,f,y,v=function(){};v.prototype={create:function(){u=this,a=u.game,r=u.add,u.stage.backgroundColor=3289907,m=r.tileSprite(0,0,30,60,"menuBg"),u.scaleSprite(m),d=r.tileSprite(0,20*a.init.pixelScale,30,7,"title"),u.scaleSprite(d),d.alpha=0,u.game.utils.fadeIn(d,500,this),u.game.utils.moveUp(d,500,15*a.init.pixelScale,this),f=r.tileSprite(15*a.init.pixelScale,45*a.init.pixelScale,16,6,"btn-start"),u.scaleSprite(f),f.alpha=0,u.game.utils.fadeIn(f,500,this,1e3),a.utils.bounceLoop(f,200,200,.75,1,a),h=r.tileSprite(a.init.gameWidth()-70,a.init.gameHeight()-32,30,11,"fblogo"),h.scale.x=2,h.scale.y=2,a.sound.mute=a.init.mute,x=r.audio("themeSong"),u.sound.setDecodedCallback(x,u.startSong,u),y=r.sprite(10,a.init.gameHeight()-30,"btn-volume"),y.frame=a.init.mute?0:1,y.scale.setTo(3,3),y.inputEnabled=!0,y.input.useHandCursor=!0,y.events.onInputDown.add(u.toggleVolume,u),S=a.input.keyboard.addKey(Phaser.Keyboard.ENTER),S.onDown.add(u.startGame,u),f.inputEnabled=!0,f.input.useHandCursor=!0,f.events.onInputDown.addOnce(u.startGame,u),u.game.utils.ajax.getHttp()},update:function(){}},v.prototype.scaleSprite=function(e){e.scale.x=this.game.init.pixelScale,e.scale.y=this.game.init.pixelScale},v.prototype.startGame=function(){x.stop(),u.state.start("Game")},v.prototype.startSong=function(){x.loopFull(.5)},v.prototype.toggleVolume=function(){a.init.mute=!a.init.mute,a.sound.mute=a.init.mute,y.frame=a.init.mute?0:1};var w,b,a,r,I,T,S,E,P,H,O,C,L,k,j,D,W,R,A,U,B,F,x,G,a,r,I,N=function(e,i,t,n,o){e=e,a=e.game,r=e.add,I=e.physics,window.Phaser.Sprite.call(this,a,i,t,n,o),r.existing(this),this.animations.add("explode",[1,2,3,4,5,6],10,!1).killOnComplete=!0,I.arcade.enable(this),this.scale.x=a.init.pixelScale,this.scale.y=a.init.pixelScale};N.prototype=Object.create(window.Phaser.Sprite.prototype),N.prototype.constructor=N,N.prototype.moveUp=function(){this.accelerate(),r.tween(this).to({y:a.init.lanes()[0]},300,window.Phaser.Easing.Sinusoidal.InOut,!0,0)},N.prototype.moveDown=function(){this.accelerate(),r.tween(this).to({y:a.init.lanes()[1]},300,window.Phaser.Easing.Sinusoidal.InOut,!0,0)},N.prototype.accelerate=function(){this.body.velocity.x=a.init.carPedal()};var M=function(){};M.prototype={create:function(){w=this,b=w.input.keyboard,a=w.game,r=w.add,I=w.physics,I.startSystem(Phaser.Physics.ARCADE),T=b.createCursorKeys(),S=b.addKey(Phaser.Keyboard.ENTER),a.stage.backgroundColor=16732224,E=r.sprite(0,0,"bground"),E.scale.setTo(this.game.init.pixelScale,this.game.init.pixelScale),P=r.tileSprite(0,0,30,60*a.init.pixelScale,"lv1"),P.scale.setTo(this.game.init.pixelScale,this.game.init.pixelScale),H=r.tileSprite(0,45*a.init.pixelScale,30,15,"floor1"),H.scale.setTo(this.game.init.pixelScale,this.game.init.pixelScale),O=r.tileSprite(0,34*a.init.pixelScale,30,13,"road"),O.scale.setTo(this.game.init.pixelScale,this.game.init.pixelScale),C=r.group(),C.enableBody=!0,I.arcade.enable(C);for(var e=0;e<2;e++)L=C.create(-9*a.init.pixelScale,a.init.lanes()[e],"truck"),L.scale.setTo(a.init.pixelScale,a.init.pixelScale);j=r.group(),j.enableBody=!0,I.arcade.enable(j);for(var e=0;e<2;e++)D=j.create(30*a.init.pixelScale*(1+e),a.init.lanes()[e],"enemy"),D.scale.setTo(a.init.pixelScale,a.init.pixelScale),D.animations.add("explodeRed",[1,2,3,4,5,6],10,!1).killOnComplete=!0;k=new N(w,5*a.init.pixelScale,36*a.init.pixelScale,"car"),W=r.bitmapText(0,5*a.init.pixelScale,"litto",0,a.init.pixelScale),R=r.sprite(5*a.init.pixelScale,20*a.init.pixelScale,"over"),R.scale.setTo(this.game.init.pixelScale,this.game.init.pixelScale),R.alpha=0,A=r.sprite(6.75*a.init.pixelScale,20*a.init.pixelScale,"highscore"),A.scale.setTo(this.game.init.pixelScale/2,this.game.init.pixelScale/2),A.alpha=0,B=r.sprite(9.75*a.init.pixelScale,-15*a.init.pixelScale,"level-up"),B.scale.setTo(this.game.init.pixelScale/2,this.game.init.pixelScale/2),B.alpha=0,U=r.sprite(15*a.init.pixelScale,53*a.init.pixelScale,"top-highscore"),U.alpha=0,a.utils.bounceLoop(U,100,100,.5,.6,a),F=r.button(15*a.init.pixelScale,40.5*a.init.pixelScale,"retry"),F.scale.setTo(this.game.init.pixelScale,this.game.init.pixelScale),F.alpha=0,F.anchor.setTo(.5,.5),a.sound.mute=a.init.mute,x=r.audio("themeSong"),G=r.audio("explosion"),w.sound.setDecodedCallback(x,w.startSong,w)},update:function(){w.animateBackground(),a.init.gameInit===!1&&(T.down.isDown||T.up.isDown||a.input.activePointer.isDown)&&w.gameStart(),a.init.nextLevel[a.init.levelIndex]===a.init.score&&w.newLevelStart(),a.init.gameOver===!0&&a.init.ajax===!0&&w.gameOver(),a.init.score===a.init.win&&w.gameWin(),a.init.score>a.init.highscore&&a.init.highscoreTriggered===!1&&w.newHighscore(),!(T.up.isDown||a.input.activePointer.isDown&&a.input.activePointer.position.y<a.init.lanes()[2])||k.y!==a.init.lanes()[0]&&k.y!==a.init.lanes()[1]?!(T.down.isDown||a.input.activePointer.isDown&&a.input.activePointer.position.y>a.init.lanes()[2])||k.y!==a.init.lanes()[0]&&k.y!==a.init.lanes()[1]||k.moveDown():k.moveUp(),w.enemyScoreUpdate(),I.arcade.overlap(k,j,w.playerEnemyCollision),I.arcade.overlap(k,C,w.playerTruckCollision),I.arcade.overlap(C,j,w.enemyTruckCollision)},render:function(){}},M.prototype.gameStart=function(){k.body.gravity.x=a.init.gravity(),j.setAll("body.velocity.x",-a.init.enemySpeed),a.init.gameInit=!0},M.prototype.gameOver=function(){a.utils.ajax.putHttp(a,!1,!1,a.init.score,w.topTenHighscore),a.init.ajax=!1,x.stop(),G.play(),a.utils.fadeOut(E,0,w),a.utils.fadeOut(P,0,w),a.utils.fadeOut(H,0,w),a.utils.fadeIn(R,0,w),a.utils.moveUp(R,500,15*a.init.pixelScale,this),a.utils.fadeIn(F,0,w),a.time.events.add(.5*Phaser.Timer.SECOND,function(){F.events.onInputDown.addOnce(w.gameRetry,w),S.onDown.add(w.gameRetry,w)})},M.prototype.gameRetry=function(){a.utils.ajax.putHttp(a,!0,!1,0,function(){}),a.init.ajax=!1,a.init.gameInit=!1,a.init.gameOver=!1,a.init.score=0,a.init.levelIndex=0,a.init.highscoreTriggered=!1,a.init.ajax=!0,w.state.restart(!0,!1)},M.prototype.gameWin=function(){a.utils.ajax.putHttp(a,!1,!0,a.init.score,function(){}),a.init.ajax=!1,x.stop(),w.state.start("Win")},M.prototype.playerEnemyCollision=function(e,i){e.animations.play("explode"),i.animations.play("explodeRed"),a.init.gameOver=!0},M.prototype.playerTruckCollision=function(e,i){e.accelerate(),e.animations.play("explode"),i.body.velocity.x=a.init.enemySpeed,a.init.gameOver=!0},M.prototype.enemyTruckCollision=function(e,i){e.x>=0&&(i.body.velocity.x=a.init.carPedal(),i.animations.play("explodeRed"))},M.prototype.animateBackground=function(){a.utils.tileAnimation(P,a.init.gameSpeedSlowest()),a.utils.tileAnimation(H,a.init.gameSpeed),a.utils.tileAnimation(O,a.init.gameSpeedSlower())},M.prototype.newLevelStart=function(){w.newLevelLabel(),E.frame=a.init.levelIndex+1,a.utils.fadeOut(P,0,w),a.utils.fadeOut(H,0,w),a.init.levelIndex++,a.time.events.add(1*Phaser.Timer.SECOND,w.newLevelEnd,w)},M.prototype.newLevelEnd=function(){a.init.gameOver===!1&&(P.loadTexture("lv"+(a.init.levelIndex+1)),H.loadTexture("floor"+(a.init.levelIndex+1)),a.utils.fadeIn(P,0,w),a.utils.fadeIn(H,0,w))},M.prototype.enemyScoreUpdate=function(){j.forEach(function(e){e.x<=-5*a.init.pixelScale&&a.init.gameOver===!1&&(e.y=a.init.lanes()[0]+(a.init.lanes()[1]-a.init.lanes()[0])*a.rnd.integerInRange(0,1),e.x=60*a.init.pixelScale,a.init.score++)}),W.text=a.init.score,W.x=(30*a.init.pixelScale-W.width)/2},M.prototype.newHighscore=function(e){a.init.highscoreTriggered=!0,a.init.highscore=a.init.score,a.utils.fadeIn(A,0,w),a.utils.moveUp(A,500,15*a.init.pixelScale,w),setTimeout(function(){a.utils.fadeOut(A,0,w),a.utils.moveUp(A,500,-15*a.init.pixelScale,w)},1e3)},M.prototype.newLevelLabel=function(e){a.utils.fadeIn(B,0,w),a.utils.moveUp(B,500,15*a.init.pixelScale,w),setTimeout(function(){a.utils.fadeOut(B,0,w),a.utils.moveUp(B,500,-15*a.init.pixelScale,w)},1e3)},M.prototype.topTenHighscore=function(e){a.init.highscoreTriggered=!0,a.init.highscore=a.init.score,a.utils.fadeIn(U,0,w)},M.prototype.startSong=function(){x.loopFull(.5)};var K=function(){};K.prototype={create:function(){this.stage.backgroundColor=3289907,this.menu=this.add.tileSprite(0,0,30,60,"winback"),this.scaleSprite(this.menu),this.menu.inputEnabled=!0,this.title=this.add.tileSprite(15*this.game.init.pixelScale,15*this.game.init.pixelScale,30,5,"wintitle"),this.scaleSprite(this.title),this.title.alpha=0,this.fblogo=this.add.tileSprite(this.game.init.gameWidth()-70,this.game.init.gameHeight()-32,30,11,"fblogo"),this.fblogo.scale.x=2,this.fblogo.scale.y=2,this.car=this.add.sprite(this.game.init.gameWidth()/2,this.game.init.gameHeight()/1.75,"car"),this.scaleSpriteByFour(this.car),this.car.anchor={x:.5,y:.5},this.frameIndex=0,this.game.utils.fadeIn(this.title,120,this),this.game.utils.bounceLoop(this.title,200,200,.75,1,this.game),this.themeSong=this.add.audio("themeSong"),this.explosion=this.add.audio("explosion"),this.game.sound.setDecodedCallback(this.themeSong,this.startSong,this)},update:function(){this.car.angle+=1,this.frameIndex+=1,2===this.frameIndex&&(this.car.frame+=1,this.frameIndex=0)}},K.prototype.scaleSprite=function(e){e.scale.x=this.game.init.pixelScale,e.scale.y=this.game.init.pixelScale},K.prototype.scaleSpriteByFour=function(e){e.scale.x=4*this.game.init.pixelScale,e.scale.y=4*this.game.init.pixelScale},K.prototype.startSong=function(){this.themeSong.loopFull(.5),this.explosion.loopFull(.5)};var a=new Phaser.Game(e.gameWidth(),e.gameHeight(),Phaser.CANVAS,"phaser-game",null,(!1),(!1));return a.utils=i,a.init=e,a.state.add("Boot",new s),a.state.add("Preloader",new g),a.state.add("Menu",new v),a.state.add("Game",new M),a.state.add("Win",new K),a.state.start("Boot"),a};