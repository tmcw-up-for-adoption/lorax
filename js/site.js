var mm = com.modestmaps;
$(window).load(function() {
    wax.tilejson('http://api.tiles.mapbox.com/v2/mapbox.geography-class.jsonp',
        function(tj) {
        var map = new mm.Map('map', new wax.mm.connector(tj), null, []);
        map.setCenterZoom(new mm.Location(0, 0), 3);
        wax.tilejson('http://api.tiles.mapbox.com/v2/tmcw.clouds_afe389.jsonp',
            function(tj2) {
            lorax.add(map, tj2);
        });
    });
});
