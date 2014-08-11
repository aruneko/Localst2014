//初期化
enchant();

//ゲーム本体系
window.onload = function(){
  //画面サイズを固定
  var game = new Core(320, 320);
  //キャラ読み込み
  game.preload('chara1.png', 'map0.png', 'icon0.png', 'end.png');
  //ゲームのFPS
  game.fps = 60;
  //本体処理
  game.onload = function() {
  
    //得点ラベル
    game.score = 0;
    var pointsLabel = new Label("Score : 0");
    pointsLabel.color = '#ff0000';
    pointsLabel.x = 200;
    pointsLabel.y = 304;
    game.rootScene.addChild(pointsLabel);
    
    //マップ配列の初期化
    var baseMap = [];
    for (var i = 0; i < 19; i++) {
      baseMap[i] = [,,,,,,,,,,,,,,,,,,]
    }
    //マップの初期配置の生成
    for (var i = 0; i < 19; i++) {
      for (var j = 0; j < 19; j++) {
        if (i == 0 || i == 18) {
          baseMap[i][j] = 3;
        } else {
          if (j == 0 || j == 18) {
            baseMap[i][j] = 3;
          } else {
            if (i % 2 != 0) {
              baseMap[i][j] = 5;
            } else {
              if (j % 2 != 0) {
                baseMap[i][j] = 5;
              } else {
                baseMap[i][j] = 3;
              }
            }
          }
        }
      }
    }
    //出口地点の書き込み
    baseMap[17][17] = 14;
    
    //棒倒し法でマップの生成
    for (var i = 2; i < 17; i+=2) {
      if (i == 2) {
        for (var j = 2; j < 17; j+=2) {
          var rnd, tmp;
          do {
            rnd = Math.floor(Math.random() * 4);
            switch (rnd) {
              case 0:
                tmp = baseMap[i-1][j];
                break;
              case 1:
                tmp = baseMap[i][j+1];
                break;
              case 2:
                tmp = baseMap[i+1][j];
                break;
              case 3:
                tmp = baseMap[i][j-1];
                break;
            }
          } while (tmp == 3);
          switch (rnd) {
            case 0:
              baseMap[i-1][j] = 3;
              break;
            case 1:
              baseMap[i][j+1] = 3;
              break;
            case 2:
              baseMap[i+1][j] = 3;
              break;
            case 3:
              baseMap[i][j-1] = 3;
              break;
          }
        }
      else {
        var rnd, tmp;
        for (var j = 2; j < 17; j+=2) {
          var rnd, tmp;
          do {
            rnd = Math.floor(Math.random() * 3);
            switch (rnd) {
              case 0:
                tmp = baseMap[i][j+1];
                break;
              case 1:
                tmp = baseMap[i+1][j];
                break;
              case 2:
                tmp = baseMap[i][j-1];
                break;
            }
          } while (tmp == 3);
          switch (rnd) {
            case 0:
              baseMap[i][j+1] = 3;
              break;
            case 1:
              baseMap[i+1][j] = 3;
              break;
            case 2:
              baseMap[i][j-1] = 3;
              break;
          }
        }
      }
    }
    
    //マップの当たり判定配列の初期化
    var colMap = [];
    for (var i = 0; i < 19; i++) {
      colMap[i] = [,,,,,,,,,,,,,,,,,,]
    }
    //壁に当たるところを判定
    for (var i = 0; i < 19; i++) {
      for (var j = 0; j < 19; j++) {
        if (baseMap[i][j] == 3) {
          colMap[i][j] = 1;
        } else {
          colMap[i][j] = 0;
        }
      }
    }
    
    //マップの描画
    var map = new Map(16, 16);
    map.image = game.assets['map0.png'];
    map.loadData(baseMap);
    map.collisionData = colMap;
    game.rootScene.addChild(map);
    
    //熊さんクラス
    var Bear = Class.create(Sprite, {
      initialize: function(x, y) {
        Sprite.call(this, 32, 32);
        this.x = x;
        this.y = y;
        this.image = game.assets['chara1.png'];
        this.on('enterframe', function() {
          if (game.input.left && !map.hitTest(this.x + 9, this.y + 9) && !map.hitTest(this.x + 9, this.y + 22)) {
            this.x -= 1;
          }
          if (game.input.right && !map.hitTest(this.x + 22, this.y + 9) && !map.hitTest(this.x + 22, this.y + 22)) {
            this.x += 1;
          }
          if (game.input.up && !map.hitTest(this.x + 9, this.y + 9) && !map.hitTest(this.x + 22, this.y + 9)) {
            this.y -= 1;
          }
          if (game.input.down && !map.hitTest(this.x + 9, this.y + 22) && !map.hitTest(this.x + 22, this.y + 22)) {
            this.y += 1;
          }
          //ゲーム終了処理
          if (this.x >= 256 && this.y >= 256) {
            var clear = new Sprite(189, 97);
            clear.image = game.assets['end.png'];
            clear.x = 56;
            clear.y = 90;
            game.rootScene.addChild(clear);
            game.stop();
          }
        });
          this.scale(0.5, 0.5);
          game.rootScene.addChild(this);
      }
    });
    //熊さん生成
    var bear = new Bear(8, 8);
    
    //クマ次郎さんクラス
    var EBear = Class.create(Sprite, {
      initialize: function(x, y) {
        Sprite.call(this, 32, 32);
        this.x = x;
        this.y = y;
        this.frame = 5;
        this.image = game.assets['chara1.png'];
        this.on('enterframe', function() {
          switch (Math.floor(Math.random() * 4)) {
            case 0:
              if (!map.hitTest(this.x + 8, this.y + 8) && !map.hitTest(this.x + 8, this.y + 23)) {
                this.tl.waitUntil(function() {
                  this.x -= 1;
                  return (!map.hitTest(this.x + 23, this.y + 8) && !map.hitTest(this.x + 23, this.y + 23)) || ((!map.hitTest(this.x + 8, this.y + 7) && !map.hitTest(this.x + 23, this.y + 7)) || (!map.hitTest(this.x + 8, this.y + 24) && !map.hitTest(this.x + 23, this.y + 24)));
                });
              }
              break;
            case 1:
              if (!map.hitTest(this.x + 23, this.y + 8) && !map.hitTest(this.x + 23, this.y + 23)) {
                this.tl.waitUntil(function() {
                  this.x += 1;
                  return (!map.hitTest(this.x + 8, this.y + 8) && !map.hitTest(this.x + 8, this.y + 23)) || (!map.hitTest(this.x + 8, this.y + 7) && !map.hitTest(this.x + 23, this.y + 7)) || (!map.hitTest(this.x + 8, this.y + 24) && !map.hitTest(this.x + 23, this.y + 24));
                });
              }
              break;
            case 2:
              if (!map.hitTest(this.x + 8, this.y + 7) && !map.hitTest(this.x + 23, this.y + 7)) {
                this.tl.waitUntil(function() {
                  this.y -= 1;
                  return (!map.hitTest(this.x + 8, this.y + 8) && !map.hitTest(this.x + 8, this.y + 23)) || (!map.hitTest(this.x + 23, this.y + 8) && !map.hitTest(this.x + 23, this.y + 23)) || (!map.hitTest(this.x + 8, this.y + 24) && !map.hitTest(this.x + 23, this.y + 24));
                });
              }
              break;
            case 3:
              if (!map.hitTest(this.x + 8, this.y + 24) && !map.hitTest(this.x + 23, this.y + 24)) {
                this.tl.waitUntil(function() {
                  this,y += 1;
                  return (!map.hitTest(this.x + 8, this.y + 8) && !map.hitTest(this.x + 8, this.y + 23)) || (!map.hitTest(this.x + 23, this.y + 8) && !map.hitTest(this.x + 23, this.y + 23)) || (!map.hitTest(this.x + 8, this.y + 7) && !map.hitTest(this.x + 23, this.y + 7))
                });
              }
              break;
            }
            //ゲームオーバー処理
            this.on('enterframe', function() {
              if (this.within(bear, 8)) {
              var clear = new Sprite(189, 97);
              clear.image = game.assets['end.png'];
              clear.x = 56;
              clear.y = 90;
              game.rootScene.addChild(clear);
              game.stop();
            }
          });
        });
        this.scale(0.5, 0.5);
        game.rootScene.addChild(this);
      }
    });
    //クマ次郎さん生成
    var ebear = new EBear(264, 264);
    
    //得点の玉クラス
    var PointDot = Class.create(Sprite, {
      initialize: function(x, y) {
        Sprite.call(this, 16, 16);
        this.x = x;
        this.y = y;
        this.frame = 46;
        this.image = game.assets['icon0.png'];
        //得点書き換え
        this.on('enterframe', function() {
          if (this.within(bear, 5)) {
            this.parentNode.removeChild(this);
            game.score += 5;
            pointsLabel.text = "Score : " + game.score;
          }
        });
        game.rootScene.addChild(this);
      }
    });
    //得点の玉を描画
    var pointDot = [];
    for (var i = 0; i < 19; i++) {
      pointDot[i] = [,,,,,,,,,,,,,,,,,,]
    }
    for (var i = 0; i < 19; i++) {
      for (var j = 0; j < 19; j++) {
        if (baseMap[i][j] == 5) {
          pointDot[i][j] = new PointDot(i * 16, j * 16);
        } else {
          pointDot[i][j] = null;
        }
      }
    }
  };
  game.start();
};
