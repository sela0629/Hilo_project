
(function(ns){

    var Holdbacks = ns.Holdbacks = Hilo.Class.create({
        Extends: Hilo.Container,
        constructor: function(properties){
            Holdbacks.superclass.constructor.call(this, properties);
            
            //管子之间的水平间隔
            this.hoseSpacingX = 300;
            //上下管子之间的垂直间隔，即小鸟要穿越的空间大小
            this.hoseSpacingY = 0;
            //管子的总数（上下一对管子算一个）
            this.numHoses = 4;
            //移出屏幕左侧的管子数量，一般设置为管子总数的一半
            this.numOffscreenHoses = this.numHoses * 0.5;
            //管子的宽度（包括管子之间的间隔）
            // this.hoseWidth = 148 + this.hoseSpacingX;
            this.hoseWidth = 30+this.hoseSpacingX;
            //初始化障碍的宽和高
            this.width = this.hoseWidth * this.numHoses;
            this.height = properties.height;
    
            this.reset();
            this.createHoses(properties.image);
            this.moveTween = new Hilo.Tween(this, null, {
                onComplete: this.resetHoses.bind(this)
            });
        },
    
        startX: 0, //障碍开始的起始x轴坐标
        groundY: 0, //地面的y轴坐标
    
        hoseSpacingX: 300, //管子之间的水平间隔
        hoseSpacingY: 0, //上下管子之间的垂直间隔
        numHoses: 0, //管子的总数（上下一对管子算一个）
        numOffscreenHoses: 0, //移出屏幕左侧的管子数量
        hoseWidth: 0, //管子的宽度（包括管子之间的间隔）
    
        passThrough: 0, //穿过的管子的数量，也即移出屏幕左侧的管子的数量
    
        // 创建柱子
        createHoses: function(image){
            console.log('createHoses');
            for(var i = 0; i < this.numHoses; i++){
                console.log(this.numHoses);
                var downHose = new Hilo.Bitmap({
                    id: 'down' + i,
                    image: image,
                    rect: [225,0, 38, 50],
                }).addTo(this);
    
                this.placeHose(downHose, i);
            }           
        },
    
        // 放置柱子
        placeHose: function(down, index){
            down.x = this.hoseWidth * index;
            down.y = this.groundY-40;
        },
    
        resetHoses: function(){
            // children:Array 容器的子元素列表。只读。
            var total = this.children.length;
            //把已移出屏幕外的管子放到队列最后面，并重置它们的可穿越位置
            for(var i = 0; i < this.numOffscreenHoses; i++){
                var downHose = this.getChildAt(0);
                // var upHose = this.getChildAt(1);
                // 设置子元素的索引位置。
                this.setChildIndex(downHose, total - 1);
                // this.setChildIndex(upHose, total - 1);
                this.placeHose(downHose,this.numOffscreenHoses + i);
            }
            
            //重新确定队列中所有管子的x轴坐标
            for(var i = 0; i < total - this.numOffscreenHoses; i++){
                var hose = this.getChildAt(i);
                hose.x = this.hoseWidth * (i * 0.5 >> 0);
            }
    
            //重新确定障碍的x轴坐标
            this.x = 0;
    
            //更新穿过的管子数量
            this.passThrough += this.numOffscreenHoses;
    
            //继续移动
            this.startMove();
            Hilo.Tween._tweens.push(this.moveTween);
        },
        // 开始移动
        startMove: function(){
            //设置缓动的x轴坐标
            var targetX = -this.hoseWidth *(1+this.numOffscreenHoses);
            //设置缓动时间
            this.moveTween.duration = (this.x - targetX) * 4;
            //设置缓动的变换属性，即x从当前坐标变换到targetX
            this.moveTween.setProps({x:this.x}, {x:targetX});
            //启动缓动动画
            this.moveTween.start();
        },
    
        stopMove: function(){
            if(this.moveTween) this.moveTween.pause();
        },
        // 碰撞检测
        checkCollision: function(trex){
            for(var i = 0, len = this.children.length; i < len; i++){
                if(trex.hitTestObject(this.children[i], true)){
                    return true;
                }
            }
            return false;
        },
    
        calcPassThrough: function(x){
            var count = 0;
    
            x = -this.x + x;
            if(x > 0){
                var num = x / this.hoseWidth + 0.5 >> 0;
                count += num;
            }
            count += this.passThrough;
    
            return count;
        },
    
        reset: function(){
            this.x = this.startX;
            this.passThrough = 0;
        }
        
    });
    
    })(window.game);