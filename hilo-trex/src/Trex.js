
(function(ns){

var Trex = ns.Trex = Hilo.Class.create({
    // Extends - 指定要继承的父类。
    Extends: Hilo.Sprite, // 动画精灵类。
    constructor: function(properties){
        Trex.superclass.constructor.call(this, properties);
        // 往精灵动画序列中增加帧。
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
                trexReady: [0],
                trexRuning: [1,2],
                trexOver: [3,4]  
            }
        });

        this.addFrame(this.trexAtlas.getSprite('trexReady')); // 
        this.interval = 6;
        console.log(this._frames);
        var raio = 1.2;
        this.boundsArea = [ // 可视对象的区域顶点数组。
                            {x:20/raio, y:0/raio}, 
                            {x:20/raio, y:9/raio},
                            {x:0/raio, y:11/raio},
                            {x:0/raio, y:28/raio},
                            {x:8/raio, y:42/raio},
                            {x:22/raio, y:42/raio},
                            {x:42/raio, y:15/raio},
                            {x:42/raio, y:0/raio},
                        ];
        this.gravity = 10 / 1000 * 0.2; // 设置重力加速度
        this.flyHeight = 80;
        this.initVelocity = Math.sqrt(2 * this.flyHeight * this.gravity);
    },

    startX: 0, //小鸟的起始x坐标
    startY: 0, //小鸟的起始y坐标
    groundY: 0, //地面的坐标
    gravity: 0, //重力加速度
    flyHeight: 0, //小鸟每次往上飞的高度
    initVelocity: 0, //小鸟往上飞的初速度

    isDead: true, //小鸟是否已死亡
    isUp: false, //小鸟是在往上飞阶段，还是下落阶段
    flyStartY: 0, //小鸟往上飞的起始y轴坐标
    flyStartTime: 0, //小鸟飞行起始时间

    init: function(properties){
    },
    // 游戏准备状态
    getReady: function(){
    //设置起始坐标
    this.x = this.startX;
    this.y = this.startY;
   
    },

    // 游戏开始状态-恐龙走路状态
    startFly: function(){

        console.log(this.trexAtlas);
        this.addFrame(this.trexAtlas.getSprite('trexRuning'),0); // 

        console.log(this._frames);
        this.interval = 6;

        this.play(); // 播放精灵动画。
        this.isDead = false;
        // //记录往上飞的起始y轴坐标
        this.flyStartY = this.y;
        // //记录飞行开始的时间
        this.flyStartTime = +new Date();
    },
      // 游戏结束时状态
      stopFly: function(){
        this.isDead = true;

        this.addFrame(this.trexAtlas.getSprite('trexOver'),0); // 
        this.play(); // 播放精灵动画。
    },
    // 游戏执行过程
    onUpdate: function(){
        console.log('onupdate trex')
        if(this.isDead) return;
        // 飞行时间
        var time = (+new Date()) - this.flyStartTime;
        // 飞行距离 - 根据竖直上抛运动位移计算公式
        var distance = this.initVelocity * time - 0.5 * this.gravity * time * time;
        // y轴坐标
        var y = this.flyStartY - distance;

        if(y <= this.groundY){
            // 未落地
            this.y = y;
            if(distance > 0 && !this.isUp){
                this.isUp = true;
            }else if(distance < 0 && this.isUp){
                this.isUp = false;
            }
        }else{
            // 已经落地，即死亡
            this.y = this.groundY;
            this.isDead = true;
        }
    }
});

})(window.game);