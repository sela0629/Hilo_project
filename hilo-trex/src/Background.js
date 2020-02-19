
(function(ns){

var Background = ns.Background = Hilo.Class.create({
    Extends: Hilo.Container,
    ground1:null,
    ground2:null,
    constructor: function(properties){
        Background.superclass.constructor.call(this, properties);
        this.init(properties);
    },

    init: function(properties){
        //准备Get Ready!
        this.ground1 = new Hilo.Bitmap({
            id: 'ground1',
            image: properties.image,
            rect:[0,52, 1200, 68]
        });
        this.ground1.x = 0;
        //设置地面的y轴坐标
        this.ground1.y = this.height - this.ground1.height;
        this.ground2 = new Hilo.Bitmap({
            id: 'ground2',
            image: properties.image,
            rect:[0,52, 600, 68]
        });
        this.ground2.x = this.ground1.x+1200;
        //设置地面的y轴坐标
        this.ground2.y = this.height - this.ground2.height;
      

        this.addChild(this.ground1, this.ground2);

        // //准备Get Ready!
        // var getready = new Hilo.Bitmap({
        //     image: properties.image,
        //     rect: [0, 0, 508, 158]
        // });

        // //开始提示tap
        // var tap = new Hilo.Bitmap({
        //     image: properties.image,
        //     rect: [0, 158, 286, 246]
        // });
        
        // //确定getready和tap的位置
        // tap.x = this.width - tap.width >> 1;
        // tap.y = this.height - tap.height + 40 >> 1;
        // getready.x = this.width - getready.width >> 1;
        // getready.y = tap.y - getready.height >> 0;

        // this.addChild(tap, getready);
    }
});

})(window.game);