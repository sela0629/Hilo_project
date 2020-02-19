
(function (ns) {
    // 此方法是在Hilo中创建类的主要方法。
    var Asset = ns.Asset = Hilo.Class.create({

        /******************* Mixes - 指定要混入的成员集合对象。。****************/
        Mixes: Hilo.EventMixin,

        /******************* Statics - 指定类的静态属性或方法。****************/
        queue: null,
        trexSprites: null,
        /******************* Statics - 指定类的静态属性或方法。****************/
        // 预加载图片
        // 为了让玩家有更流畅的游戏体验，图片素材一般需要预先加载。Hilo提供了一个队列下载工具LoadQueue，
        // 使用它可以预加载图片素材。如下所示，在Asset类中，我们定义了load方法：
        load: function () {
            var resources = [
                { id: 'trexSprites', src: './images/offline-sprite-1x.png' },
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
        onComplete: function (e) {
            this.trexSprites = this.queue.get('trexSprites').content;
            // 删除一个事件监听。如果不传入任何参数，则删除所有的事件监听；
            // 如果不传入第二个参数，则删除指定类型的所有事件监听。
            this.queue.off('complete');
            // 发送事件。当第一个参数类型为Object时，则把它作为一个整体事件对象。
            this.fire('complete');
        }
    });

})(window.game);