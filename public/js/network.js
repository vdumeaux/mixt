function TOMGraph(s, tissue){
    //s.graph = s.graph.clear() 

    var h = 700//$("#tab-"+tissue).height();
    var w = $("#nettabs").width();
 
    $("#graph-container-"+tissue).height(h)
    $("#graph-container-"+tissue).width(w)

   s.bind("clickNode", function(d){
       var module = d.data.node.module; 
       var path = "/modules/"+tissue+"/"+module+"/cohort/all"
       var url = "http://"+window.location.host+path
       window.location.href=url
   })


    loadStart(); 
    
    $.get('/tomgraph/'+tissue+'/nodes/json',
        function(data){
            var nodes = JSON.parse(data);
            $.get('/tomgraph/'+tissue+'/edges/json',
                function(data){
                    var edges = JSON.parse(data)

                    for(var i = 0; i < nodes.length; i++){
                        nodes[i].label = nodes[i].id + " ("+nodes[i].color+")"
                        nodes[i].module = nodes[i].color 
                        nodes[i].color = getHexColor(nodes[i].color)
                        nodes[i].size = 1;
                        nodes[i].x = nodes[i].x// * 100;
                        nodes[i].y = nodes[i].y// * 100; 
                    }

                    s.graph.read({
                        nodes: nodes,
                        edges: edges
                    })
                    s.refresh(); 
                    //
                    // nasty window resize hack
                    window.dispatchEvent(new Event('resize'))
                    loadStop(); 
                })
        })

}

function getHexColor(colorStr) {
    var a = document.createElement('div');
    a.style.color = colorStr;
    var colors = window.getComputedStyle( document.body.appendChild(a) ).color.match(/\d+/g).map(function(a){ return parseInt(a,10); });
    document.body.removeChild(a);
    return (colors.length >= 3) ? '#' + (((1 << 24) + (colors[0] << 16) + (colors[1] << 8) + colors[2]).toString(16).substr(1)) : false;
}

