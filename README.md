# Hilo_project
sela的HiloJS练习库

hilo-sela : hilo 入门 hello world
hilo-trex : 小恐龙游戏练习


# 前言

前段时间突然想尝试下小游戏，经过2天的各种游戏框架评测和根据自己的情况决定首先尝试下阿里的HiloJS。因为之前没做过小游戏，看了Hilo的文档也是云里雾里，似懂非懂，真正做起来肯定不是自己想的那样，还是得玩一下才行呐。风靡一时的小恐龙游戏是一个很好的练手小游戏，于是决定实现Hilo版的小恐龙。


# 开始准备

万事开头难，没有游戏经验的我只能是看着好玩，但又不知如何下手。

我一点也不着急看API文档，因为看了于我也没啥用啊。于是先从教程文档入手。

快速开始

游戏开发过程：

创建舞台 -> 创建定时器 -> 创建可视对象 -> 事件交互

噢！游戏就是这么回事，在一个舞台上，创建一个或多个可视对象，定时的监听可视对象行为来进行事件交互。

嗯～看个栗子来学习下吧～于是来仔细研究Hilo官方提供的Flappy Bird。

勤勤恳恳的学习独立版Flappy Bird【[官网传送门](http://hiloteam.github.io/tutorial/flappybird.html)】。

通读完Flappy Bird还是有很多收获的（项目目录结构，游戏逻辑实现等，这些官网资料介绍很详细建议自己结合源码多读几遍），但是由于对HiloJS API还不熟悉，需要一个类似hello world版本的API入门deomo，来熟悉如何使用。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script type="text/javascript" src="hilo/hilo-standalone.js"></script>
</head>

<body>
    <div id="game-container"></div>
    <script>
        // 1.创建舞台
        // 舞台Stage是一个各种图形、精灵动画等的总载体。所以可见的对象都要添加到舞台或其子容器后，才会被渲染出来。
        var stage = new Hilo.Stage({
            renderType: 'canvas',
            container: document.getElementById('game-container'),  //父容器
            width: 320,
            height: 480
        });
       // 2.创建可视对象
       // 舞台上的一切对象都是可视对象，可以是图片、精灵、文字、图形，甚至DOM元素等等。Hilo提供了一些基本的可视类供您使用，比如添加一个图片到舞台上：
        var bird = new Hilo.Bitmap({
            image: 'images/bird.png'
            , rect: [0, 0, 100, 100]
        }).addTo(stage);

        // 3.创建定时器
        // 舞台Stage上的物体的运动等变化，都是通过一个定时器Ticker不断地调用Stage.tick()方法来实现刷新的。      
        var ticker = new Hilo.Ticker(1); // 指定定时器的运行帧率。默认60。
        ticker.addTick(stage);
        ticker.start();

        // 4.事件交互
        // 要想舞台上的图形、精灵动画等对象能响应用户的点击、触碰等交互事件，就必需先为舞台开启DOM事件响应，然后就可以使用View.on()来响应事件。
        stage.enableDOMEvent(Hilo.event.POINTER_START, true);
        bird.on(Hilo.event.POINTER_START, function (e) {
            console.log(e.eventTarget, e.stageX, e.stageY);
        });

        // 5.监听舞台的变化-实际就是定时执行
        // onUpdate:Function
        // 更新可视对象，此方法会在可视对象渲染之前调用。此函数可以返回一个Boolean值。若返回false，则此对象不会渲染。默认值为null。 限制：如果在此函数中改变了可视对象在其父容器中的层级，当前渲染帧并不会正确渲染，而是在下一渲染帧。可在其父容器的onUpdate方法中来实现。
        this.stage.onUpdate = function () {
            console.log("sela"); // 根据定时器情况会定时执行
        }
    </script>
</body>
</html>
```

# 小恐龙游戏

小恐龙游戏过程

前期准备就绪，开始你的表演（shou nue）了。

## 目录结构

参考flappy bird可以把小恐龙游戏也划分几大类：

1.Asset.js 静态资源类，存储各类静态资源-只有一张sprite图
2.Trex.js 小恐龙类，记录小恐龙的行为
3.Holdbacks.js 障碍物类，记录障碍物
4.background.js 地面背景-实际简化在game.js了
5.game.js 记录主游戏过程

**游戏状态：**
`ready` 准备开始
`playing` 进行中
`over` 结束


## 起跳运动
小恐龙上跳过程可以看作是一个竖直上抛运动，根据位移公式可以得到上抛的高度。

根据上抛运动位移公式：h = v*t - 1/2g*t*t

```js
// 飞行时间
var time = (+new Date()) - this.flyStartTime;
// 飞行距离 - 根据竖直上抛运动位移计算公式
var distance = this.initVelocity * time - 0.5 * this.gravity * time * time;
// y轴坐标
var y = this.flyStartY - distance;
```

## 地面无缝缓动

通过观察图片，前600px基本直线，通过代码拼接600px形成对称，在循环运动来就可以达到无缝连接。利用HiloJS的Container类，将ground1和ground2合成一个ground，合并运动，这样避免单调设置缓动。

代码实现如下：

```js
  // 地面
 this.ground1 = new Hilo.Bitmap({
    id: 'ground1',
    image: this.asset.trexSprites,
    rect:[0,52, 1200, 68]
}).addTo(this.stage);

this.ground2 = new Hilo.Bitmap({
    id: 'ground2',
    image: this.asset.trexSprites,
    rect:[0,52, 600, 68]
});

this.ground1.x = 0;
this.ground2.x = this.ground1.x+1200;
//设置地面的y轴坐标
this.ground1.y = this.ground2.y = this.height - this.ground1.height;

// 将ground1和ground2合成一个ground，合并运动
this.ground = new Hilo.Container({
}).addTo(this.stage);
// 地面y轴-给小恐龙类和障碍物类作基准
this.ground.groundY = this.ground1.y;
this.ground.addChild(this.ground1,this.ground2);

// 地面缓动        
this.groundTween = Hilo.Tween.to(this.ground, {
    x: -1200
}, {
    time: 5000,
    loop: true
});
            
```

效果图：

## 小恐龙动画

**游戏状态：**
`ready` 准备开始
`playing` 进行中
`over` 结束

根据游戏状态有3种，小恐龙的变化也有3种，第一个是准备状态，第二个是走路状态，第三个是碰撞时瞳孔睁大状态。如何在Trex类中实现这3种状态的变化呢？

可以使用动画精灵类Sprite。将用到的sprite图放到TextureAtlas（`TextureAtlas纹理集是将许多小的纹理图片整合到一起的一张大图。这个类可根据一个纹理集数据读取纹理小图、精灵动画等。`）

```js
this.trexAtlas = new Hilo.TextureAtlas({
            image: properties.image,
            frames: [
                [38,0, 44, 47],
                [765, 0, 44, 47],
                [809, 0, 44, 47],
                [853, 0, 44, 47],
                [853, 0, 44, 47],
            ],
            sprites: {
                trexReady: [0], // 准备状态
                trexRuning: [1,2], // 进行中
                trexOver: [3,4]  // 结束状态
            }
        });
```

然后再根据游戏状态进行添加到游戏场景中

```js
// 添加trexRuning sprite，从index为0开始添加。
this.addFrame(this.trexAtlas.getSprite('trexRuning'),0); 
```

>需要注意的是，添加时如果后面sprite数<前面的，则会在保留后面的帧。如果你想覆盖就再加一帧。






## 碰撞检测

HiloJS有检测指定对象是否相交的方法，能够很方便用于碰撞检测。
```js
// 检测object参数指定的对象是否与其相交。
hitTestObject(object:View, usePolyCollision:Boolean)
```
```js
// 障碍物类中-碰撞检测
checkCollision: function(trex) {
    for (var i = 0, len = this.children.length; i < len; i++) {
        if (trex.hitTestObject(this.children[i], true)) {
            return true;
        }
    }
    return false;
}
```

监测碰撞时还有个问题需要注意：注意碰撞的区域，可以通过设置boundsArea进行人工描边碰撞体。

```js
// 可视对象的区域顶点数组。格式为：[{x:10, y:10}, {x:20, y:20}]
boundsArea:Array
```


## 恐龙动画


## 游戏声效

恐龙上跳和游戏失败的声效采用Hilo中WebSound实现，Hilo还有HTMLAudio、WebAudio模块，大家可以查看api按需使用。

```js
var audio = WebSound.getAudio({
    src: 'test.mp3',
    loop: false,
    volume: 1
}).on('load', function(e){
    console.log('load');
}).on('end', function(e){
    console.log('end');
}).play();
```
[官方代码传送门](https://hiloteam.github.io/Hilo/examples/WebSound.html)

# 小结

* Hilo版小恐龙游戏实现了大部分功能（除了记分和多种障碍物），已经可以简单的玩起来了。因为已经达到我熟悉HiloJS的初衷，所以没有继续再完善。有兴趣的可以自己完善。
* 游戏规划，思考运动技巧-比如无缝连接的方式，方式有多种，如何实现才简洁明了。
* Hilo库的api的使用讲解不太明确，有时需要查看源码来理解用法。
