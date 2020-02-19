(function(){
      // 1.创建舞台
        // 舞台Stage是一个各种图形、精灵动画等的总载体。所以可见的对象都要添加到舞台或其子容器后，才会被渲染出来。
        this.stage = new Hilo.Stage({
            renderType: 'canvas',
            container: document.getElementById('game-container'),  //父容器
            width: 320,
            height: 480,
            background: 'lightblue' // 背景颜色
        });
       // 2.创建可视对象
       // 舞台上的一切对象都是可视对象，可以是图片、精灵、文字、图形，甚至DOM元素等等。Hilo提供了一些基本的可视类供您使用，比如添加一个图片到舞台上：
        var bird = new Hilo.Bitmap({
            image: './images/bird.png'
            , rect: [0, 0, 100, 100]
        }).addTo(stage);
        bird.x = 100;
        bird.y = 100;

        var holdback = new Hilo.Bitmap({
            image: './images/bird.png'
            , rect: [0, 0, 100, 100]
        }).addTo(stage);
        holdback.x = 100;
        holdback.y = 100;

      
        // 3.创建定时器
        // 舞台Stage上的物体的运动等变化，都是通过一个定时器Ticker不断地调用Stage.tick()方法来实现刷新的。      
        var ticker = new Hilo.Ticker(1); // 指定定时器的运行帧率。默认60。
        ticker.addTick(stage); // 添加定时器对象。定时器对象必须实现 tick 方法。
        ticker.start();

        // 4.事件交互
        // 要想舞台上的图形、精灵动画等对象能响应用户的点击、触碰等交互事件，就必需先为舞台开启DOM事件响应，然后就可以使用View.on()来响应事件。
        stage.enableDOMEvent(Hilo.event.POINTER_START, true);
        bird.on(Hilo.event.POINTER_START, function (e) {
            console.log(e.eventTarget, e.stageX, e.stageY);
        });

        if(bird.hitTestObject(holdback)){
           alert(true);
        }

        // 5.监听舞台的变化-实际就是定时执行
        // onUpdate:Function
        // 更新可视对象，此方法会在可视对象渲染之前调用。此函数可以返回一个Boolean值。若返回false，则此对象不会渲染。默认值为null。 限制：如果在此函数中改变了可视对象在其父容器中的层级，当前渲染帧并不会正确渲染，而是在下一渲染帧。可在其父容器的onUpdate方法中来实现。
        var me = this;
        this.stage.onUpdate = function () {
            console.log("sela");
            console.log(window.bird);
            if(bird.hitTestObject(holdback)){
                console.log("true");
             }
        }

        var spriteDemo = new Hilo.Sprites({

        });
        var trexAtlas = new Hilo.TextureAtlas({
            image: './images/offline-sprite-1x.png',
            frames: [
                //[675, 0, 44, 47], 
                //[721, 0, 44, 47], 
                [765, 0, 44, 47],
                 [809, 0, 44, 47],
                 // [853, 0, 44, 47]
            ],
            sprites: {
                trex: [0, 1] // 
            }
        });

        spriteDemo.addFrame(this.trexAtlas.getSprite('trex')); // 
        

})()