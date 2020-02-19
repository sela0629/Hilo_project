
(function(ns){
// 此方法是在Hilo中创建类的主要方法。
var Asset = ns.Asset = Hilo.Class.create({
    
    /******************* Mixes - 指定要混入的成员集合对象。。****************/
    Mixes: Hilo.EventMixin,
    
    /******************* Statics - 指定类的静态属性或方法。****************/
    queue: null,
    bg: null,
    ground: null,
    ready: null,
    over: null,
    numberGlyphs: null,
    birdAtlas: null,
    holdback: null,
    
    /******************* Statics - 指定类的静态属性或方法。****************/
// 预加载图片
// 为了让玩家有更流畅的游戏体验，图片素材一般需要预先加载。Hilo提供了一个队列下载工具LoadQueue，
// 使用它可以预加载图片素材。如下所示，在Asset类中，我们定义了load方法：
    load: function(){
        var resources = [
            {id:'bg', src:'images/bg.png'},
            {id:'ground', src:'images/ground.png'},
            {id:'ready', src:'images/ready.png'},
            {id:'over', src:'images/over.png'},
            {id:'number', src:'images/number.png'},
            {id:'bird', src:'images/bird.png'},
            {id:'holdback', src:'images/holdback.png'}
        ];
        // 队列下载工具
        this.queue = new Hilo.LoadQueue();
        this.queue.add(resources);
        // 增加一个事件监听。
        // 监听complete事件。
        this.queue.on('complete', this.onComplete.bind(this));
        this.queue.start();
    },
    // complete - 当所有资源下载完成时发生
    onComplete: function(e){
        this.bg = this.queue.get('bg').content;
        this.ground = this.queue.get('ground').content;
        this.ready = this.queue.get('ready').content;
        this.over = this.queue.get('over').content;
        this.holdback = this.queue.get('holdback').content;

        // 纹理集TextureAtlas实例
        // TextureAtlas纹理集是将许多小的纹理图片整合到一起的一张大图。
        // 这个类可根据一个纹理集数据读取纹理小图、精灵动画等。
        this.birdAtlas = new Hilo.TextureAtlas({
            image: this.queue.get('bird').content,
            frames: [
                [0, 120, 86, 60], 
                [0, 60, 86, 60], 
                [0, 0, 86, 60]
            ],
            sprites: {
                bird: [0, 1, 2]
            }
        });

        var number = this.queue.get('number').content;
        this.numberGlyphs = {
            0: {image:number, rect:[0,0,60,91]},
            1: {image:number, rect:[61,0,60,91]},
            2: {image:number, rect:[121,0,60,91]},
            3: {image:number, rect:[191,0,60,91]},
            4: {image:number, rect:[261,0,60,91]},
            5: {image:number, rect:[331,0,60,91]},
            6: {image:number, rect:[401,0,60,91]},
            7: {image:number, rect:[471,0,60,91]},
            8: {image:number, rect:[541,0,60,91]},
            9: {image:number, rect:[611,0,60,91]}
        };
        // 删除一个事件监听。如果不传入任何参数，则删除所有的事件监听；
        // 如果不传入第二个参数，则删除指定类型的所有事件监听。
        this.queue.off('complete');
        // TODO 不理解为啥删除了这事件，还要发送这事件。
        // 发送事件。当第一个参数类型为Object时，则把它作为一个整体事件对象。
        this.fire('complete');
    }
});

})(window.game); // 传参并执行