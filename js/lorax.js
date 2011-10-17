(function(context) {
    var lorax = {},
        mm = com.modestmaps,
        h; // handler

    var parallaxHandler = function(lowermap, distance) {
        this.lowermap = lowermap;
        this.distance = distance;
    };

    parallaxHandler.prototype = {

        init: function(map, lowermap) {
            this.map = map;
            mm.addEvent(map.parent, 'mousedown', mm.bind(this.mouseDown, this));
        },

        setDistance: function(x) {
            this.distance = x;
            return this;
        },

        mouseDown: function(e) {
            mm.addEvent(document, 'mouseup', this._mouseUp = mm.bind(this.mouseUp, this));
            mm.addEvent(document, 'mousemove', this._mouseMove = mm.bind(this.mouseMove, this));

            this.prevMouse = new mm.Point(e.clientX, e.clientY);
            this.map.parent.style.cursor = 'move';

            return mm.cancelEvent(e);
        },

        mouseMove: function(e) {
            if (this.prevMouse) {
                this.lowermap.panBy(
                    e.clientX - this.prevMouse.x,
                    e.clientY - this.prevMouse.y);
                this.map.panBy(
                    this.distance * (e.clientX - this.prevMouse.x),
                    this.distance * (e.clientY - this.prevMouse.y));
                    this.prevMouse.x = e.clientX;
                    this.prevMouse.y = e.clientY;
                    this.prevMouse.t = +new Date();
            }

            return mm.cancelEvent(e);
        },

        mouseUp: function(e) {
            mm.removeEvent(document, 'mouseup', this._mouseUp);
            mm.removeEvent(document, 'mousemove', this._mouseMove);

            this.prevMouse = null;
            this.map.parent.style.cursor = '';

            return mm.cancelEvent(e);
        }
    };

    var slowrandom = (function() {
        var o = [];
        for (var i = 0; i < 100; i++) {
            o.push([
                   Math.random() - 0.5,
                   Math.random() - 0.5
            ]);
        }
        return o;
    })();

    var fastrandom = (function() {
        var o = [];
        for (var i = 0; i < 100; i++) {
            o.push([
                   Math.random() - 0.5,
                   Math.random() - 0.5
            ]);
        }
        return o;
    })();

    lorax.distance = function(x) {
        return h.setDistance(x);
    };

    lorax.add = function(map, tj, options) {

        var loraxmap = new mm.Map(
            map.parent,
            new wax.mm.connector(tj),
            null, [
                h = new parallaxHandler(map, 1.7),
                new mm.DoubleClickHandler(),
                new mm.TouchHandler(),
                new mm.MouseWheelHandler()
            ]);

        loraxmap.addCallback('zoomed', function() {
            map.setZoom(loraxmap.getZoom());
        });

        loraxmap.setCenterZoom(map.getCenter(), map.getZoom());

        var starttime = +new Date(),
            duration = +new Date();

        var jitter = window.setInterval(function jitterPan() {
            var slowi = (((duration - starttime) / 4000) % 100) | 0,
                fasti = (((duration - starttime) / 400) % 100) | 0;
            var slowv = slowrandom[slowi],
                fastv = fastrandom[fasti];
            var damp = 0.4;

            loraxmap.panBy(
                damp * (slowv[0] + fastv[0]),
                damp * (slowv[1] + fastv[1])
            );
        }, 20);

        return this;
    };

    context.lorax = lorax;
})(this);
