
(function(ns){

var Bird = ns.Bird = Hilo.Class.create({
    // Extends - 指定要继承的父类。
    Extends: Hilo.Sprite, // 动画精灵类。
    constructor: function(properties){
        Bird.superclass.constructor.call(this, properties);
        // 往精灵动画序列中增加帧。
        // TODO atlas
        this.addFrame(properties.atlas.getSprite('bird'));
        this.interval = 6;
        this.pivotX = 43;
        this.pivotY = 30;

        this.gravity = 10 / 1000 * 0.3;
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

    getReady: function(){
        //设置起始坐标
        this.x = this.startX;
        this.y = this.startY;

        this.rotation = 0;
        this.interval = 6;
        this.play();
        this.tween = Hilo.Tween.to(this, {y:this.y + 10, rotation:-8}, {duration:400, reverse:true, loop:true});
    },

    startFly: function(){
        //恢复小鸟状态
        this.isDead = false;
        //减小小鸟精灵动画间隔，加速小鸟扇动翅膀的频率
        this.interval = 3;
        //记录往上飞的起始y轴坐标
        this.flyStartY = this.y;
        //记录飞行开始的时间
        this.flyStartTime = +new Date();
        //停止之前的缓动动画
        if(this.tween) this.tween.stop();
    },
    // 飞行过程
    // 我们要在每次游戏画面更新渲染小鸟的时候调用此方法
    // 来确定当前时刻小鸟的坐标位置。Hilo的可视对象View提供了一个onUpdate方法属性，此方法会在可视对象每次渲染之前调用，
    // 于是，我们需要实现小鸟的onUpdate方法。
    onUpdate: function(){
        if(this.isDead) return;
        
        //飞行时间
        var time = (+new Date()) - this.flyStartTime;
        //飞行距离
        var distance = this.initVelocity * time - 0.5 * this.gravity * time * time;
        //y轴坐标
        var y = this.flyStartY - distance;

        if(y <= this.groundY){
            //小鸟未落地
            this.y = y;
            if(distance > 0 && !this.isUp){
                //往上飞时，角度上仰20度
                this.tween = Hilo.Tween.to(this, {rotation:-20}, {duration:200});
                this.isUp = true;
            }else if(distance < 0 && this.isUp){
                //往下跌落时，角度往下90度
                this.tween = Hilo.Tween.to(this, {rotation:90}, {duration:this.groundY - this.y});
                this.isUp = false;
            }
        }else{
            //小鸟已经落地，即死亡
            this.y = this.groundY;
            this.isDead = true;
        }
    }
});

})(window.game);